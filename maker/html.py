from .plugins.html import *

def html(src="src", dist="dist", file="index.html", p="./json/", f=""):
	with open(f"{src}/{file}", "r", encoding="utf-8") as f:
		result = f.read()
		f.close()
		
	result = build(result, dist, p)
	result = minify(result)

	with open(f"{dist}/{file}", "w", encoding="utf-8") as f:
		f.write(result)
		f.close()