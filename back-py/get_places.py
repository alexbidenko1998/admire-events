#!/home/c/cp36696/myenv/bin/python3.4
# -*- coding: utf-8  -*-
import random
from PIL import Image 
import cgi
import cgitb
import os
import requests
import sys
import codecs
import time
import json
import requests
import MySQLdb
cgitb.enable()
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
data = sys.stdin.read()
print ('Content-Type: application/json\n\n')
storage = cgi.FieldStorage()


conn = MySQLdb.connect('127.0.0.1', 'cp36696_admireso', 'social.admire', 'cp36696_admireso')
cursor = conn.cursor()
 
lang_file = open('langs.txt').read()
langlist = eval(lang_file)

def convert(lang, word):

    let_1 = Image.open( 'C:\\Users\\akimg\Desktop\\' + lang + '\\' + word[0] + '.png')
    word_end = word
    word = word[1:]
    for i in range(len(word)):
        let_img_2 = Image.open('C:\\Users\\akimg\Desktop\\' + lang + '\\'  + word[i] + '.png')
        (width1, height1) = let_1.size
        (width2, height2) = let_img_2.size

        result_width = width1 + width2
        result_height = max(height1, height2)

        result = Image.new('RGB', (result_width, result_height))
        result.paste(im=let_1, box=(0, 0))
        result.paste(im=let_img_2, box=(width1, 0))
        let_1 = result
    let_1.save("C:\\Users\\akimg\\Desktop\\all_images\\"  + 'translated_' + word_end +  '.png' )
	return 'translated_' + word_end +  '.png'
#print(data)

data = eval(data)

latitude = data['latitude']
longitude = data['longitude']
radius = data['radius']


comandsCount = int(data['comandsCount'])

comandlist = []
for number in random.sample(range(10000), comandsCount):
	comandlist.append('admire_' + str(number))
    
#print(str(comandlist))



places = requests.get("https://admire.social/api/v1.0/get-places.php?latitude=" + str(latitude) + "&longitude=" + str(longitude) + "&radius=" + str(radius) )

places = eval(places.text)

points = int(data['pointsCount'])

for comand in comandlist:
	 
	for i in range(points):

		#вот тут отправляешь название команды
		place = places.pop()
		latitude = place['latitude']
		longitude = place['longitude']
		cursor.execute("insert into admire_quests_players (player, pointLatitude, pointLongitude) values ('" + comand + "','" + latitude + "','" + longitude + "')")
		conn.commit()
    	word = place['title']
		trans_word = convert(random.choise(langlist), word)

cursor.execute("SELECT player FROM admire_quests_players")
 
# Получаем данные.
row = cursor.fetchone()
print(row)
 
# Разрываем подключение.
conn.close()


#print(word)
