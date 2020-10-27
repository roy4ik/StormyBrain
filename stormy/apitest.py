# This is simply meant to document and analyse useful queries..

import requests
import json


rel_code = 'rel_trg='
word = "phone"
api_url = f'https://api.datamuse.com/words?{rel_code}{word}&max=7'
api_response = requests.get(f"{api_url}").json()

print(api_response)