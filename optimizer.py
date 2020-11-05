from PIL import Image
import os, shutil

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
		print(f"    + {size}.img")