(document.querySelector("#sump .info__text") || document.getElementById("sump")).innerHTML = `<button type="button" class="btn btn--favoriteStatus" onclick="changeFavoriteStatus(this, 'sump')" data-id="sump" area-label="Добавить в избранное"><svg viewBox="0 0 100 100"><use xlink:href="#star" /></svg></button><div class="dot__title"><h2 class="dot__title_heading">sump</h2><p class="dot__title_paragraph">Мэр: <b>Mehanizm7798</b></p></div><div class="coords dot__coords"><h3 class="coords__header">Координаты</h3><p class="coords__paragraph">Ад - <span class="red">-9 1219</span></p><p class="coords__paragraph">Обычный мир - <span class="gray">5 68 9837</span></p></div>`