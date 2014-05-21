import requests
payload = {'time': '2014/05/21 14:21', 'T': '400'}
r = requests.put("http://127.0.0.1:5000/test-pc", data=payload)