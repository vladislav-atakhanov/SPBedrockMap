const 
	map =
	{
		el: document.getElementById('map'),
		wrapper: document.getElementById('mapWrapper'),
		scale: 0.5,
		x: 0,
		z: 0
	},
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


dotEls = document.getElementsByClassName('dot')
dotInfos = document.getElementsByClassName('dot__info')
dots = {}
for (let i = 0; i < dotEls.length; i++)	
{
	dots[dotEls[i].id] =
	{
		title: dotEls[i].title,
		el: dotEls[i],
		info: dotInfos[i],
		imageBlock: dotInfos[i].getElementsByClassName("info__image")[0],
		loadedImages: [],
		selectedImage: 0
	}
}

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
for (let i = 0; i < dotInfos.length; i++)
{
	if (dotInfos[i] == document.getElementById("hubInfo")) {selectedDot = i}
}
for (let i = 0; i < dotEls.length; i++)
{

	dotEls[i].style.color = dotEls[i].dataset.color
	dotEls[i].style.top = `calc(${dotEls[i].dataset.z / 20}rem + 50%)`
	dotEls[i].style.left = `calc(${dotEls[i].dataset.x / 20}rem + 50%)`

	dotEls[i].addEventListener("click", function(e)
	{
		dotEls[selectedDot].classList.remove("selected")
		dotInfos[selectedDot].style.opacity = "0"
		dotInfos[selectedDot].style.zIndex = "0"

		dotEls[i].classList.add("selected")
		dotInfos[i].style.opacity = "1"
		dotInfos[i].style.zIndex = "1"

		if (selectedDot == i) {updateInfo(1, "+")}
		if (selectedDot != i) {updateInfo(1, "=")}
		showImage(dotEls[i].id, 0)
		selectedDot = i
	}, {passive: true})
}
function showImage(id, i)
{

	function isLoaded(image)
	{
		for (let i = 0; i < dots[id].loadedImages.length; i++)
		{
			if (image == i)
			{
				return true
			}
		}
		return false
	}
	if (images[id] && !isLoaded(i))
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
for (let i = 0; i < branches.length; i++)
{
	branches[i].style.width = `calc(${branches[i].dataset.w / 20 + 10}rem + 50%)`
}

for (let i = 0; i < roads.length; i++)
{
	if (roads[i].classList.contains("road--red") || roads[i].classList.contains("road--yellow"))
	{
		roads[i].style.width = `${Math.abs(roads[i].dataset.x) / 20}rem`
		roads[i].style.top = `calc(${roads[i].dataset.z / 20}rem + 50%)`
		if (roads[i].dataset.x < 0)
		{
			roads[i].style.left = `calc(${roads[i].dataset.x / 20}rem + 50%)`
		}
	}
	else if (roads[i].classList.contains("road--green") || roads[i].classList.contains("road--blue"))
	{
		roads[i].style.height = `${Math.abs(roads[i].dataset.z) / 20}rem`
		roads[i].style.left = `calc(${roads[i].dataset.x / 20}rem + 50%)`
		if (roads[i].dataset.z < 0)
		{
			roads[i].style.top = `calc(${roads[i].dataset.z / 20}rem + 50%)`
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
			if (e.pointerId === fingers[i].pointerId) {fingers[i] = e}
		}

		// Swipe
		if (fingers.length == 1 && isNotZoom)
		{
			map.x = e.pageX - shiftX
			map.z = e.pageY - shiftY
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
	}, {passive: true})
	map.wrapper.addEventListener("pointerup", pointerUp, {passive: true})
	map.wrapper.addEventListener("pointerenter", pointerUp, {passive: true})
	function pointerUp(e)
	{
		for (let i = 0; i < fingers.length; i++)
		{
			if (e.pointerId === fingers[i].pointerId) {fingers.splice(i, 1)}
		}
		map.wrapper.style.cursor = "default"
		if (fingers.length < 1)
		{
			map.wrapper.addEventListener("pointermove", null, {passive: true})
			map.wrapper.addEventListener("pointerup", null, {passive: true})
			prevDiff = 0
		}
	}
}, {passive: true})

// Scaling
map.wrapper.addEventListener("mousewheel", function(e)
{
	map.el.style.transition = "none"
	let delta = e.deltaY || e.detail || e.wheelDelta
	map.scale += (delta < 0) ? 0.05 : -0.05
	updateMap()
}, {passive: true})

// toDefault
function toDefault(e)
{
	map.scale = (window.innerWidth >= 768) ? 1 : 0.5
	map.x = 0
	map.z = 0
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
		y = map.z * k 
	map.el.style.transformOrigin = `calc(50% - ${x}px) calc(50% - ${y}px)`
	map.el.style.transform = `translate(${x}px, ${y}px) scale(${map.scale})`
	scaleRange.value = map.scale
}


// Keyboard events
document.addEventListener("keydown", function(e)
{
	if (e.keyCode == 65 || e.keyCode == 37) {map.x += 20}
	if (e.keyCode == 87 || e.keyCode == 38) {map.z += 20}
	if (e.keyCode == 68 || e.keyCode == 39) {map.x -= 20}
	if (e.keyCode == 83 || e.keyCode == 40) {map.z -= 20}

	if (e.keyCode == 107 || e.keyCode == 187) {map.scale += 0.1}
	if (e.keyCode == 109 || e.keyCode == 189) {map.scale -= 0.1}

	map.el.style.transition = "all 0.25s linear"
	updateMap()
	setTimeout(function() {map.el.style.transition = "all 0s linear"}, 250)
}, {passive: true})

info.el.addEventListener("click", function(e) {updateInfo(1, "+")}, {passive: true})
const court = "testers"
function showDot(id)
{
	if (id != "")
	{
		dots[id].el.click()
		map.x = -dots[id].el.dataset.x * 1.4
		map.z = -dots[id].el.dataset.z * 1.4
		map.scale = 1.75
		map.el.style.transition = "all 0.25s linear"
		updateMap()
		setTimeout(function() {map.el.style.transition = "all 0s linear"}, 250)
	}
}

function next(el)
{
	const id = el.parentNode.dataset.id
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