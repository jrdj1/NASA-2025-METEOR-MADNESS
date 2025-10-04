import requests

def load_api_key(file_path):
    try:
        with open(file_path, 'r') as file:
            return file.read().strip()
    except FileNotFoundError:
        return None
    
def api_request(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to retrieve data"}
    