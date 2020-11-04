import os, shutil
from optimizer import optimize

def is_image_optimized(img, file, sizes):
	if file not in os.listdir(path=f"./dist/pictures/"):
		return False

	if img not in os.listdir(path=f"./dist/pictures/{file}/"):
		return False

	for size in sizes:
		if (size + ".jpg") not in os.listdir(path=f"./dist/pictures/{file}/{img}"):
			return False
		if (size + ".webp") not in os.listdir(path=f"./dist/pictures/{file}/{img}"):
			return False

	return True

def get_city(name, branch, x, z):
	return f'<div class="city {"hub" if name.lower() == "хаб" else branch}" title="{name}" data-x="{x}" data-z="{z}"></div>'

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

def get_pictures(pictures, file, name):
	r = '<div class="image">'
	for pic in pictures:
		r += _get_picture(pic, file, name)
	r += '</div>'
	return r

def get_title(name, mayor):
	return f'<div class="title"><h2>{name}</h2><p>{"Мэр: " if name.lower() != "хаб" else ""}<b>{mayor}</b></p></div>'

def get_description(text):
	return f'<p class="description">{text}</p>'

