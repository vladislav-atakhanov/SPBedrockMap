import json
import os

cities_info = ""
cities_block = ""

files = os.listdir(path="./json/")
for file in files:
	data = ""
	with open("./json/" + file, "r", encoding='utf-8') as f:
		data = json.load(f)
		f.close()

	cities_block += f'<div class="city {data["branch"]}" title="{data["name"]}" data-x="{data["nether"]["x"]}" data-z="{data["nether"]["z"]}"></div>' + f'<div class="road {data["branch"]}" data-x="{data["nether"]["x"]}" data-z="{data["nether"]["z"]}"></div>'

	cities_info +=  f"""<div class="city_info">
<div class="title">
<h2>{data["name"]}</h2>
<p>Мэр: {data["mayor"]}</p>
</div>
<div class="coords">
<h3>Координаты</h3>
<p>Ад - <span class="{data["branch"]}">{data["nether"]["x"]} {data["nether"]["z"]}</span></p>"""
	if "overworld" in data:
		cities_info += f'<p>Обычный мир - {data["overworld"]["x"]} {data["overworld"]["y"]} {data["overworld"]["z"]}</p>'

	cities_info += "</div>"

	if "description" in data:
		cities_info += f'<p>{data["description"]}</p>'

	cities_info += "</div>"

with open("src.html", "r", encoding='utf-8') as f:
	src = f.read()
	f.close()
with open("index.html", "w", encoding='utf-8') as f:
	f.write(src.replace("<cities_info>", cities_info).replace("<cities_block>", cities_block))
	f.close()