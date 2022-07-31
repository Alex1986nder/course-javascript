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
  });

  let arr = localStorage.getItem('reviews')? JSON.parse(localStorage.getItem('reviews')): [];
  const storage = JSON.parse(localStorage.getItem('reviews') || []);
  // console.log(storage);
  // let arr = [];

  storage.forEach((reviews) => {
    createPlacemark(reviews.coords, reviews.reviews);
    // console.log(reviews.coords);

    // console.log(arr);
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

      localStorage.data = JSON.stringify({
        coords: coords,
        reviews: {
          name: myName.value,
          place: place.value,
          review: review.value,
        },
      });
      const res = JSON.parse(localStorage.data || '{}');
      arr.push(res);
      // console.log(arr);
      localStorage.setItem('reviews', JSON.stringify(arr));
      // console.log(arr);
      createForm(coords, storage);
      createPlacemark(coords, result);
      // myMap.balloon.close();
    }
  }
  // createForm()
  function createForm(coords, storage) {
    const root = document.createElement('div');
    const reviewList = document.querySelector('#review__list');
    // result = JSON.parse(localStorage.data || '{}');
    // console.log(result);
    reviewList.coords = JSON.stringify(coords);

    // console.log(div);
    // console.log(reviewList.innerHTML);
    for (let res of storage) {
      const div = document.createElement('div');
      div.innerHTML = `
      <div><b>${res.reviews.name}</b>[${res.reviews.place}]</div><div>${res.reviews.review}</div>`;
      reviewList.appendChild(div);
    }
    return root;
  }

  function createPlacemark(coords) {
    placemark = new ymaps.Placemark(coords, result);
    placemark.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();
      myMap.balloon.open(coords, createForm(coords));
    });
    clusterer.add(placemark);
  }
}
