import re

def imports_concatinate(css, src, DEBUG=False):
	if DEBUG:
		print(f"Imports concatinating")
	imports = re.findall(r'@import url\(".+"\);', css)
	for i in imports:
		file_name = re.search(r'".+"', i).group(0)[1:-1]
		with open(f"{src}/{file_name}", "r", encoding="utf-8") as f:
			file_text = f.read()
			f.close()
		css = css.replace(i, file_text)

		if DEBUG:
			print(f"    {file_name}")
	return css

def minify(css):
	list = ["\n", "\t"]
	for item in list:
		css = css.replace(item, "")
	for item in re.findall(r'\/\*.+?\*\/', css):
		css = css.replace(item, "")

	list = ["+", "*", "-", "/"]
	for item in list:
		css = css.replace(f"){item}", f") {item}")
		css = css.replace(f"{item}(", f"{item} (")
	for i in range(3):
		css = css.replace("  ", " ")

	list = [":", "{", "}", ";"]
	for item in list:
		css = css.replace(f" {item}", item).replace(f"{item} ", item).replace(f" {item} ", item)

	return css

def meadias_concatinate(css):
	medias = re.findall(r'@media\(.+?\){.+?}}', css)
	a = {}
	for m in medias:
		expression = re.findall(r'@media\((.+?)\)', m)[0]
		value = re.findall(r'{(.+?)}}', m)[0] + "}"
		if expression in a:
			a[expression] += re.findall(r'@media\(.+?\){(.+?)}}', m)[0] + "}"
		else:
			a[expression] = re.findall(r'@media\(.+?\){(.+?)}}', m)[0] + "}"

		css = css.replace(m, "")

	for e in a:
		css += f"@media({e}){{{a[e]}}}"
	css = css.replace(";}", "}")

	return css