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

  const storage = JSON.parse(localStorage.getItem('reviews') || []);
  // console.log(storage);
  let arr = [];

  storage.forEach((reviews) => {
    createPlacemark(reviews.coords);
    // console.log(reviews.coords);
  });
  // for (let i = 0; i < storage.length; i++) {
  //   console.log(storage[1].reviews);

  // }

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
      const result = JSON.parse(localStorage.data || '{}');
      arr.push(result);
      console.log(arr);
      localStorage.setItem('reviews', JSON.stringify(arr));
      // console.log(arr);
      createForm(result);
      createPlacemark(coords, result);
      // myMap.balloon.close();
    }
  }
  // createForm()
  function createForm(result) {
    const div = document.createElement('div');
    const reviewList = document.querySelector('#review__list');
    result = JSON.parse(localStorage.data || '{}');
    console.log(result);
    div.innerHTML = `
    <div><b>${result.reviews.name}</b>[${result.reviews.place}]</div><div>${result.reviews.review}</div>`;
    reviewList.appendChild(div);
    // console.log(div);
    console.log(reviewList);
  }

  function createPlacemark(coords, result) {
    placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();
      myMap.balloon.open(coords, createForm());
    });
    clusterer.add(placemark);
  }
}
