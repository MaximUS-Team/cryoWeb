import requests, random, time
url = "http://jcu-cryo.herokuapp.com/test-pc"
P = 0.1;
I = 0.005;
D = 0.005;

currTime = time.localtime();
T = 295 + 4*(-(abs(11-(currTime.tm_hour + currTime.tm_min / 60.0 + currTime.tm_sec / 3600.0)%24)))/11
goal = 293
err = 0
while True:
	currTime = time.localtime();
	goal = 295 + 4*(-(abs(11-(currTime.tm_hour + currTime.tm_min / 60.0 + currTime.tm_sec / 3600.0)%24)))/11# normalise temp based on time
	oldErr = err
	err = goal - T
	T = T + P * err + I * (err + oldErr) + D * (err - oldErr) + 0.004 * (random.random() - 0.5)
	# Send data
	payload = {'time': time.strftime('%Y/%m/%d %H:%M:%S'), 'T': '%.3f' % T}
	r = requests.put(url, data=payload)
	print(goal)
	print(payload)
	time.sleep(1)
	# sometimes change goal
	#if random.random() < 0.1:
	#	# goal signal, stochastic, but with 'normalisation' to bring it back
	#	goal = goal + 0.1 * (random.random() - 0.5) + 0.05 * (normalisation - goal)
	# PID for actual signal to smooth it out