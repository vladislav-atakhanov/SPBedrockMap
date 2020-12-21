from maker.html import html
from maker.css import css

html()
css()

# TF
html(src="src/tf", dist="dist/tf", file="index.html", p="./tfjson/", mod="tf")
css(src="src/tf", dist="dist/tf", file="main.css")