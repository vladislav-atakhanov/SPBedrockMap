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
		currentState: 0
	},

	branches = document.getElementsByClassName('branch'),
	roads = document.getElementsByClassName('road'),
	html = document.documentElement;

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
	if (roads[i].classList.contains("red") || roads[i].classList.contains("yellow"))
	{
		roads[i].style.width = `${Math.abs(roads[i].getAttribute("data-x")) / 20}rem`
		roads[i].style.top = `calc(${roads[i].getAttribute("data-z") / 20}rem + 50%)`
		if (roads[i].getAttribute("data-x") < 0)
		{
			roads[i].style.left = `calc(${roads[i].getAttribute("data-x") / 20}rem + 50%)`
		}
	}
	else if (roads[i].classList.contains("green") || roads[i].classList.contains("blue"))
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

info.closeBtn.onclick = function(e)
{
	updateInfo(0)
}

// Input handler
let fingers = []
let prevDiff = 0
map.wrapper.onpointerdown = function(e)
{
	fingers.push(e)
	let shiftX = e.pageX - map.x;
	let shiftY = e.pageY - map.y;

	map.wrapper.style.cursor = "move"

	map.wrapper.onpointermove = function(e)
	{
		for (let i = 0; i < fingers.length; i++)
		{
			if (e.pointerId === fingers[i].pointerId) {fingers[i] = e}
		}

		// Swipe
		if (fingers.length == 1)
		{
			map.x = e.pageX - shiftX
			map.y = e.pageY - shiftY
			updateMap()
		}
		// Zoom
		if (fingers.length == 2)
		{
			const curDiff = Math.abs(
				fingers[0].clientY - fingers[1].clientY
			)
			if (prevDiff > 0) {
				map.scale += (curDiff - prevDiff) / 10
			}
			if (map.scale < 0.1) {map.scale = 0.1}
			if (map.scale > 2) {map.scale = 2}
			prevDiff = curDiff;
			updateMap()
		}
	}
	map.wrapper.onpointerup = map.wrapper.onpointerenter = function(e)
	{
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
	if (map.scale < 0.1) {map.scale = 0.1}
	if (map.scale > 2) {map.scale = 2}
	updateMap()
}
const defaultBtn = document.getElementById('defaultBtn')
function toDefault(e)
{
	map.scale = (window.innerWidht >= 768) ? 1 : 0.5
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

	if (mode == "=") {info.currentState = n}
	if (mode == "+") {info.currentState += n}

	if (info.currentState < 0) {info.currentState = 0}
	if (info.currentState >= classes.length) {info.currentState = classes.length - 1}

	info.el.classList.add(classes[info.currentState])
	info.closeBtn.classList.add(classes[info.currentState])
}

function updateMap()
{
	map.el.style.transform = `translate(${map.x}px, ${map.y}px) scale(${map.scale})`
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

	if (map.scale < 0.1) {map.scale = 0.1}
	if (map.scale > 2) {map.scale = 2}

	map.el.style.transition = "transform 0.25s linear"
	updateMap()
	setTimeout(function() {map.el.style.transition = "transform 0s linear"}, 250)
}

info.el.onclick = function(e)
{
	updateInfo(1, "+")
}
const court = ""
const courtEl = ""
if (court != "") {
	courtEl = document.getElementById(court)
	infernia.classList.add("court")
	infernia.style.color = "#80f"
}
function showCourt() {
	if (court != "") {
		courtEl.click()
	}
}