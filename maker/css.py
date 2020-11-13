from .plugins.css import *

def css(src="src", dist="dist", file="main.css"):
	with open(f"{src}/{file}", "r", encoding="utf-8") as f:
		result = f.read()
		f.close()

	result = imports_concatinate(result, src)
	result = minify(result)
	result = meadias_concatinate(result)

	with open(f"{dist}/{file[:-4]}.min.css", "w", encoding="utf-8") as f:
		f.write(result)
		f.close()