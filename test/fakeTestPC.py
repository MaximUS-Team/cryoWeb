import requests, random, time
url = "http://jcu-cryo.herokuapp.com/test-pc"
P = 0.01;
I = 0.005;
D = 0.005;

T = 293
goal = 293
normalisation = 293;
err = 0
while True:
	# goal signal, stochastic, but with 'normalisation' to bring it back
	goal = goal + 0.1 * (random.random() - 0.5) + 0.05 * (normalisation - goal)

	# PID for actual signal to smooth it out
	oldErr = err
	err = goal - T
	T = T + P * err + I * (err + oldErr) + D * (err - oldErr) + 0.002 * (random.random() - 0.5)

	# Send data
	payload = {'time': time.strftime('%Y/%m/%d %H:%M:%S'), 'T': '%.3f' % T}
	r = requests.put(url, data=payload)
	print(goal)
	print(payload)
	time.sleep(5)