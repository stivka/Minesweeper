#!/usr/bin/python
# -*- coding: iso-8859-1 -*-
import cgi, cgitb, os, json, sys

cgitb.enable() # see peaks siis kusagil üpris algul olema

print "Content-type: text/html" # mõistlik panna kohe programmi algusse
print

fieldStorage = cgi.fieldStorage()
scorefile = "/prax3/score.txt"
inmethod = os.environ["REQUEST_METHOD"]
if inmethod == "POST":
	indata = sys.stdin.read()
	data = json.loads(indata)
	print data