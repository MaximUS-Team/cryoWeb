#23456789012345678901234567890123456789012345678901234567890123456789012
import requests, json, random, time, os
from datatools import parse_DAT_file
#url = "http://jcu-cryo.herokuapp.com/upload"
url = "http://127.0.0.1:5000/upload"
P = 0.1;
I = 0.005;
D = 0.005;

snpPeriod = 5; # s
tempPeriod = 1; # s
throttle = 0;

dataFiles = [];
for path, subdirs, files in os.walk(r'./data'):
	for filename in files:
		dataFiles.append(os.path.join(path, filename));

currTime = time.localtime();
T = 295 + 4 * (-(abs(11 - (currTime.tm_hour + currTime.tm_min / 60.0 +
	currTime.tm_sec / 3600.0) % 24))) / 11;
goal = 293;
err = 0;
while True:
	# update time
	currTime = time.localtime();

	# update temp (T)
	# normalise temp based on time (convincing on time of day vs temp)
	goal = 295 + 4 * (-(abs(11 - (currTime.tm_hour + currTime.tm_min /
		60.0 + currTime.tm_sec / 3600.0) % 24))) / 11;
	oldErr = err;
	err = goal - T;
	T = (T + P * err + I * (err + oldErr) + D * (err - oldErr) + 0.004 *
		(random.random() - 0.5)); # PID

	# produce data
	filename = random.choice(dataFiles);
	if (throttle == 0):
		payload = parse_DAT_file(filename);
	else:
		payload = {};
	throttle = (throttle + 1) % (snpPeriod / tempPeriod);
	payload['time'] = time.strftime('%Y/%m/%d %H:%M:%S');
	payload['T'] = '%.3f' % T;

	# send data
	headers = {'content-type': 'application/json'};
	r = requests.post(url, data=json.dumps(payload), headers=headers);
	print(r);
	print('bytes: %(bytes)sb, entries: %(entries)s' %
		{'bytes': len(json.dumps(payload)),
		'entries': (len(payload['Snp']) if 'Snp' in payload else 0)});
	print('%(time)s T:%(T)s' % {'time':payload['time'],
		'T':payload['T']});
	print('Data from %s' % filename);
	#print(goal);
	#print(payload);
	time.sleep(tempPeriod);