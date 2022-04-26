#!/home/c/cp36696/myenv/bin/python3.4
# -*- coding: utf-8 -*-
import cgi
import cgitb
import os
import requests
import sys
import codecs
import time
import json
import requests
cgitb.enable()
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

def getjson(url, data = None):
    response = requests.get(url, params = data)
    response = response.text
    return response
access_token = '17881c18ed5a00b11edbfb6e7a06ba6f290c1f9ad409fd13eb6af9c7e9cc2048d01fc61ae924952a9ebd0'
ids = ""
n = 0
event_fin = ""
print ('Content-Type: application/json\n\n')
#print ('Content-Type: text/html')
print()
#print ("<html><head><title>EVENT</title></head>")
#print ("<body>")
form = cgi.FieldStorage()
if "city" not in form:
    print("<H1>Error</H1>")
else:
	ff = form["city"].value

cities = getjson("https://api.vk.com/method/database.getCities", {
        'country_id' : 1,
        'q' : ff,
        'need_all' : 1,
        'access_token' : access_token,
        'count' : 10,
        'v' : '5.61'
        })
        
#print(ascii(cities))
s = cities.find('id') + 4
ss = cities[s:len(cities)].find('title') + s - 2

owner_id = cities[s:ss]

events = getjson("https://api.vk.com/method/groups.search", {
	    'q' : " ",
		'type' : 'event',
        'city_id' : owner_id,
        'future' : 1,
        'access_token' : access_token,
        'count' : 10,
        'v' : '5.61'
        })
        
s = events.find('id')
while s > -1:
	ids = ids + ","
	s = s + 4
	ss = events[s:len(events)].find('name') + s - 2
	ids = ids + events[s:ss]
	events = events[ss:len(events)]
	s = events.find('id')

event = getjson("https://api.vk.com/method/groups.getById", {
     		'group_ids' : ids[1:len(ids)],
       		'fields' : "city,country,place,description,start_date,finish_date,site,members_count",
       		'access_token' : access_token,
   			'v' : '5.61'
       		})

eventdict = eval(event)
eventlist = eventdict['response']

word_filtres = requests.get("https://admire.social/back/get-filter-words.php")
word_filtres = word_filtres.text

stoplist = []

word_filtres_list = eval(word_filtres)
for i in range(len(eventlist)):
    for j in range(len(word_filtres_list)):
        if eventlist[i]['name'].lower().find(word_filtres_list[j]) != -1 or  eventlist[i]['description'].lower().find(word_filtres_list[j]) != -1:
            stoplist.append(eventlist[i])


for i in range(len(stoplist)):
	if eventlist.count(stoplist[i]) != 0:
		eventlist.remove(stoplist[i])


eventjson = json.dumps(eventlist)

#print("<html><head><title>EVENT</title></head><body>" + eventjson + "</body></html>")
print(eventjson)


#print ("</body>")
#print ("</html>")