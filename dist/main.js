const 
	map =
	{
		el: document.getElementById('map'),
		wrapper: document.getElementById('mapWrapper'),
		scale: 0.5,
		x: 0,
		z: 0,
		savedX: 0,
		savedZ: 0 
	},
	info =
	{
		el: document.getElementsByClassName('info')[0],
		closeBtn: document.getElementById('infoCloseBtn'),
		openBtn: document.getElementById('infoOpenBtn'),
		currentState: 0
	},
	html = document.documentElement;


dotEls = document.getElementsByClassName('dot')
dots =
{
	loadedInfo: []
}
for (let i = 0; i < dotEls.length; i++)	
{
	dots[dotEls[i].getAttribute("href").slice(1)] =
	{
		title: dotEls[i].title,
		el: dotEls[i],
		loadedImages: [],
		selectedImage: 0
	}
}

let darkTheme = localStorage.getItem("darkTheme")
if (darkTheme == "true")
	{html.classList.add("dark")}

function switchTheme()
{
	html.classList.toggle("dark")
	html.classList.add("theme-in-transition")
	setTimeout(function()
		{html.classList.remove("theme-in-transition")}, 500)
	if (darkTheme == "true")
		{localStorage.setItem("darkTheme", "false")}
	else
		{localStorage.setItem("darkTheme", "true")}
}

let selectedDot = "hub";
showInfo(selectedDot)
for (let i = 0; i < dotEls.length; i++)
{
	dotEls[i].addEventListener("click", function(e)
	{
		const id = dotEls[i].getAttribute("href").slice(1)
		dots[selectedDot].el.classList.remove("selected")
		dots[id].el.classList.add("selected")

		hideInfo(selectedDot)
		showInfo(id)

		if (selectedDot == id)
			{updateInfo(1, "+")}
		if (selectedDot != id)
			{updateInfo(1, "=")}
		showImage(id, 0)
		selectedDot = id
	})
}
function showImage(id, i)
{
	if (images[id] && !dots[id].loadedImages.includes(i))
	{
		dots[id].loadedImages.push(i)
		dots[id].imageBlock.innerHTML += images[id][i]
	}
	if (dots[id].imageBlock)
	{
		dots[id].imageBlock.children[i].style.opacity = "1"
		dots[id].imageBlock.children[i].style.zIndex = "1"
	}
}
function hideImage(id, i)
{
	if (dots[id].imageBlock)
	{
		dots[id].imageBlock.children[i].style.opacity = "0"
		dots[id].imageBlock.children[i].style.zIndex = "0"	
	}
}

const scaleRange = document.getElementById('scaleRange')
scaleRange.value = map.scale
function changeScale(e)
{
	map.scale = parseFloat(scaleRange.value)
	scaleMap()
}

// Input handler
let fingers = []
let prevDiff = 0
map.wrapper.addEventListener("pointerdown", function(e)
{
	fingers.push(e)
	let isNotZoom = true;
	let shiftX = e.pageX - map.x
	let shiftY = e.pageY - map.z

	map.wrapper.style.cursor = "move"

	map.wrapper.addEventListener("pointermove", function(e)
	{
		for (let i = 0; i < fingers.length; i++)
		{
			if (e.pointerId === fingers[i].pointerId)
				{fingers[i] = e}
		}

		// Swipe
		if (fingers.length == 1 && isNotZoom)
		{
			map.x = e.pageX - shiftX
			map.z = e.pageY - shiftY
			moveMap()
		}
		// Zoom
		else if (fingers.length == 2)
		{
			isNotZoom = false
			const curDiff = Math.abs(
				fingers[0].clientY - fingers[1].clientY
			)
			if (prevDiff > 0)
			{
				map.scale += (curDiff - prevDiff) / 100
			}
			prevDiff = curDiff;
			scaleMap()
		}
	},
	{passive: true})
	map.wrapper.addEventListener("pointerup", pointerUp,
		{passive: true})
	map.wrapper.addEventListener("pointerenter", pointerUp,
		{passive: true})
	function pointerUp(e)
	{
		for (let i = 0; i < fingers.length; i++)
		{
			if (e.pointerId === fingers[i].pointerId)
				{fingers.splice(i, 1)}
		}
		map.wrapper.style.cursor = "default"
		if (fingers.length < 1)
		{
			map.wrapper.addEventListener("pointermove", null,
				{passive: true})
			map.wrapper.addEventListener("pointerup", null,
				{passive: true})
			prevDiff = 0
		}
	}
},
{passive: true})

// Scaling
map.wrapper.addEventListener("mousewheel", function(e)
{
	map.el.style.transition = "none"
	let delta = e.deltaY || e.detail || e.wheelDelta
	map.scale += (delta < 0) ? 0.05 : -0.05
	map.el.style.transition = "transform 0.1s linear"
	scaleMap()
	setTimeout(function()
		{map.el.style.transition = "transform 0s linear"}, 250)
},
{passive: true})

// toDefault
function toDefault(e)
{
	map.scale = 0.5
	map.x = 0
	map.z = 0
	map.el.style.transition = "transform 0.25s linear"
	moveMap()
	setTimeout(function()
		{map.el.style.transition = "transform 0s linear"}, 250)
}

function updateInfo(n, mode="=")
{
	const classes = ["a", "b", "c"]
	info.el.classList.remove(classes[info.currentState])
	info.closeBtn.classList.remove(classes[info.currentState])
	info.openBtn.classList.remove(classes[info.currentState])


	if (mode == "=")
		{info.currentState = n}
	if (mode == "+")
		{info.currentState += n}

	if (info.currentState < 0)
		{info.currentState = 0}
	if (info.currentState >= classes.length)
		{info.currentState = classes.length - 1}

	info.el.classList.add(classes[info.currentState])
	info.closeBtn.classList.add(classes[info.currentState])
	info.openBtn.classList.add(classes[info.currentState])
}

function scaleMap()
{
	if (map.scale > 2)
		{map.scale = 2}
	if (map.scale < 0.1)
		{map.scale = 0.1}
	map.el.style.transform = `translate(${map.savedX}px, ${map.savedZ}px) scale(${map.scale})`
	scaleRange.value = map.scale
	map.x = map.scale * map.savedX
	map.z = map.scale * map.savedZ
}
function moveMap()
{
	map.savedX = map.x / map.scale
	map.savedZ = map.z / map.scale
	map.el.style.transformOrigin = `calc(50% - ${map.savedX}px) calc(50% - ${map.savedZ}px)`
	map.el.style.transform = `translate(${map.savedX}px, ${map.savedZ}px) scale(${map.scale})`
}


info.el.addEventListener("click", function(e)
	{updateInfo(1, "+")},
{passive: true})
const court = ""
function showDot(id)
{
	if (id != "")
	{
		dots[id].el.click()
		if (!dots[id].x)
			{dots[id].x = dots[id].el.style.left.replace(/calc\(/g, '').replace(/rem \+ 50%\)/g, '') * 28}
		if (!dots[id].z)
			{dots[id].z = dots[id].el.style.top.replace(/calc\(/g, '').replace(/rem \+ 50%\)/g, '') * 28}
		map.x = -dots[id].x
		map.z = -dots[id].z
		map.scale = 1.75
		map.el.style.transition = "all 0.25s linear"
		moveMap()
		setTimeout(function()
			{map.el.style.transition = "all 0s linear"}, 250)
	}
}

function next(el)
{
	const id = el.parentNode.id
	const ch = el.children

	hideImage(id, dots[id].selectedImage)
	dots[id].selectedImage = (dots[id].selectedImage + 1) % images[id].length
	showImage(id, dots[id].selectedImage)
}
function openInfo()
{
	showImage("hub", dots.hub.selectedImage)
	updateInfo(1)
}

function showInfo(id)
{
	if (!dots.loadedInfo.includes(id))
	{
		const el = document.createElement("script")
		el.src = `info/${id}.js`
		el.async = "true"
		document.body.appendChild(el)
		dots[id].info = document.getElementById(id)
		dots[id].imageBlock = dots[id].info.getElementsByClassName("info__image")[0]
	}
	if (dots[id].info)
	{
		dots[id].info.style.opacity = "1"
		dots[id].info.style.zIndex = "1"
	}
}
function hideInfo(id)
{
	if (dots[id].info)
	{
		dots[id].info.style.opacity = "0"
		dots[id].info.style.zIndex = "0"
	}
}

const hash = document.location.hash.slice(1)
if (hash && dots[hash]){showDot(hash)}


const searchList = document.querySelector(".search__list")
function search(value)
{
	const results = []
	while (searchList.firstChild) {searchList.removeChild(searchList.firstChild)}
	if (value == "") {return}
	for (const key in dots)
	{
		dot = dots[key]
		if (dot.title)
		{
			if (dot.title.toLowerCase() != "портал в энд" && dot.title.toLowerCase().search(value) > -1 && results.length < 10)
			{
				results.push(key)
				console.log(dot.title)
			}
		}
	}
	for (let i = 0; i < results.length; i++)
	{
		const item = document.createElement("li")
		item.classList.add("search__item")

		let color = ""
		if (dots[results[i]].el.classList.contains("dot--red")) {color = "red"}
		if (dots[results[i]].el.classList.contains("dot--green")) {color = "green"}
		if (dots[results[i]].el.classList.contains("dot--blue")) {color = "blue"}
		if (dots[results[i]].el.classList.contains("dot--yellow")) {color = "yellow"}

		item.innerHTML = `<a href="#${results[i]}" class="search__link search__link--${color}" onclick="showDot('${results[i]}'); unfocusSearch()">${dots[results[i]].title}</a>`
		searchList.appendChild(item)
	}
}
function unfocusSearch() {
	while (searchList.firstChild) {searchList.removeChild(searchList.firstChild)}
}