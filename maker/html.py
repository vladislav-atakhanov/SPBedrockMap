from .plugins.html import *

def html(src="src", dist="dist", file="index.html", p="./json/", mod=""):
  with open(f"{src}/{file}", "r", encoding="utf-8") as f:
    result = f.read()
    f.close()
  
  if mod == "tf":
    result = build_tf(result, dist, p)
  else:
    result = build(result, dist, p)
  
  result = minify(result)

  with open(f"{dist}/{file}", "w", encoding="utf-8") as f:
    f.write(result)
    f.close()