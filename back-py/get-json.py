#!/home/c/cp36696/myenv/bin/python3.4
# -*- coding: utf-8 -*-
import json, sys
result = "success"
myjson = json.load(sys.stdin)
print myjson
print 'Content-Type: application/json\n\n'
print json.dumps(result)
