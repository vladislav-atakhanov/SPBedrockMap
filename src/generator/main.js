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

let selectedMarks = []
const marksList = document.querySelector(".marks__list")

function changeType(txt)
{
  if (txt == "city" || txt == "other")
  {
    document.querySelector("#name").style.display = "block"
    document.querySelector(".residents").style.display = "block"
    if (txt == "other") {
      document.querySelector(".residents").style.display = "none"
      document.querySelector("#mayor legend").innerText = "Владелец"
      document.querySelector("#name legend").innerText = "Название заведения"
      document.querySelector(".marks").classList.remove("optional")
    }
    else {
      document.querySelector("#name legend").innerText = "Название города"
      document.querySelector("#mayor legend").innerText = "Мэр"
      document.querySelector(".marks").classList.add("optional")
    }
  }
  else if (txt == "end" || txt == "base")
  {
    document.querySelector("#name").style.display = "none"
    document.querySelector(".residents").style.display = "none"
    document.querySelector("#mayor legend").innerText = "Владелец"
    if (txt == "end") {
      document.querySelector("#mayor").classList.add("optional")
    }
    else {
      document.querySelector("#mayor").classList.remove("optional")
    }
  }

  if (txt != "end") {
    document.querySelector(".marks").style.display = "block"
  }
  else {
    document.querySelector(".marks").style.display = "none"
  }
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

function marksUpdate(el) {
  const markEl = document.createElement("span")
  if (selectedMarks.includes('"' + el.value + '"')) {
    const index = selectedMarks.findIndex(m => el.value == m)
    if (index !== -1) selectedMarks.splice(index, 1)
    document.querySelector("#mark--" + el.value).remove()
  } else {
    selectedMarks.push('"' + el.value + '"')
    markEl.innerText = document.querySelector(`[value="${el.value}"]`).innerText
    markEl.id = "mark--" + el.value
    markEl.className = "marks__item"
    marksList.appendChild(markEl)
  }
  el.value = " "
}

function submit() {
  let error = false
  const inputs = {
    type: getInputByName("type"),
    branch: getInputByName("branch"),
    subbranch: document.querySelector("#subbranch"),
    name: document.querySelector("#name input"),
    mayor: document.querySelector("#mayor input"),

    netherX: document.querySelector("#netherX"),
    netherY: document.querySelector("#netherY"),
    netherZ: document.querySelector("#netherZ"),

    overworldX: document.querySelector("#overworldX"),
    overworldY: document.querySelector("#overworldY"),
    overworldZ: document.querySelector("#overworldZ"),

    description: document.querySelector("#description"),
    residents: document.querySelector("#residents"),
    pictures: document.querySelector("#pictures")
  }

  for (let prop in inputs) {
    const el = inputs[prop]
    if (
      (el != inputs.description && el != inputs.residents &&
      el != inputs.overworldX && el != inputs.overworldY && el != inputs.overworldZ && el != inputs.subbranch && el != inputs.marks) &&
      !(inputs.type.value == "end" && (el == inputs.mayor || el == inputs.name)) &&
      !(inputs.type.value == "base" && (el == inputs.name))
    )
    {
      if (showError(el, (el.value == undefined || el.value == ""))) error = true
    }
  }

  if (!error) {
    let result = "{\n"

    if (inputs.type.value != "city") {result += `    "type": "${inputs.type.value}",\n`}
    if (inputs.type.value != "end" && inputs.type.value != "base" && inputs.name.value != "") {
      result += `    "name": "${inputs.name.value.replace(/"([^"]*)"/g, '«$1»').replace(/(^\s*)|(\s*)$/g, '')}",\n`
    }
    if (inputs.mayor.value != "") {
      result += `    "mayor": "${inputs.mayor.value.replace(/"([^"]*)"/g, '«$1»').replace(/(^\s*)|(\s*)$/g, '')}",\n`
    }

    result += `    "branch": "${inputs.branch.value}",\n`
    if (inputs.subbranch.checked)
    {
      let color = ""

      if (inputs.branch.value == "red" || inputs.branch.value == "yellow")
      {
        if (inputs.netherX.value > 0) {color = "blue"}
        if (inputs.netherX.value < 0) {color = "green"}
      }
      else
      {
        if (inputs.netherZ.value > 0) {color = "red"}
        if (inputs.netherZ.value < 0) {color = "yellow"}
      }

      result += `    "subbranch": "${color}",\n`
    }

    result += `    "nether": {\n`
    result += `        "x": ${inputs.netherX.value},\n`
    if (inputs.netherY.value != "65") {result += `        "y": ${inputs.netherY.value},\n`}
    result += `        "z": ${inputs.netherZ.value}\n`
    result += `    },\n`

    if (inputs.overworldX.value != "" && inputs.overworldY.value != "" && inputs.overworldZ.value != "")
    {
      result += `    "overworld": {\n`
      result += `        "x": ${inputs.overworldX.value},\n`
      result += `        "y": ${inputs.overworldY.value},\n`
      result += `        "z": ${inputs.overworldZ.value}\n`
      result += `    },\n`
    }

    if (inputs.description.value != "")
    {
      result += `    "description": "${inputs.description.value.replace(/\n/g, "<br>").replace(/"([^"]*)"/g, '«$1»').replace(/(^\s*)|(\s*)$/g, '')}",\n`
    }
    if (inputs.residents.value != "")
    {
      result += '    "residents": ['
      res = inputs.residents.value.split(",")
      for (var i = 0; i < res.length; i++)
      {
        if (res[i] == "") {continue}
        result += `"${res[i].replace(/"([^"]*)"/g, '«$1»').replace(/(^\s*)|(\s*)$/g, '')}"`
        if (i < res.length - 1) {result += ", "}
      }
      result += "],\n"
    }
    if (selectedMarks.length)
    {
      result += '    "marks": [' + selectedMarks
      result += "],\n"
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