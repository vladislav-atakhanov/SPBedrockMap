from PIL import Image
import os, shutil, json, re

marks_list = {
	"cafe": "кафе",
	"bar": "бар",
	"game": "игра",
	"hospital": "больница",
	"church": "церковь",
	"studio": "студия",
	"shop": "магазин",
	"restaurant": "ресторан"
}

def minify(html):
	list = ["\n", "\t"] +  re.findall(r'<!--.*?-->', html)
	for item in list:
		html = html.replace(item, "")

	list = ["<", ">"]
	for item in list:
		html = html.replace(f" {item}", item)
		html = html.replace(f"{item} ", item)
		html = html.replace(f" {item} ", item)

	return html

def resize_and_save(img, width, ratio, path):
	img_resized = img.resize((width, round(width / ratio)))
	img_resized.convert("RGB").save(path + str(width) + ".jpg", "jpeg")
	img_resized.convert("RGB").save(path + str(width) + ".webp", "webp")

def optimize(file_name, from_, to_, sizes):
	img = Image.open(str(from_ + file_name))
	width = img.width
	height = img.height
	ratio = width / height
	path = to_ + str(file_name).split('.')[0] + "/"
	if os.path.exists(path):
		shutil.rmtree(path)
	os.mkdir(path)
	for size in sizes:
		resize_and_save(img, size, ratio, path)
		print(f"    + {str(file_name).split('.')[0]}/{size}")

def is_image_optimized(img, file, sizes):
	img = img.split('.')[0]
	if file not in os.listdir(path="./dist/pictures/"):
		return False

	if img not in os.listdir(path=f"./dist/pictures/{file}/"):
		return False

	for size in sizes:
		if (str(size) + ".jpg") not in os.listdir(path=f"./dist/pictures/{file}/{img}"):
			return False
		if (str(size) + ".webp") not in os.listdir(path=f"./dist/pictures/{file}/{img}"):
			return False

	return True

def get_city(name, branch, x, z, type, id, mayor, icon="", mark=""):
	r = f'<a href="#{id}" class="dot '
	r += "dot--" + type
	if type != "hub":
		r += " dot--" + branch

	if icon != "" or mark != "" or type == "end":
		r += " dot--icon"
	r += f'" title="{name}{mayor if type == "base" else ""}" aria-label="{name}{mayor if type == "base" else ""}" style="top: calc({z/20}rem + 50%); left: calc({x/20}rem + 50%)"  tabindex="-1">'
	if icon != "" and type == "city":
		r += f'<img class="dot__icon" src="pictures/{id}/icon.{icon}" alt="{name}">'
	elif mark != "" and mark in marks_list:
		r += f'<img class="dot__icon" src="icons/{mark}.svg" alt="{name}">'
	elif type == "city":
		r += name[0].upper()
	elif type != "base" and type != "hub":
		r += f'<img class="dot__icon" src="icons/{type}.svg" alt="{name}">'
	r += '</a>'
	return r

def abs(n):
	return n if n > 0 else -n

def get_road(branch, x, z, type):
	r = f'<div class="road road--{branch} road--{type}" style="'
	if branch == "red" or branch == "yellow":
		r += f'height: {abs(x) / 20}rem;'
		r += f'top: calc({z / 20}rem + 50%);'
		if (x < 0):
			r += f'left: calc({x / 20}rem + 50%)'

	else:
		r += f'width: {abs(z) / 20}rem;'
		r += f'left: calc({x / 20}rem + 50%);'
		if (z < 0):
			r += f'top: calc({z / 20}rem + 50%)'

	r += '"></div>'
	return r

def _get_picture(img, file, name, className="background"):

	sizes = [1200, 800, 400]
	if not is_image_optimized(img, file, sizes):

		if not os.path.exists(f"./dist/pictures/{file}/"):
			os.mkdir(f"./dist/pictures/{file}/")

		optimize(img, f"./json/{file}/", f"./dist/pictures/{file}/", sizes)

	img = str(img).split('.')[0]
	return f'<picture class="{className} info__picture" style="opacity: 0"><source sizes="(min-width: 1024px) 25vw, (min-width: 992px) 30vw, (min-width: 768px) 40vw, 100vw" srcset="pictures/{file}/{img}/400.webp 400w, pictures/{file}/{img}/800.webp 800w, pictures/{file}/{img}/1200.webp 1200w" type="image/webp"><img sizes="(min-width: 1024px) 25vw, (min-width: 992px) 30vw, (min-width: 768px) 40vw, 100vw" src="pictures/{file}/{img}/400.jpg" alt="{name}" class="{className}__img" srcset="pictures/{file}/{img}/400.jpg 400w, pictures/{file}/{img}/800.jpg 800w, pictures/{file}/{img}/1200.jpg 1200w" data-src="pictures/{file}/{img}/400.jpg"></picture>'

def get_pictures(file, name):

	content = ""

	r = '<div class="info__image" onclick="next(this)">'
	for pic in os.listdir(path=f"./json/{file}"):
		if (not pic.startswith("icon")):
			content += "`" + _get_picture(pic, file, name) + "`,\n"

	f = open("dist/pictures.js", "a", encoding="utf-8")
	f.write(f"{file}: [" + content[:-2] + "],")
	f.close
	r += '</div><div class="info__text"></div>'
	return r

def get_title(name, mayor, type):
	if type == "city":
		return f'<div class="dot__title"><h2 class="dot__title_heading">{name}</h2><p class="dot__title_paragraph">Мэр: <b>{mayor}</b></p></div>'
	elif type == "hub":
		return f'<div class="dot__title"><h2 class="dot__title_heading">{name}</h2><p class="dot__title_paragraph"><b>{mayor}</b></p></div>'
	elif type == "base":
		return f'<div class="dot__title"><h2 class="dot__title_heading">{name} {mayor}</h2></div>'
	elif mayor != "":
		return f'<div class="dot__title"><h2 class="dot__title_heading">{name}</h2><p class="dot__title_paragraph">Владелец <b>{mayor}</b></p></div>'
	else:
		return f'<div class="dot__title"><h2 class="dot__title_heading">{name}</h2></div>'

def get_description(text):
	return f'<p class="dot__description">{text}</p>'

def get_marks(marks):
	r = '<ul class="marks dot__marks">'
	for mark in marks:
		r += f'<li class="marks__item">{marks_list[mark]}</li>'
	r += "</ul>"
	return r

def get_residents(residents):
	r = '<div class="residents dot__residents"><h3>Жители</h3><ul class="residents__list">'
	for res in residents:
		r += f'<li class="residents__item">{res}</li>'
	r += "</ul></div>"
	return r

def build(html, dist, p):
	dots_block = ""
	dots_info = ""

	files = os.listdir(path=p)

	f = open(f"{dist}/pictures.js", "w")
	f.write("images = {")
	f.close()

	for file in files:
		if not file.endswith(".json"): continue
		print(file)

		data = ""
		with open(p + file, "r", encoding='utf-8') as f:
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
			data["name"] = "Портал в энд"
		elif type == "base":
			data["name"] = "База"

		id = file.replace(".json", "")

		# Dot
		if "icon" in data:
			if f'icon.{data["icon"]}' not in os.listdir(path=f"./{dist}/pictures/{id}/"):
				print(f'    +icon.{data["icon"]}')
				shutil.copyfile(f'./json/{id}/icon.{data["icon"]}', f'./{dist}/pictures/{id}/icon.{data["icon"]}')
			dots_block += get_city(data["name"], data["branch"], data["nether"]["x"], data["nether"]["z"], type, id, (" " + data["mayor"] if "mayor" in data else ""), data["icon"])
		elif "marks" in data:
			dots_block += get_city(data["name"], data["branch"], data["nether"]["x"], data["nether"]["z"], type, id, (" " + data["mayor"] if "mayor" in data else ""), "", data["marks"][0])
		else:
			dots_block += get_city(data["name"], data["branch"], data["nether"]["x"], data["nether"]["z"], type, id, (" " + data["mayor"] if "mayor" in data else ""))
		
		# Road to dot
		if type != "hub":
			dots_block += get_road(data["branch"], data["nether"]["x"], data["nether"]["z"], type)
		if "subbranch" in data:
			dots_block += get_road(data["subbranch"], data["nether"]["x"], data["nether"]["z"], type)

		dots_block += "\n"

		# Information about dot
		info =  ""
		dots_info += f'<div class="dot__info" id="{id}">'
		info += f'<button type="button" class="btn btn--favoriteStatus" onclick="changeFavoriteStatus(this, \'{id}\')" data-id="{id}" area-label="Добавить в избранное"><svg viewBox="0 0 100 100"><use xlink:href="#star" /></svg></button>'

		# Pictures
		if "pictures" in data:
			dots_info += get_pictures(id, data["name"])
		dots_info += "</div>"

		# Title
		info += get_title(data["name"], data["mayor"], type=type)

		# Marks
		if "marks" in data:
			info += get_marks(data["marks"][:3])

		# Coords
		info += f'<div class="coords dot__coords"><h3 class="coords__header">Координаты</h3>'
		info += f'<p class="coords__paragraph">Ад - <span class="{data["branch"]}">{data["nether"]["x"]} {data["nether"]["z"]}</span></p>'
		if "overworld" in data:
			info += f'<p class="coords__paragraph">Обычный мир - <span class="gray">{data["overworld"]["x"]} {data["overworld"]["y"]} {data["overworld"]["z"]}</span></p>'
		info += "</div>"

		# Description
		if "description" in data:
			info += get_description(data["description"])

		# Residents
		if "residents" in data:
			info += get_residents(data["residents"])

		with open(f"./{dist}/info/{id}.js", "w", encoding='utf-8') as f:
			f.write(f"""(document.querySelector("#{id} .info__text") || document.getElementById("{id}")).innerHTML = `{info}`""")
			f.close()

	f = open(f"{dist}/pictures.js", "a")
	f.write("}")
	f.close()

	return html.replace("<dots_block>", dots_block).replace("<dots_info>", dots_info)