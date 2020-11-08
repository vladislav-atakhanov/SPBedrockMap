import os, shutil
from optimizer import optimize

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

def get_city(name, branch, x, z, type, id, icon=""):
	r = f'<button id="{id}" class="dot '
	if type == "city":
		r += "dot--" + branch
	else:
		r += "dot--" + type
		if type != "hub":
			r += " dot--" + branch

	if icon != "" or type == "bar" or type == "game" or type == "cafe":
		r += " dot--icon"
	r += f'" title="{name}" data-x="{x}" data-z="{z}" tabindex="-1">'
	if icon != "":
		r += f'<img class="dot__icon" src="pictures/{id}/icon.{icon}">'
	else:
		if type == "city":
			r += name[0].upper()
		elif type == "bar":
			r += f'<img class="dot__icon" src="pictures/bar.svg">'
		elif type == "game":
			r += f'<img class="dot__icon" src="pictures/game.svg">'
		elif type == "cafe":
			r += f'<img class="dot__icon" src="pictures/cafe.svg">'
	r += '</button>'
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
	return f'<picture class="{className}"><source srcset="pictures/{file}/{img}/400.webp 400w, pictures/{file}/{img}/800.webp 800w, pictures/{file}/{img}/1200.webp 1200w" type="image/webp"> <img src="pictures/{file}/{img}/400.jpg" alt="{name}" srcset="pictures/{file}/{img}/400.jpg 400w, pictures/{file}/{img}/800.jpg 800w, pictures/{file}/{img}/1200.jpg 1200w"> </picture>'

def get_pictures(file, name):
	r = '<div class="info__image" onclick="next(this)">'
	for pic in os.listdir(path=f"./json/{file}"):
		if (not pic.startswith("icon")):
			r += _get_picture(pic, file, name)
	r += '</div><div class="info__text">'
	return r

def get_title(name, mayor, type):
	if type == "city":
		return f'<div class="title"><h2>{name}</h2><p>Мэр: <b>{mayor}</b></p></div>'
	if type == "hub":
		return f'<div class="title"><h2>{name}</h2><p><b>{mayor}</b></p></div>'
	else:
		return f'<div class="title"><h2>{name}</h2><p>Владелец <b>{mayor}</b></p></div>'

def get_description(text):
	return f'<p class="description">{text}</p>'

def get_residents(residents):
	r = '<div class="residents"><h3>Жители</h3><ul>'
	for res in residents:
		r += f"<li>{res}</li>"
	r += "</ul></div>"
	return r