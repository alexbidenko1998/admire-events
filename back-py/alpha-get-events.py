#!/home/c/cp36696/myenv/bin/python3.4
# -*- coding: utf-8 -*-
import cgi
import cgitb
import os
import requests
import sys
import codecs
import time

cgitb.enable()
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

def getjson(url, data = None):
    response = requests.get(url, params = data)
    response = response.text
    return response
access_token = '9026fa36a4a52ad4d8d1101119c490c0cff189e3554111ebdde4455a79932951bd5613859b4504f9430bd'
access_token_group = 'b729cb0cb729cb0cb729cb0c58b7430695bb729b729cb0cebc224a2bec232fef2071045'
ids = []
n = 0
print ("Content-type: text/html")
print()
print ("<html><head><title>EVENT</title></head>")
print ("<body>")
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
        'v' : '5.95'
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
        'v' : '5.95'
        })
s = events.find('id')
while s > -1:
	s = s + 4
	ss = events[s:len(events)].find('name') + s - 2
	ids.append(events[s:ss])
	events = events[ss:len(events)]
	s = events.find('id')

count = 0
if len(ids) > 0:
	for i in range(len(events)):
		event = getjson("https://api.vk.com/method/groups.getById", {
        		'group_id' : ids[i],
        		'fields' : "city,country,place,description",
        		'access_token' : access_token_group,
    			'v' : '5.95'
        		})
		if (event.find('секс') > -1) or (event.find('раскрутка') > -1) or (event.find('опционы') > -1) or (event.find('йога') > -1) or (event.find('знакомства') > -1) or (event.find('Чехлы') > -1) or (event.find('попы') > -1)  or (event.find('Женские практики') > -1) or (event.find('пошлые') > -1) or (event.find('сиськи') > -1) or (event.find('свинг')  > -1) or (event.find('свингеры') > -1):
			x = 1
		else:
			s = event.find("[")
			ss = event.find("]")
			ans = ""
			if count != 0:
				ans = ans + ","
			count += 1
			#print(n)
			ans = ans + event[s +1:ss]
			print(ans)
			#n +=1
else:
	print("Мероприятий нет")
print ("</body>")
print ("</html>")