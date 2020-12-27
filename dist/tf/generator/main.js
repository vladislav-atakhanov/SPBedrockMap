const html = document.documentElement

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


function showError(el, condition)
{
  if (condition)
  {
    window.scrollTo({top: el.scrollTop, behavior: "smooth"})
    el.classList.add("error")
  }
  else {el.classList.remove("error")}
  return condition
}

const numberWrap = document.querySelector("#number .group")
const rad = numberWrap.offsetWidth / 3.5
const pi = Math.PI

a = 0
for (let i = 0; i < 36; i++) {
  if (i % 9 == 0) {
    continue
  }
  a++
  const k = 100
  const radio = document.createElement("label")
  radio.classList.add("radio")
  radio.setAttribute("style", `--y: ${Math.floor(Math.sin(i * pi / 18) * k) / k}; --x: ${Math.floor(Math.cos(i * pi / 18) * k) / k}`)
  radio.innerHTML = `<input type="radio" class="radio__input visually-hidden" name="number" value="${a}"><span class="radio__body radio__body--number">${a}</span>`
  numberWrap.appendChild(radio)
}

const colors = ["red", "green", "blue", "yellow", "purple", "tint"]

function submit() {
  let error = false
  const inputs = {
    branch: getInputByName("branch"),
    number: getInputByName("number"),
    mayor: document.querySelector("#mayor input"),

    description: document.querySelector("#description"),
    pictures: document.querySelector("#pictures")
  }

  for (let prop in inputs) {
    const el = inputs[prop]
    if (el != inputs.description && el != inputs.pictures && el != inputs.branch) {
      if (showError(el, (el.value == undefined || el.value == ""))) error = true
    }
  }

  if (!error) {
    let result = "{\n"

    if (inputs.number.value) {result += `    "number": ${inputs.number.value},\n`}
    if (inputs.mayor.value != "") {
      result += `    "mayor": "${inputs.mayor.value.replace(/"([^"]*)"/g, '«$1»').replace(/(^\s*)|(\s*)$/g, '')}",\n`
    }

    if (!inputs.branch.value) { inputs.branch.value = colors[Math.floor(Math.random() * colors.length)] }
    result += `    "branch": "${inputs.branch.value}",\n`

    if (inputs.description.value != "")
    {
      result += `    "description": "${inputs.description.value.replace(/\n/g, "<br>").replace(/"([^"]*)"/g, '«$1»').replace(/(^\s*)|(\s*)$/g, '')}",\n`
    }
    if (inputs.pictures.checked) {result += `    "pictures": "true",\n`}
    result += "}"
    result = result.replace(",\n}", "\n}")

    copy(result)
    const btn = document.getElementById('btn')
    const text = btn.innerText
    btn.innerText = "Скопировано в буфер обмена"
    setTimeout(function() {btn.innerText = text}, 5000)
  }
}

function getInputByName(name) {
  const radios = document.querySelectorAll('[name="' + name + '"]')
  for (var i = radios.length - 1; i >= 0; i--) {
    if (radios[i].checked) return radios[i]
  }
  return document.querySelector("#" + name)
}

function copy(text) {
  const el = document.createElement("textarea")
  el.className = "vissualy-hidden"
  el.value = text
  document.body.appendChild(el)
  el.select()
  el.setSelectionRange(0, 99999)
  document.execCommand("copy")
  el.remove()
}

function loadStyle(id) {
  let link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = "../../style/" + id +".css" 
  link.classList.add("style--" + id)
  document.head.appendChild(link)
}
window.onload = function() {
  loadStyle("font")
}