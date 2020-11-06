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

def get_city(name, branch, x, z, type, id):
	r = f'<button id="{id}" class="city '
	if type == "city":
		r += branch
	else:
		r += type
		if type == "end":
			r += " " + branch
	r += f'" title="{name}" data-x="{x}" data-z="{z}" tabindex="-1"></button>'
	return r

def get_road(branch, x, z):
	return f'<div class="road {branch}" data-x="{x}" data-z="{z}"></div>'

def _get_picture(img, file, name, className="background"):

	sizes = [1200, 800, 400]
	if not is_image_optimized(img, file, sizes):

		if os.path.exists(f"./dist/pictures/{file}/"):
			shutil.rmtree(f"./dist/pictures/{file}/")
		os.mkdir(f"./dist/pictures/{file}/")

		optimize(img, f"./json/{file}/", f"./dist/pictures/{file}/", sizes)

	img = str(img).split('.')[0]
	return f'<picture class="{className}"><source srcset="pictures/{file}/{img}/400.webp 400w, pictures/{file}/{img}/800.webp 800w, pictures/{file}/{img}/1200.webp 1200w" type="image/webp"> <img src="pictures/{file}/{img}/400.jpg" alt="{name}" srcset="pictures/{file}/{img}/400.jpg 400w, pictures/{file}/{img}/800.jpg 800w, pictures/{file}/{img}/1200.jpg 1200w"> </picture>'

def get_pictures(file, name):
	r = '<div class="image">'
	for pic in os.listdir(path=f"./json/{file}"):
		r += _get_picture(pic, file, name)
	r += '</div><div class="text">'
	return r

def get_title(name, mayor, type):
	if type == "city":
		return f'<div class="title"><h2>{name}</h2><p>Мэр: <b>{mayor}</b></p></div>'
	if type == "hub":
		return f'<div class="title"><h2>{name}</h2><p><b>{mayor}</b></p></div>'
	if type == "end":
		if mayor == "":
			return f'<div class="title"><h2>{name}</h2></div>'
		else:
			return f'<div class="title"><h2>{name}</h2><p>Принадлежит <b>{mayor}</b></p></div>'

def get_description(text):
	return f'<p class="description">{text}</p>'

def get_residents(residents):
	r = '<div class="residents"><h3>Жители</h3><ul>'
	for res in residents:
		r += f"<li>{res}</li>"
	r += "</ul></div>"
	return r