// import './index.html';
ymaps.ready(init);
let myMap, placemark;

function init() {
  myMap = new ymaps.Map(
    'map',
    {
      center: [55.752296, 37.602629],
      zoom: 14,
    },
    {
      balloonMinWidth: 353,
    }
  );

  myMap.events.add('click', function (e) {
    myMap.balloon.close();
  });

  myMap.events.add('click', function (e) {
    if (!myMap.balloon.isOpen()) {
      let coords = e.get('coords');
      myMap.balloon.open(coords, {
        content:
          '<div style = "height: 300px;">' +
          '<div id = "review__list"; style = "height: 100px; overflow: scroll;"></div>' +
          '<h1>Отзыв</h1>' +
          '<ul style = "padding: 0; list-style-type: none;">' +
          '<li><input id = "myName" placeholder="Укажите Ваше имя"></li>' +
          '<li><input id = "place" placeholder="Укажите место"></li>' +
          '<li><textarea id = "review" style = "resize: none;" placeholder="Оставьте отзыв"></textarea>' +
          '<li><button id = "btn">Добавить</button></li>' +
          '<ul>' +
          '</div>',
      });
    }
  });
  clusterer = new ymaps.Clusterer({
    // groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: true,
  });
  clusterer.events.add('click', (e) => {
    const coords = e.get('target').geometry.getCoordinates();
    myMap.balloon.open(coords);
  });

  myMap.geoObjects.add(clusterer);

  myMap.events.add('click', function (e) {
    let coords = e.get('coords');
    createPlacemark(coords);
  });
  document.body.addEventListener('click', onClick);
}
function onClick(e) {
  if (e.target.id === 'btn') {
    const myName = document.querySelector('#myName');
    const place = document.querySelector('#place');
    const review = document.querySelector('#review');

    storage.data = JSON.stringify({
      name: myName.value,
      place: place.value,
      review: review.value,
    });
    createForm();
    // myMap.balloon.setData(content)
    myMap.balloon.close();
  }
}
let storage = localStorage;

function createPlacemark(coords) {
  placemark = new ymaps.Placemark(coords);
  placemark.events.add('click', (e) => {
    const coords = e.get('target').geometry.getCoordinates();
    myMap.balloon.open(coords);
    
    const result = JSON.parse(storage.data || '{}');
    const form = createForm(coords, result);
    myMap.balloon.setData(form.innerHTML);
  });
  clusterer.add(placemark);
}

function createForm(coords, result) {
  const reviewList = document.querySelector('#review__list');
  reviewList.id.coords = JSON.stringify(coords);
  const div = document.createElement('div');
   result = JSON.parse(storage.data || '{}');
  div.innerHTML = `
<div><b>${result.name}</b>[${result.place}]</div><div>${result.review}</div>`;
  reviewList.appendChild(div);
}
