import json
import datetime
import requests
import fastapi
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import google.generativeai as genai

app = fastapi.FastAPI()

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
else:
    gemini_model = None

def api_request(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to retrieve data"}
 
# Fetch NEO data for browsing all objects
def get_neows_data_browse(api_key,page=0,size=20):
    url = f"https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={api_key}&page={page}&size={size}"
    data = api_request(url)
    with open("resources/neo_browse_data.json", "w") as file:
        json.dump(data, file, indent=4)
    return data

# Fetch NEO data for the current week
def get_neows_data_feed(api_key):
    url = f"https://api.nasa.gov/neo/rest/v1/feed?api_key={api_key}"
    data = api_request(url) 
    return data

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
            
    with open(f"resources/neo_{neo_id}_simplified_data.json", "w") as file:
        json.dump(data, file, indent=4)
    print(f"Simplified NEO data saved to resources/neo_{neo_id}_simplified_data.json")

#Check if the NEO hits Earth
def check_if_hit(data):
    data = data["near_earth_objects"]
    for object in data:
        for cad in object["close_approach_data"]:
            if cad["orbiting_body"] == "Earth" and float(cad["miss_distance"]["kilometers"]) < 10000:
                print(f"Potential hit detected for NEO ID: {object['neo_reference_id']}")
                with open(f"resources/neo_{object['neo_reference_id']}_hit_data.json", "w") as file:
                    json.dump(object, file, indent=4)
                print(f"Hit NEO data saved to resources/neo_{object['neo_reference_id']}_hit_data.json")

# Obtains meteor data from NASA's NeoWS API
@app.get("/neo/")
def get_neo(neo_id: str, simple: bool = False):
    api_key = os.getenv("NASA_API_KEY")
    if not api_key:
        return {"error": "API key not found"}
    data = get_neows_data_lookup_by_id(neo_id, api_key)
    if simple:
        save_simplified_today_neo_data(neo_id, data)
    return data

# Retrieves the NEO feed data for the current week and analyzes it for hazardous asteroids
@app.get("/hazardous_asteroids")
def get_hazardous_asteroids():
    api_key = os.getenv("NASA_API_KEY")
    if not api_key:
        return {"error": "API key not found"}
    data = get_neows_data_feed(api_key)
    analysis = analyze_neows_data_feed(data)
    return analysis

# Get 5 recent NEOs with detailed information for display
@app.get("/recent_neos")
def get_recent_neos():
    api_key = os.getenv("NASA_API_KEY")
    if not api_key:
        return {"error": "API key not found"}
    
    # We fetch try to fetch the data from cache first
    try:
        with open("resources/recent_neos_cache.json", "r") as file:
            cached_data = json.load(file)
            cache_date = cached_data.get("cache_date")
            if cache_date == datetime.date.today().strftime("%Y-%m-%d"):
                print("Loaded from cache")
                return cached_data["neos"]  # Return cached data if it's from today
    except (FileNotFoundError, json.JSONDecodeError):
        pass  # No valid cache found, proceed to fetch new data

    # Get current week's NEO feed data
    data = get_neows_data_feed(api_key)
    print("Fetched new data from API")

    if "near_earth_objects" not in data:
        return {"error": "Invalid data format"}
    
    neos = data["near_earth_objects"]
    today = datetime.date.today().strftime("%Y-%m-%d")
    tomorrow = (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d")
    print(f"Today: {today}, Tomorrow: {tomorrow}")
    data_neos = []
    for date, objects in neos.items():
        if date == today:
            data_neos.extend(objects)
        elif date == tomorrow:
            data_neos.extend(objects)

    #Saving to cache
    with open("resources/recent_neos_cache.json", "w") as file:
        json.dump({
            "cache_date": datetime.date.today().strftime("%Y-%m-%d"),
            "neos": data_neos
        }, file, indent=4)
    
    return data_neos

# Chatbot endpoint using Gemini AI
@app.post("/chatbot")
async def chatbot(request: dict):
    if not gemini_model:
        return {"error": "Gemini API key not configured"}
    
    try:
        user_message = request.get("message", "")
        neo_data = request.get("neo_data", None)
        
        # Build context for Gemini based on selected NEO data
        context = """Eres un asistente experto en asteroides y objetos cercanos a la Tierra (NEO). 
Tu función es responder preguntas sobre asteroides de forma clara, educativa y precisa.
Siempre responde en español y de manera amigable."""
        
        if neo_data:
            # Extract relevant information from NEO data
            name = neo_data.get("name", "Desconocido")
            diameter = neo_data.get("estimated_diameter", {}).get("meters", {})
            min_diameter = diameter.get("estimated_diameter_min", 0)
            max_diameter = diameter.get("estimated_diameter_max", 0)
            avg_diameter = (min_diameter + max_diameter) / 2
            
            is_hazardous = neo_data.get("is_potentially_hazardous_asteroid", False)
            absolute_magnitude = neo_data.get("absolute_magnitude_h", "N/A")
            
            close_approach = neo_data.get("close_approach_data", [{}])[0]
            velocity = close_approach.get("relative_velocity", {})
            velocity_kmh = velocity.get("kilometers_per_hour", "N/A")
            velocity_kms = velocity.get("kilometers_per_second", "N/A")
            miss_distance = close_approach.get("miss_distance", {})
            miss_distance_km = miss_distance.get("kilometers", "N/A")
            miss_distance_lunar = miss_distance.get("lunar", "N/A")
            approach_date = close_approach.get("close_approach_date_full", "N/A")
            
            context += f"""

INFORMACIÓN DEL ASTEROIDE SELECCIONADO:
- Nombre: {name}
- Diámetro estimado: {min_diameter:.2f} - {max_diameter:.2f} metros (promedio: {avg_diameter:.2f} metros)
- ¿Es potencialmente peligroso?: {'Sí' if is_hazardous else 'No'}
- Magnitud absoluta: {absolute_magnitude}
- Velocidad relativa: {velocity_kms} km/s ({velocity_kmh} km/h)
- Distancia de aproximación: {miss_distance_km} km ({miss_distance_lunar} distancias lunares)
- Fecha de aproximación: {approach_date}

Usa esta información para responder preguntas específicas sobre este asteroide.
Si el usuario pregunta sobre el impacto o daños, recuerda que este asteroide NO va a impactar la Tierra,
pero puedes hacer estimaciones teóricas de qué pasaría SI impactara."""
        
        # Create the full prompt
        full_prompt = f"{context}\n\nPregunta del usuario: {user_message}"
        
        # Generate response using Gemini
        response = gemini_model.generate_content(full_prompt)
        
        return {
            "response": response.text,
            "success": True
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }

if __name__ == "__main__":
    print("NeoWS API Interaction")
    today = datetime.date.today().strftime("%Y-%m-%d")
    print(f"Today is {today}")

    api_key = os.getenv("NASA_API_KEY")
    if not api_key:
        print("API key file not found.")
    else:
        input_choice = input("Enter 'b' for browse, 'f' for feed, or 'l' for lookup, or 'li' for lookup by ID ").strip().lower()
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
                with open(f"resources/hazardous_asteroid_analysis.json", "w") as file:
                    json.dump(analysis, file, indent=4)
                print(f"Analysis saved to resources/hazardous_asteroid_analysis.json")
        else:
            save_simplified_today_neo_data(neo_id, data)