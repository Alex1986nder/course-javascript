// import './index.html';
ymaps.ready(init);
let myMap, myPlacemark;

function init() {
  myMap = new ymaps.Map(
    'map',
    {
      center: [55.752296, 37.602629],
      zoom: 13,
    },
    {
      balloonMinWidth: 220,
    }
  );
  addPlacemark();
  points = [];
  geoObjects = [];
}

document.body.addEventListener('click', onClick);
let storage = localStorage;

function onClick(e) {
  // e.preventDefault();
  const myName = document.querySelector('#myName');
  const place = document.querySelector('#place');
  const review = document.querySelector('#review');
  if (e.target.id === 'btn') {
    storage.data = JSON.stringify({
      name: myName.value,
      place: place.value,
      review: review.value,
    });
    let clusterer = new ymaps.Clusterer({
      clusterDisableClickZoom: true,
    });
    clusterer.options.set({
      gridSize: 100,
      clusterDisableClickZoom: true,
    });
    for (let i = 0; i < points.length; i++) {
      geoObjects[i] = new ymaps.Placemark(points[i]);
    }
    clusterer.add(geoObjects);
    myMap.geoObjects.add(clusterer);
    myMap.balloon.close();
  }
}

function addPlacemark() {
  myMap.events.add('click', function (e) {
    e.preventDefault();
    if (!myMap.balloon.isOpen()) {
      let coords = e.get('coords');
      points.push('coords');
      myMap.balloon.open(coords, {
        contentBody:
          '<div style = "height: 200px;">' +
          '<ul id = "review__list"></ul>' +
          '<h1>Отзыв</h1>' +
          '<ul style = "list-style-type: none;">' +
          '<li><input id = "myName" placeholder="Укажите Ваше имя"></li>' +
          '<li><input id = "place" placeholder="Укажите место"></li>' +
          '<li><textarea id = "review" style = "resize: none;" placeholder="Оставьте отзыв"></textarea>' +
          '<li><button id = "btn">Добавить</button></li>' +
          '</div>' +
          '<ul>',
      });

      // myMap.balloon.open(coords);
    } else {
      myMap.balloon.close();
    }
  });
}

// function newReview() {
//   myPlacemark.addEventListener('click', function () {
//     const reviewList = document.querySelector('#review__list');
//     const name = document.createElement('li');
//     name.innerHTML = 'текст';
//     const result = JSON.parse(storage.data || '{}');
//     myName.value = result.myName || '';
//     bday.value = result.bday || '';
//     about.value = result.about || '';

//     reviewList.appendChild(name);
//   });
// }
// myPlacemark = new ymaps.Placemark(coords);
// myMap.geoObjects.add(myPlacemark);
// document.body.addEventListener('input', stor);
// myPlacemark.events.add('click', function () {
//   // addPlacemark(myPlacemark);
//   if (!myMap.balloon.isOpen()) {
//     let coords = e.get('coords');
//     myPlacemark = new ymaps.Placemark(coords);
//     myMap.geoObjects.add(myPlacemark);
//     myMap.balloon.open(coords, {
//       contentHeader: 'Отзыв:',
//       contentBody:
//         '<div style = "height: 200px;">' +
//         '<div id = "review__list"></div>' +
//         '<input id = "myName" placeholder="Укажите Ваше имя">' +
//         '<input id = "place" placeholder="Укажите место">' +
//         '<textarea id = "review" style = "resize: none;" placeholder="Оставьте отзыв"></textarea>' +
//         '<button id = "btn">Добавить</button>' +
//         '</div>',
//     });
//   } else {
//     myMap.balloon.close();
//   }
// });
// const btn = document.querySelector('#btn');
// geoObjects = [];
// myPlacemark = [];

// myMap.events.add('click', function (e) {
//   let coords = e.get('coords');
//   myPlacemark = new ymaps.Placemark(coords);
//   myMap.geoObjects.add(myPlacemark);
// });

// myMap.geoObjects.add(myPlacemark);

// function createPlacemark(coords) {
//   return new ymaps.Placemark(coords, {
//     draggable: true,
//   });
// }
// let coords = e.get('coords');
// if (myPlacemark) {
//   myPlacemark.geometry.setCoordinates(coords);
// } else {
//   myPlacemark = createPlacemark(coords);
//   myMap.geoObjects.add(myPlacemark);
//   myPlacemark.events.add('dragend', function () {
//     getAddress(myPlacemark.geometry.getCoordinates());
//   });

// let myBalloonFooterBodyLayout = ymaps.templateLayoutFactory.createClass(
//   '<input id = "btn" type="button" value="Выбрать" class="baloon-button">',
//   {
//     build: function () {
//       const btn = document.querySelector('#btn');
//       myBalloonContentBodyLayout.superclass.build.call(this);
//       btn.events.add('click', function () {
//         console.log('Do something...');
//       });
//     },
//   }
// );
// let objectManager = new ymaps.ObjectManager({
//   contentFooterLayout: myBalloonFooterBodyLayout,
// });

// const baloonLayout = document.querySelector('.ymaps-2-1-79-balloon__layout');

// function stor() {
//   storage.data = JSON.stringify({
//     myName: myName.value,
//     place: place.value,
//     review: review.value,
//   });
// }

// let clusterer = new ymaps.Clusterer({
//   groupByCoordinates: false,
//   clusterDisableClickZoom: true,
//   clusterHideIconOnBalloonOpen: false,
//   geoObjectHideIconOnBalloonOpen: false,
//   clusterIconContentLayout: null,
// });
// clusterer.add(geoObjects);
// myMap.geoObjects.add(clusterer);

// myName.innerHTML = '';

// storage.data = JSON.stringify({
//   myName: myName.value,
//   place: place.value,
//   review: review.value,
// });

// if (e.target.id === 'btn') {
//   stor();
//   myMap.balloon.close();
// }

// objectManager = new ymaps.ObjectManager({
//   clusterize: true,
//   clusterDisableClickZoom: true,
// });

// let clusterer = new ymaps.Clusterer({
// clusterDisableClickZoom: true,
// clusterOpenBalloonOnClick: true,
// clusterIconContentLayout: null,
// groupByCoordinates: false,
// });
// objectManager.add(placemarks);
//   let clusterer = new ymaps.Clusterer({
//     clusterDisableClickZoom: true,
//     clusterOpenBalloonOnClick: true,
//     // clusterHideIconOnBalloonOpen: false,
//     // geoObjectHideIconOnBalloonOpen: false,
//   });
//   clusterer.options.set({
//     gridSize: 80,
//     clusterDisableClickZoom: true
// });
// clusterer.add(placemarks);
// myMap.geoObjects.add(clusterer);
// var result = ymaps.geoQuery(ymaps.geocode('Арбат')).applyBoundsToMap(myMap, {checkZoomRange: true});
// myMap.geoObjects.add(placemarks.clusterize());
// clusterer.add(geoObjects);
// myMap.geoObjects.add(objectManager);
// console.log(geoObjects);
