// import './index.html';
ymaps.ready(init);
let storage = localStorage;
let clusterer;
let coords;
let myMap, placemark;
const result = JSON.parse(storage.data || '{}');
function init() {
  myMap = new ymaps.Map(
    'map',
    {
      center: [55.752296, 37.602629],
      zoom: 14,
    },
    {
      balloonMinWidth: 250,
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
          '<div id = "reviews"; style = "height: 300px;">' +
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
    groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: false,
  });
  clusterer.events.add('click', (e) => {
    const coords = e.get('target').geometry.getCoordinates();
    myMap.balloon.open(coords, createForm());
  });

  myMap.geoObjects.add(clusterer);

  document.body.addEventListener('click', onClick);

  myMap.events.add('click', function (e) {
    return (coords = e.get('coords'));
  });

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
      createForm(coords, result);
      createPlacemark(coords, createForm);
    }
  }

  // const reviews = document.querySelector('#reviews');
  function createForm(coords, result) {
    const div = document.createElement('div');
    const reviewList = document.querySelector('#review__list');
    // const root = document.createElement('div');
    // root.innerHTML = reviews.innerHTML;
    reviewList.id.coords = JSON.stringify(coords);
    result = JSON.parse(storage.data || '{}');
    div.innerHTML = `
    <div><b>${result.name}</b>[${result.place}]</div><div>${result.review}</div>`;
    reviewList.appendChild(div);

     reviewList.innerHTML 
    // myMap.balloon.setData(reviews.innerHTML);
    //  reviewList;
  }

  function createPlacemark(coords, result) {
    placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', (e) => {
      // const reviews = document.querySelector('#reviews');
      const coords = e.get('target').geometry.getCoordinates();
      // createForm(coords, result)
      // myMap.balloon.setData(form.innerHTML);
      // myMap.balloon.getData(reviews.innerHTML);
      myMap.balloon.open(coords,createForm());
    });
    clusterer.add(placemark);
  }
}
