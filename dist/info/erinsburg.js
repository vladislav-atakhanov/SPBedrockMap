(document.querySelector("#erinsburg .info__text") || document.getElementById("erinsburg")).innerHTML = `<button type="button" class="btn btn--favoriteStatus" onclick="changeFavoriteStatus(this, 'erinsburg')" data-id="erinsburg" area-label="Добавить в избранное"><svg viewBox="0 0 100 100"><use xlink:href="#star" /></svg></button><div class="dot__title"><h2 class="dot__title_heading">Эринсбург</h2><p class="dot__title_paragraph">Мэр: <b>FlipLord SOSO</b></p></div><div class="coords dot__coords"><h3 class="coords__header">Координаты</h3><p class="coords__paragraph">Ад - <span class="red">145 600</span></p></div><p class="dot__description">Эринсбург - маленький колониальный город Голландии 17-18 веков. В нашем городе есть много красивых домов, а также, у нас происходят интересные локальные и нет РП ивент</p>`