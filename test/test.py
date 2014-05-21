import requests
payload = {'time': '2014/05/23 22:53', 'T': '196.25'}
r = requests.put("http://jcu-cryo.herokuapp.com/test-pc", data=payload)