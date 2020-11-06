import json
import os
from functions import *

cities_info = ""
cities_block = ""

files = os.listdir(path="./json/")
for file in files:
	if not file.endswith(".json"): continue

	
	print(file)

	data = ""
	with open("./json/" + file, "r", encoding='utf-8') as f:
		data = json.load(f)
		f.close()

	type = "city"
	if "type" in data:
		type = data["type"]
	if file == "hub.json":
		type = "hub"

	if type == "end":
		if "mayor" not in data:
			data["mayor"] = ""
		if "name" not in data:
			data["name"] = "Портал в энд"


	# City & road to city
	cities_block += get_city(data["name"], data["branch"], data["nether"]["x"], data["nether"]["z"], type, file.replace(".json", ""))
	
	if type != "hub":
		cities_block += get_road(data["branch"], data["nether"]["x"], data["nether"]["z"])

	# Information about city
	cities_info +=  f'<div class="city_info"' + (' style="opacity:1; z-index: 1" id="hubInfo"' if type == "hub" else "") + '>'


	# Pictures
	if "pictures" in data:
		cities_info += get_pictures(file.replace(".json", ""), data["name"])

	# Title
	cities_info += get_title(data["name"], data["mayor"], type=type)

	# Coords
	cities_info += f'<div class="coords"><h3>Координаты</h3>'
	cities_info += '<p>'
	cities_info += f'Ад - <span class="{data["branch"]}">{data["nether"]["x"]} {data["nether"]["z"]}</span></p>'
	if "overworld" in data:
		cities_info += f'<p>Обычный мир - <span class="gray">{data["overworld"]["x"]} {data["overworld"]["y"]} {data["overworld"]["z"]}</span></p>'
	cities_info += "</div>"

	# Description
	if "description" in data:
		cities_info += get_description(data["description"])

	# Residents
	if "residents" in data:
		cities_info += get_residents(data["residents"])

	if "pictures" in data:
		cities_info += "</div>"

	cities_info += '</div>\n'

with open("src.html", "r", encoding='utf-8') as f:
	src = f.read()
	f.close()
with open("./dist/index.html", "w", encoding='utf-8') as f:
	f.write(src.replace("<cities_info>", cities_info).replace("<cities_block>", cities_block))
	f.close()