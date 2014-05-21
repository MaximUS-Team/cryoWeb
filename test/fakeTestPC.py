import urllib, urllib2
url = "http://127.0.0.1:5000/test-pc"
#url = "http://jcu-cryo@herokuapp.com/test-pc"
data = {'time': '2014/05/21 14:20', 'T': '300'}
print(urllib.urlencode(data))

opener = urllib2.build_opener(urllib2.HTTPHandler)
request = urllib2.Request(url, urllib.urlencode(data))
request.get_method = lambda: 'PUT'
url = opener.open(request)

