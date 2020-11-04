import json
import os
from functions import *

cities_info = ""
cities_block = ""

files = os.listdir(path="./json/")
for file in files:
	if not file.endswith(".json"): continue

	data = ""
	with open("./json/" + file, "r", encoding='utf-8') as f:
		data = json.load(f)
		f.close()

	# City & road to city
	cities_block += get_city(data["name"], data["branch"], data["nether"]["x"], data["nether"]["z"])
	if file != "hub.json":
		cities_block += get_road(data["branch"], data["nether"]["x"], data["nether"]["z"])

	# Information about city
	cities_info +=  f'<div class="city_info"' + (' style="opacity:1; z-index: 1" id="hubInfo"' if file == "hub.json" else "") + '>'

	# Pictures
	if "pictures" in data:
		cities_info += get_pictures(data["pictures"], file.replace(".json", ""), data["name"])
		cities_info += '<div class="text">'

	# Title
	cities_info += get_title(data["name"], data["mayor"])

	# Coords
	cities_info += f'<div class="coords"><h3>Координаты</h3>'
	cities_info += f'<p>Ад - <span class="{data["branch"]}">{data["nether"]["x"]} {data["nether"]["z"]}</span></p>'
	if "overworld" in data:
		cities_info += f'<p>Обычный мир - <span class="gray">{data["overworld"]["x"]} {data["overworld"]["y"]} {data["overworld"]["z"]}</span></p>'
	cities_info += "</div>"

	# Description
	if "description" in data:
		cities_info += get_description(data["description"])

	if "pictures" in data:
		cities_info += "</div>"

	cities_info += "</div>\n"

with open("src.html", "r", encoding='utf-8') as f:
	src = f.read()
	f.close()
with open("./dist/index.html", "w", encoding='utf-8') as f:
	f.write(src.replace("<cities_info>", cities_info).replace("<cities_block>", cities_block))
	f.close()