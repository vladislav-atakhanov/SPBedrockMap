(document.querySelector("#hub .info__text") || document.getElementById("hub")).innerHTML = `<button type="button" class="btn btn--favoriteStatus" onclick="changeFavoriteStatus(this, 'hub')" data-id="hub" area-label="Добавить в избранное"><svg viewBox="0 0 100 100"><use xlink:href="#star" /></svg></button><div class="dot__title"><h2 class="dot__title_heading">Хаб</h2><p class="dot__title_paragraph"><b>Государственная собственность</b></p></div><div class="coords dot__coords"><h3 class="coords__header">Координаты</h3><p class="coords__paragraph">Ад - <span class="gray">0 0</span></p></div>`