#23456789012345678901234567890123456789012345678901234567890123456789012
import csv,time

def parse_DAT_file(filename):
	"""Tool for dealing with .dat files produced by Ashley Gillman's
	LabVIEW program. Note: these will not be consistent with the .dat
	files produced by Kenny Leong's LabVIEW programs.
	"""
	with open(filename, 'r') as f:
		dateStr = f.readline()
		date = time.strptime(dateStr,'%d/%m/%Y  %I:%M:%S %p\r\n')
		tempStr = f.readline()
		reader = csv.reader(f, delimiter='\t')
		headers = next(reader, None)
		reader = csv.DictReader(f, headers, delimiter='\t')
		data = {'time': time.strftime(
			'%Y/%m/%d %H:%M:%S',date),
			'T': tempStr, 'Snp': []}
		a = 0
		for line in reader:
			if a==0:
				data['Snp'].append(line)
			a = (a + 1) % 4
	return data

if __name__ == '__main__':
	data = parse_DAT_file('data/22K.DAT')
	print data