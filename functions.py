import os, shutil
from optimizer import optimize

marks_list = {
	"кафе": "cafe",
	"бар": "bar",
	"игра": "game",
	"больница": "hospital",
	"церковь": "church",
	"студия": "studio",
	"магазин": "shop"
}

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

def get_city(name, branch, x, z, type, id, icon="", mark=""):
	r = f'<a href="#{id}" class="dot '
	r += "dot--" + type
	if type != "hub":
		r += " dot--" + branch

	if icon != "" or mark != "":
		r += " dot--icon"

	r += f'" title="{name}" data-x="{x}" data-z="{z}" tabindex="-1">'
	if icon != "" and type == "city":
		r += f'<img class="dot__icon" src="pictures/{id}/icon.{icon}" alt="{name}">'
	elif mark != "" and mark in marks_list:
		r += f'<img class="dot__icon" src="icons/{marks_list[mark]}.svg" alt="{name}">'
	elif type == "city":
		r += name[0].upper()
	elif type != "base" and type != "hub":
		r += f'<img class="dot__icon" src="icons/{type}.svg" alt="{name}">'
	r += '</a>'
	return r

def get_road(branch, x, z, type):
	return f'<div class="road road--{branch} road--{type}" data-x="{x}" data-z="{z}"></div>'

def _get_picture(img, file, name, className="background"):

	sizes = [1200, 800, 400]
	if not is_image_optimized(img, file, sizes):

		if not os.path.exists(f"./dist/pictures/{file}/"):
			os.mkdir(f"./dist/pictures/{file}/")

		optimize(img, f"./json/{file}/", f"./dist/pictures/{file}/", sizes)

	img = str(img).split('.')[0]
	return f'<picture class="{className}"><source srcset="pictures/{file}/{img}/400.webp 400w, pictures/{file}/{img}/800.webp 800w, pictures/{file}/{img}/1200.webp 1200w" type="image/webp"><img src="pictures/{file}/{img}/400.jpg" alt="{name}" srcset="pictures/{file}/{img}/400.jpg 400w, pictures/{file}/{img}/800.jpg 800w, pictures/{file}/{img}/1200.jpg 1200w" data-src="pictures/{file}/{img}/400.jpg"> </picture>'

def get_pictures(file, name):

	content = ""

	r = '<div class="info__image" onclick="next(this)">'
	for pic in os.listdir(path=f"./json/{file}"):
		if (not pic.startswith("icon")):
			content += "`" + _get_picture(pic, file, name) + "`,\n"

	f = open("dist/pictures.js", "a", encoding="utf-8")
	f.write(f"{file}: [\n" + content[:-2] + "\n],\n")
	f.close
	r += '</div><div class="info__text">'
	return r

def get_title(name, mayor, type):
	if type == "city":
		return f'<div class="title"><h2>{name}</h2><p>Мэр: <b>{mayor}</b></p></div>'
	elif type == "hub":
		return f'<div class="title"><h2>{name}</h2><p><b>{mayor}</b></p></div>'
	elif type == "base":
		return f'<div class="title"><h2>{name} {mayor}</h2></div>'
	elif mayor != "":
		return f'<div class="title"><h2>{name}</h2><p>Владелец <b>{mayor}</b></p></div>'
	else:
		return f'<div class="title"><h2>{name}</h2></div>'

def get_description(text):
	return f'<p class="description">{text}</p>'

def get_marks(marks):
	r = '<ul class="marks">'
	for mark in marks:
		r += f'<li class="marks__item">{mark}</li>'
	r += "</ul>"
	return r

def get_residents(residents):
	r = '<div class="residents"><h3>Жители</h3><ul>'
	for res in residents:
		r += f"<li>{res}</li>"
	r += "</ul></div>"
	return r