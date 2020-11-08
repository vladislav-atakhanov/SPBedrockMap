const 
	map =
	{
		el: document.getElementById('map'),
		wrapper: document.getElementById('mapWrapper'),
		scale: 0.5,
		x: 0,
		y: 0
	},

	dots = document.getElementsByClassName('dot'),
	dotsInfo = document.getElementsByClassName('dot__info'),
	info =
	{
		el: document.getElementsByClassName('info')[0],
		closeBtn: document.getElementById('infoCloseBtn'),
		openBtn: document.getElementById('infoOpenBtn'),
		images: document.getElementsByClassName('info__image'),
		currentState: 0
	},

	branches = document.getElementsByClassName('branch'),
	roads = document.getElementsByClassName('road'),
	html = document.documentElement;

let darkTheme = localStorage.getItem("darkTheme")
if (darkTheme == "true") {html.classList.add("dark")}
function switchTheme()
{
	html.classList.toggle("dark")
	html.classList.add("theme-in-transition")
	setTimeout(function() {html.classList.remove("theme-in-transition")}, 500)
	if (darkTheme == "true") {localStorage.setItem("darkTheme", "false")}
	else {localStorage.setItem("darkTheme", "true")}
}

let selectedDot = 0;
for (let i = 0; i < dotsInfo.length; i++)
{
	if (dotsInfo[i] == document.getElementById("hubInfo")) {selectedDot = i}
}
for (let i = 0; i < dots.length; i++)
{

	dots[i].style.color = dots[i].getAttribute("data-color")
	dots[i].style.top = `calc(${dots[i].getAttribute("data-z") / 20}rem + 50%)`
	dots[i].style.left = `calc(${dots[i].getAttribute("data-x") / 20}rem + 50%)`

	dots[i].onclick = function(e)
	{
		dots[selectedDot].classList.remove("selected")
		dotsInfo[selectedDot].style.opacity = "0"
		dotsInfo[selectedDot].style.zIndex = "0"

		dots[i].classList.add("selected")
		dotsInfo[i].style.opacity = "1"
		dotsInfo[i].style.zIndex = "1"

		if (selectedDot == i) {updateInfo(1, "+")}
		if (selectedDot != i) {updateInfo(1, "=")}
		selectedDot = i
	}
}
for (let i = 0; i < branches.length; i++)
{
	branches[i].style.width = `calc(${branches[i].getAttribute("data-w") / 20 + 10}rem + 50%)`
}

for (let i = 0; i < roads.length; i++)
{
	if (roads[i].classList.contains("road--red") || roads[i].classList.contains("road--yellow"))
	{
		roads[i].style.width = `${Math.abs(roads[i].getAttribute("data-x")) / 20}rem`
		roads[i].style.top = `calc(${roads[i].getAttribute("data-z") / 20}rem + 50%)`
		if (roads[i].getAttribute("data-x") < 0)
		{
			roads[i].style.left = `calc(${roads[i].getAttribute("data-x") / 20}rem + 50%)`
		}
	}
	else if (roads[i].classList.contains("road--green") || roads[i].classList.contains("road--blue"))
	{
		roads[i].style.height = `${Math.abs(roads[i].getAttribute("data-z")) / 20}rem`
		roads[i].style.left = `calc(${roads[i].getAttribute("data-x") / 20}rem + 50%)`
		if (roads[i].getAttribute("data-z") < 0)
		{
			roads[i].style.top = `calc(${roads[i].getAttribute("data-z") / 20}rem + 50%)`
		}
	}
}

const scaleRange = document.getElementById('scaleRange')
scaleRange.value = map.scale
function changeScale(e)
{
	map.scale = parseFloat(scaleRange.value)
	updateMap()
}
updateMap()

// Input handler
let fingers = []
let prevDiff = 0
map.wrapper.onpointerdown = function(e)
{
	fingers.push(e)
	let isNotZoom = true;
	let shiftX = e.pageX - map.x
	let shiftY = e.pageY - map.y

	map.wrapper.style.cursor = "move"

	map.wrapper.onpointermove = function(e)
	{
		for (let i = 0; i < fingers.length; i++)
		{
			if (e.pointerId === fingers[i].pointerId) {fingers[i] = e}
		}

		// Swipe
		if (fingers.length == 1 && isNotZoom)
		{
			map.x = e.pageX - shiftX
			map.y = e.pageY - shiftY
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
		}
		updateMap()
	}
	map.wrapper.onpointerup = pointerUp
	map.wrapper.onpointerenter = pointerUp
	function pointerUp(e) {
		for (let i = 0; i < fingers.length; i++)
		{
			if (e.pointerId === fingers[i].pointerId) {fingers.splice(i, 1)}
		}
		map.wrapper.style.cursor = "default"
		if (fingers.length < 1)
		{
			map.wrapper.onpointermove = null;
			map.wrapper.onpointerup = null;
			prevDiff = 0
		}
	}
}

// Scaling
map.wrapper.onmousewheel = function(e)
{
	map.el.style.transition = "none"
	let delta = e.deltaY || e.detail || e.wheelDelta
	map.scale += (delta < 0) ? 0.05 : -0.05
	updateMap()
}

// toDefault
function toDefault(e)
{
	map.scale = (window.innerWidth >= 768) ? 1 : 0.5
	map.x = 0
	map.y = 0
	map.el.style.transition = "transform 0.25s linear"
	updateMap()
	setTimeout(function() {map.el.style.transition = "transform 0s linear"}, 250)
}

function updateInfo(n, mode="=")
{
	const classes = ["a", "b", "c"]
	info.el.classList.remove(classes[info.currentState])
	info.closeBtn.classList.remove(classes[info.currentState])
	info.openBtn.classList.remove(classes[info.currentState])


	if (mode == "=") {info.currentState = n}
	if (mode == "+") {info.currentState += n}

	if (info.currentState < 0) {info.currentState = 0}
	if (info.currentState >= classes.length) {info.currentState = classes.length - 1}

	info.el.classList.add(classes[info.currentState])
	info.closeBtn.classList.add(classes[info.currentState])
	info.openBtn.classList.add(classes[info.currentState])
}

function updateMap()
{
	if (map.scale > 2) {map.scale = 2}
	if (map.scale < 0.1) {map.scale = 0.1}

	const 
		k = 1 / map.scale,
		x = map.x * k,
		y = map.y * k 
	map.el.style.transformOrigin = `calc(50% - ${x}px) calc(50% - ${y}px)`
	map.el.style.transform = `translate(${x}px, ${y}px) scale(${map.scale})`
	scaleRange.value = map.scale
}


// Keyboard events
document.onkeydown = function(e)
{
	if (e.keyCode == 65 || e.keyCode == 37) {map.x += 20}
	if (e.keyCode == 87 || e.keyCode == 38) {map.y += 20}
	if (e.keyCode == 68 || e.keyCode == 39) {map.x -= 20}
	if (e.keyCode == 83 || e.keyCode == 40) {map.y -= 20}

	if (e.keyCode == 107 || e.keyCode == 187) {map.scale += 0.1}
	if (e.keyCode == 109 || e.keyCode == 189) {map.scale -= 0.1}

	map.el.style.transition = "all 0.25s linear"
	updateMap()
	setTimeout(function() {map.el.style.transition = "all 0s linear"}, 250)
}

info.el.onclick = function(e) {updateInfo(1, "+")}
const court = ""
const courtEl = ""
if (court != "")
{
	courtEl = document.getElementById(court)
	infernia.classList.add("court")
	infernia.style.color = "#80f"
}
function showCourt()
{
	if (court != "") {courtEl.click()}
}

for (let i = 0; i < info.images.length; i++)
{
	info.images[i].children[0].style.opacity = "1"
}
function next(el) {
	const ch = el.children
	for (let i = 0; i < ch.length; i++)
	{
		if (ch[i].style.opacity == "1") {
			ch[i].style.opacity = "0"
			ch[i].style.zIndex = "0"
			ch[(i+1) % ch.length].style.opacity = "1"
			ch[(i+1) % ch.length].style.zIndex = "1"
			break
		}
	}
}