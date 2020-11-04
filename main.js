const 
	map =
	{
		el: document.getElementById('map'),
		wrapper: document.getElementById('mapWrapper'),
		scale: 0.5,
		x: 0,
		y: 0
	},

	cities = document.getElementsByClassName('city'),
	citiesInfo = document.getElementsByClassName('city_info'),
	info = {
		el: document.getElementsByClassName('info')[0],
		closeBtn: document.getElementById('infoCloseBtn'),
		currentState: 0
	},

	branches = document.getElementsByClassName('branch'),
	roads = document.getElementsByClassName('road')

let selectedCity = 0;
for (let i = 0; i < cities.length; i++)
{

	cities[i].style.color = cities[i].getAttribute("data-color")
	cities[i].style.top = `calc(${cities[i].getAttribute("data-z") / 20}rem + 50%)`
	cities[i].style.left = `calc(${cities[i].getAttribute("data-x") / 20}rem + 50%)`

	cities[i].onclick = function(e)
	{
		cities[selectedCity].classList.remove("selected")
		cities[i].classList.add("selected")
		citiesInfo[selectedCity].style.opacity = "0"
		citiesInfo[i].style.opacity = "1"
		updateInfo(1)
		selectedCity = i
	}
}
for (let i = 0; i < branches.length; i++)
{
	branches[i].style.width = `calc(${branches[i].getAttribute("data-w") / 20 + 10}rem + 50%)`
}

for (let i = 0; i < roads.length; i++)
{
	if (roads[i].classList.contains("red") || roads[i].classList.contains("yellow")) {
		roads[i].style.width = `${Math.abs(roads[i].getAttribute("data-x")) / 20}rem`
		roads[i].style.top = `calc(${roads[i].getAttribute("data-z") / 20}rem + 50%)`
		if (roads[i].getAttribute("data-x") < 0) {
			roads[i].style.left = `calc(${roads[i].getAttribute("data-x") / 20}rem + 50%)`
		}
	}
	else if (roads[i].classList.contains("green") || roads[i].classList.contains("blue")) {
		roads[i].style.height = `${Math.abs(roads[i].getAttribute("data-z")) / 20}rem`
		roads[i].style.left = `calc(${roads[i].getAttribute("data-x") / 20}rem + 50%)`
		if (roads[i].getAttribute("data-z") < 0) {
			roads[i].style.top = `calc(${roads[i].getAttribute("data-z") / 20}rem + 50%)`
		}
	}
}

updateMap()

info.closeBtn.onclick = function(e)
{
	updateInfo(0)
}

// Drag-n-drop
map.wrapper.onpointerdown = function(e)
{

	let shiftX = e.pageX - map.x;
	let shiftY = e.pageY - map.y;

	map.x = e.pageX - shiftX
	map.y = e.pageY - shiftY

	map.wrapper.style.cursor = "move"

	map.wrapper.onpointermove = function(e)
	{
		map.x = e.pageX - shiftX
		map.y = e.pageY - shiftY
		updateMap()
	};

	map.wrapper.onpointerup = () =>
	{
		map.wrapper.onpointermove = null;
		map.wrapper.onpointerup = null;
		map.wrapper.style.cursor = "default"
	};
}

// Scaling
map.wrapper.onmousewheel = function(e)
{
	let delta = e.deltaY || e.detail || e.wheelDelta
	map.scale += (delta < 0) ? 0.1 : -0.1
	if (map.scale < 0.25) map.scale = 0.25
	if (map.scale > 3) map.scale = 3
	updateMap()
}

function updateInfo(n) {
	const classes = ["a", "b", "c"]
	info.el.classList.remove(classes[info.currentState])
	info.closeBtn.classList.remove(classes[info.currentState])

	if (n == 0) {info.currentState = 0}
	else {info.currentState += n}
	if (info.currentState < 0) {info.currentState = 0}
	if (info.currentState >= classes.length) {info.currentState = classes.length - 1}

	info.el.classList.add(classes[info.currentState])
	info.closeBtn.classList.add(classes[info.currentState])
}

function updateMap() {
	map.el.style.transform = `translate(${map.x}px, ${map.y}px) scale(${map.scale})`
}


// Keyboard events
document.onkeydown = function(e)
{
	if (e.keyCode == 65 || e.keyCode == 37) {map.x -= 10}
	if (e.keyCode == 87 || e.keyCode == 38) {map.y -= 10}
	if (e.keyCode == 68 || e.keyCode == 39) {map.x += 10}
	if (e.keyCode == 83 || e.keyCode == 40) {map.y += 10}

	if (e.keyCode == 107 || e.keyCode == 187) {map.scale += 0.1}
	if (e.keyCode == 109 || e.keyCode == 189) {map.scale -= 0.1}

	map.el.style.transition = "transform 0.25s linear"
	updateMap()
	setTimeout(250, function() {map.el.style.transition = "none"})
}

info.el.onclick = function(e) {
	updateInfo(1)
}