import requests
import json
from requests.models import HTTPError

def get_word(word, rel_code='trg', max=7):
    rel_code = f'rel_{rel_code}'
    api_url = f'https://api.datamuse.com/words?{rel_code}"="{word}&max={max}'
    try:
        api_response = requests.get(f"{api_url}").json()
        print(f'Results for {word}: {api_response}')
    except HTTPError:
        raise HTTPError

    return api_response

get_word("Olympics")