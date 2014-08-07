#23456789012345678901234567890123456789012345678901234567890123456789012
import requests, random, time, os
from datatools import parse_DAT_file
url = "http://jcu-cryo.herokuapp.com/test-pc"
P = 0.1;
I = 0.005;
D = 0.005;

dataFiles = []
for path, subdirs, files in os.walk(r'./data'):
	for filename in files:
		dataFiles.append(os.path.join(path, filename))

currTime = time.localtime();
T = 295 + 4 * (-(abs(11 - (currTime.tm_hour + currTime.tm_min / 60.0 +
	currTime.tm_sec / 3600.0) % 24))) / 11
goal = 293
err = 0
while True:
	# update time
	currTime = time.localtime();

	# update temp (T)
	# normalise temp based on time (convincing on time of day vs temp)
	goal = 295 + 4 * (-(abs(11 - (currTime.tm_hour + currTime.tm_min /
		60.0 + currTime.tm_sec / 3600.0) % 24))) / 11
	oldErr = err
	err = goal - T
	T = (T + P * err + I * (err + oldErr) + D * (err - oldErr) + 0.004 *
		(random.random() - 0.5)) # PID

	# Send data
	payload = parse_DAT_file(random.choice(dataFiles))
	payload['time'] = time.strftime('%Y/%m/%d %H:%M:%S')
	payload['T'] = '%.3f' % T
	r = requests.put(url, data=payload)
	print(goal)
	print(payload)
	time.sleep(1)