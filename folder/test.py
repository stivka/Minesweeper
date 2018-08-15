#!/usr/bin/python
# -*- coding: iso-8859-1 -*-
import cgi, cgitb, os, json, sys

cgitb.enable()

print "Content-Type: text/plain;charset=utf-8"
print

scorefile = "/home/frvarb/public_html/prax3/score.json"

inmethod = os.environ["REQUEST_METHOD"]
if inmethod=="POST":
	myjson = json.load(sys.stdin)
	with open(scorefile) as f:
		data = json.load(f)
		data.append(myjson)
	with open(scorefile, 'w') as f:
		json.dump(data, f)
	f.close()
	
if inmethod=="GET":
	with open(scorefile, "rw") as data_file:
		jsonData = json.load(data_file)
		data = json.dumps(jsonData)
	print data
	