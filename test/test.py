import requests
payload = {'time': '2014/05/22 22:22', 'T': '195.5'}
r = requests.put("http://jcu-cryo.herokuapp.com/test-pc", data=payload)