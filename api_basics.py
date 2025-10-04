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
        with open('api_headers.json', 'w') as file:
            file.write(response.headers.__str__())
        return response.json()
    else:
        return {"error": "Failed to retrieve data"}
    