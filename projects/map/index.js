import './index.html';
import './style.css';

ymaps.ready(init);
let myMap, placemark, coords, clusterer;
const result = JSON.parse(localStorage.data || '{}');
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
    let coords = e.get('coords');
    myMap.balloon.open(coords, {
      content:
        '<div id = "reviews"; style = "height: 350px;">' +
        `<div id = "review__list"; style = "height: 100px; overflow: scroll;"></div>` +
        '<h1>Отзыв</h1>' +
        '<ul style = "padding: 0; list-style-type: none;">' +
        '<li><input id = "myName" placeholder="Укажите Ваше имя"></li>' +
        '<li><input id = "place" placeholder="Укажите место"></li>' +
        '<li><textarea id = "review" style = "resize: none;" placeholder="Оставьте отзыв"></textarea>' +
        '<li><button id = "btn">Добавить</button></li>' +
        '<ul>' +
        '</div>',
    });
  });

  clusterer = new ymaps.Clusterer({
    groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: false,
  });

  clusterer.events.add('click', (e) => {
    const coords = e.get('target').geometry.getCoordinates();
    myMap.balloon.open(coords, createForm());
    // myMap.balloon.open(coords, {
    //   content:
    //     '<div id = "reviews"; style = "height: 350px;">' +
    //     `<div id = "review__list"; style = "height: 100px; overflow: scroll;">${createForm(result)}</div>` +
    //     '<h1>Отзыв</h1>' +
    //     '<ul style = "padding: 0; list-style-type: none;">' +
    //     '<li><input id = "myName" placeholder="Укажите Ваше имя"></li>' +
    //     '<li><input id = "place" placeholder="Укажите место"></li>' +
    //     '<li><textarea id = "review" style = "resize: none;" placeholder="Оставьте отзыв"></textarea>' +
    //     '<li><button id = "btn">Добавить</button></li>' +
    //     '<ul>' +
    //     '</div>',
    // });
  });

  let arr = [];

  const storage = JSON.parse(localStorage.getItem('reviews')) || [];
  const newStorage = [...storage]
  // console.log(storage);
  newStorage.forEach((reviews) => {
    createPlacemark(reviews.coords);
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

      localStorage.data = JSON.stringify([
        {
          coords: coords,
          reviews: [
            {
              name: myName.value,
              place: place.value,
              review: review.value,
            },
          ],
        },
      ]);
      arr.push(localStorage.data);
      // console.log(arr);
      localStorage.setItem('reviews', JSON.stringify(arr));
      // console.log(arr);
      createForm(result);
      createPlacemark(coords, createForm);
      // myMap.balloon.close();
    }
  }
  // createForm()
  function createForm(result) {
    const div = document.createElement('div');
    const reviewList = document.querySelector('#review__list');
    result = JSON.parse(localStorage.data || '{}');
    // console.log(result);
    div.innerHTML = `
    <div><b>${result[0].reviews[0].name}</b>[${result[0].reviews[0].place}]</div><div>${result[0].reviews[0].review}</div>`;
    reviewList.appendChild(div);
    // console.log(div);
    console.log(reviewList);
  }

  function createPlacemark(coords, result) {
    placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();
      myMap.balloon.open(coords, createForm());
      // myMap.balloon.open(coords, {
      //   content:
      //     '<div id = "reviews"; style = "height: 350px;">' +
      //     `<div id = "review__list"; style = "height: 100px; overflow: scroll;">${createForm(result)}</div>` +
      //     '<h1>Отзыв</h1>' +
      //     '<ul style = "padding: 0; list-style-type: none;">' +
      //     '<li><input id = "myName" placeholder="Укажите Ваше имя"></li>' +
      //     '<li><input id = "place" placeholder="Укажите место"></li>' +
      //     '<li><textarea id = "review" style = "resize: none;" placeholder="Оставьте отзыв"></textarea>' +
      //     '<li><button id = "btn">Добавить</button></li>' +
      //     '<ul>' +
      //     '</div>',
      // });
    });
    clusterer.add(placemark);
  }
}
