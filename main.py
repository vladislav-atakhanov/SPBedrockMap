import json
import os
from functions import *

dots_info = ""
dots_block = ""

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


	# Dot & roads to dot
	dots_block += get_city(data["name"], data["branch"], data["nether"]["x"], data["nether"]["z"], type, file.replace(".json", ""))
	if type != "hub":
		dots_block += get_road(data["branch"], data["nether"]["x"], data["nether"]["z"], type)
	if "subbranch" in data:
		dots_block += get_road(data["subbranch"], data["nether"]["x"], data["nether"]["z"], type)

	# Information about dot
	dots_info +=  f'<div class="dot__info"' + (' style="opacity:1; z-index: 1" id="hubInfo"' if type == "hub" else "") + '>'


	# Pictures
	if "pictures" in data:
		dots_info += get_pictures(file.replace(".json", ""), data["name"])

	# Title
	dots_info += get_title(data["name"], data["mayor"], type=type)

	# Coords
	dots_info += f'<div class="coords"><h3>Координаты</h3>'
	dots_info += '<p>'
	dots_info += f'Ад - <span class="{data["branch"]}">{data["nether"]["x"]} {data["nether"]["z"]}</span></p>'
	if "overworld" in data:
		dots_info += f'<p>Обычный мир - <span class="gray">{data["overworld"]["x"]} {data["overworld"]["y"]} {data["overworld"]["z"]}</span></p>'
	dots_info += "</div>"

	# Description
	if "description" in data:
		dots_info += get_description(data["description"])

	# Residents
	if "residents" in data:
		dots_info += get_residents(data["residents"])

	if "pictures" in data:
		dots_info += "</div>"

	dots_info += '</div>\n'

with open("src.html", "r", encoding='utf-8') as f:
	src = f.read()
	f.close()
with open("./dist/index.html", "w", encoding='utf-8') as f:
	f.write(src.replace("<dots_info>", dots_info).replace("<dots_block>", dots_block))
	f.close()