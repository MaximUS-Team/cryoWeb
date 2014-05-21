import requests
payload = {'time': '2014/05/23 22:24', 'T': '196.5'}
r = requests.put("http://jcu-cryo.herokuapp.com/test-pc", data=payload)