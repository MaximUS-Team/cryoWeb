import requests, random, time

T = 295;
while True:
	T = T + 0.2 * (random.random() - 0.5)
	payload = {'time': time.strftime('%Y/%m/%d %H:%M:%S'), 'T': '%.3f' % T}
	r = requests.put("http://jcu-cryo.herokuapp.com/test-pc", data=payload)
	print(payload)
	time.sleep(5)