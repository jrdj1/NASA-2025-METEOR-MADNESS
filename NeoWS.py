import json
import datetime
from api_basics import api_request
import fastapi

app = fastapi.FastAPI()

# Fetch NEO data for browsing all objects
def get_neows_data_browse(api_key,page=0,size=20):
    url = f"https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={api_key}&page={page}&size={size}"
    return api_request(url)

# Fetch NEO data for the current week
def get_neows_data_feed(api_key):
    url = f"https://api.nasa.gov/neo/rest/v1/feed?api_key={api_key}"
    return api_request(url)

# Note: start_date and end_date should be in YYYY-MM-DD format example: 2024-1-1
def get_neows_data_lookup(start_date, end_date, api_key):
    url = f"https://api.nasa.gov/neo/rest/v1/feed?start_date={start_date}&end_date={end_date}&api_key={api_key}"
    return api_request(url)

def get_neows_data_lookup_by_id(neo_id, api_key):
    url = f"https://api.nasa.gov/neo/rest/v1/neo/{neo_id}?api_key={api_key}"
    return api_request(url)

# Analyze the feed data to count NEOs and potentially hazardous ones
def analyze_neows_data_feed(data):
    if "near_earth_objects" not in data:
        return {"error": "Invalid data format"}

    neos = data["near_earth_objects"]
    analysis = {}
    for date, objects in neos.items():
        analysis[date] = {
            "count": len(objects),
            "potentially_hazardous": sum(1 for obj in objects if obj["is_potentially_hazardous_asteroid"]),
            "details": [obj["neo_reference_id"] for obj in objects if not obj["is_potentially_hazardous_asteroid"]],
            "details_hazardous": [obj["neo_reference_id"] for obj in objects if obj["is_potentially_hazardous_asteroid"]]
        }
    return analysis

def save_simplified_today_neo_data(neo_id, data):
    today = datetime.date.today().strftime("%Y-%m-%d")
    # Obtain the closes to today's date approach data
    close_approach_today = [
        cad for cad in data["close_approach_data"]
        if cad["close_approach_date"] == today
    ]

    data["close_approach_data"] = close_approach_today
            
    with open(f"resources/neo_{neo_id}_simplified_data.txt", "w") as file:
        json.dump(data, file, indent=4)
    print(f"Simplified NEO data saved to resources/neo_{neo_id}_simplified_data.txt")


def load_api_key(file_path):
    try:
        with open(file_path, 'r') as file:
            return file.read().strip()
    except FileNotFoundError:
        return None

@app.get("/neo/")
def get_neo(neo_id: str, simple: bool = False):
    api_key = load_api_key('.env')
    if not api_key:
        return {"error": "API key not found"}
    data = get_neows_data_lookup_by_id(neo_id, api_key)
    if simple:
        save_simplified_today_neo_data(neo_id, data)
    return data

@app.get("/hazardous_asteroids")
def get_hazardous_asteroids():
    api_key = load_api_key('.env')
    if not api_key:
        return {"error": "API key not found"}
    data = get_neows_data_feed(api_key)
    analysis = analyze_neows_data_feed(data)
    return analysis

if __name__ == "__main__":
    print("NeoWS API Interaction")
    today = datetime.date.today().strftime("%Y-%m-%d")
    print(f"Today is {today}")

    api_key = load_api_key('.env')
    if not api_key:
        print("API key file not found.")
    else:
        input_choice = input("Enter 'b' for browse, 'f' for feed, or 'l' for lookup, or 'li' for lookup by ID: ").strip().lower()
        start_date = "2024-1-1"
        end_date = "2024-1-7"
        if input_choice == 'b':
            data = get_neows_data_browse(api_key)
        elif input_choice == 'f':
            data = get_neows_data_feed(api_key)
        elif input_choice == 'l':
            data = get_neows_data_lookup(start_date, end_date, api_key)
        elif input_choice == 'li':
            neo_id = input("Enter NEO ID: ").strip()
            data = get_neows_data_lookup_by_id(neo_id, api_key)
        else:
            print("Invalid choice.")
            data = None

        if data:
            print(data)
            pass

        if input_choice != 'li':
            input_choice_2 = input("Enter 'h' to analyze feed data for hazardous asteroids: ").strip().lower()
            if input_choice_2 == 'h':
                analysis = analyze_neows_data_feed(data)
                print(analysis)
                with open(f"resources/hazardous_asteroid_analysis.txt", "w") as file:
                    json.dump(analysis, file, indent=4)
                print(f"Analysis saved to resources/hazardous_asteroid_analysis.txt")
        else:
            save_simplified_today_neo_data(neo_id, data)