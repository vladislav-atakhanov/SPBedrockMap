const html = document.documentElement

let darkTheme = localStorage.getItem("darkTheme")
if (darkTheme == "true") {
	html.classList.add("dark")
}
function switchTheme() {
	html.classList.toggle("dark")
	html.classList.add("theme-in-transition")
	setTimeout(function() {html.classList.remove("theme-in-transition")}, 500)
	if (darkTheme == "true") {localStorage.setItem("darkTheme", "false")}
	else {localStorage.setItem("darkTheme", "true")}
}

function copy()
{
	let erron = false
	const inputs = {
		type: getInputByName("type"),
		branch: getInputByName("branch"),
		subbranch: document.getElementById("subbranch"),
		name: getInputInElementById("name"),
		mayor: getInputInElementById("mayor"),

		netherX: document.getElementById("netherX"),
		netherY: document.getElementById("netherY"),
		netherZ: document.getElementById("netherZ"),

		overworldX: document.getElementById("overworldX"),
		overworldY: document.getElementById("overworldY"),
		overworldZ: document.getElementById("overworldZ"),

		description: document.getElementById("description"),
		residents: document.getElementById("residents"),
		pictures: document.getElementById("pictures")
	}

	let error = false

	for (let prop in inputs) {
		const el = inputs[prop]
		if (
			(el != inputs.description && el != inputs.residents &&
			el != inputs.overworldX && el != inputs.overworldY && el != inputs.overworldZ && el != inputs.subbranch) &&
			!(inputs.type.value == "end" && (el == inputs.mayor || el == inputs.name))
		)
		{
			if (showError(el, (el.value == undefined || el.value == ""))) { error = true }
		}
	}

	if (!error)
	{
		let result = "{\n"

		if (inputs.type.value != "city") {result += `    "type": "${inputs.type.value}",\n`}
		if (inputs.name.value != "") {result += `    "name": "${inputs.name.value}",\n`}
		if (inputs.mayor.value != "") {result += `    "mayor": "${inputs.mayor.value}",\n`}

		result += `    "branch": "${inputs.branch.value}",\n`
		if (inputs.subbranch.checked) {
			let color = ""

			if (inputs.branch.value == "red" || inputs.branch.value == "yellow") {
				if (inputs.netherX.value > 0) {color = "blue"}
				if (inputs.netherX.value < 0) {color = "green"}
			}
			else {
				if (inputs.netherZ.value > 0) {color = "red"}
				if (inputs.netherZ.value < 0) {color = "yellow"}
			}

			result += `    "subbranch": "${color}",\n`
		}

		result += `    "nether": {\n`
		result += `        "x": "${inputs.netherX.value}",\n`
		if (inputs.netherY.value != "65") {result += `        "y": "${inputs.netherY.value}",\n`}
		result += `        "z": "${inputs.netherZ.value}"\n`
		result += `    },\n`

		if (inputs.overworldX.value != "" && inputs.overworldY.value != "" && inputs.overworldZ.value != "") {
			result += `    "overworld": {\n`
			result += `        "x": "${inputs.overworldX.value}",\n`
			result += `        "y": "${inputs.overworldY.value}",\n`
			result += `        "z": "${inputs.overworldZ.value}"\n`
			result += `    },\n`
		}

		if (inputs.description.value != "")
		{
			result += `    "description": "${inputs.description.value.replace(/\n/g, "<br>")}",\n`
		}
		if (inputs.residents.value != "")
		{
			result += '    "residents": ['
			res = inputs.residents.value.split(", ")
			for (var i = 0; i < res.length; i++) {
				result += `"${res[i]}"`
				if (i < res.length - 1) {result += ", "}
			}
			result += "],\n"
		}
		if (inputs.pictures.checked) {
			result += `    "pictures": "true",\n`
		}
		result += "}"
		result = result.replace(",\n}", "\n}")

		const copyText = document.createElement("textarea")
		copyText.className = "vissualy-hidden"
		copyText.value = result
		document.body.appendChild(copyText)
		copyText.select()
		copyText.setSelectionRange(0, 99999)
		document.execCommand("copy")
		copyText.remove()

		const btn = document.getElementById('btn')
		const text = btn.innerText
		btn.innerText = "Скопировано в буфер обмена"
		setTimeout(function() {btn.innerText = text}, 2000)
	}
}
function changeType(txt)
{
	if (txt == "city")
	{
		document.getElementById("name").style.display = "block"
		document.getElementById("mayor").getElementsByTagName("span")[0].innerText = "Мэр города"
		document.getElementById("title").classList.remove("optional")
	}
	else if (txt == "end")
	{
		document.getElementById("name").style.display = "none"
		document.getElementById("mayor").getElementsByTagName("span")[0].innerText = "Владелец портала"
		document.getElementById("title").classList.add("optional")
	}
}

function getInputInElementById(id) {
	return document.getElementById(id).getElementsByTagName("input")[0]
}
function getInputByName(name) {
	const radios = document.getElementsByName(name);
	for (let i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			return radios[i]
		}
	}
	return document.getElementById(name)
}
function showError(el, condition) {
	if (condition) {
		window.scrollTo({top: el.scrollTop, behavior: "smooth"})
		el.classList.add("error")
	}
	else {
		el.classList.remove("error")
	}
	return condition
}