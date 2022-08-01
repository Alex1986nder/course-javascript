import './index.html';
import './style.css';
import { templates } from './templates';

ymaps.ready(init);
let myMap, placemark, coords, clusterer;

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
        '<div id = "review__list"; style = "height: 100px; overflow: scroll;"></div>' +
        templates,
    });
  });

  clusterer = new ymaps.Clusterer({
    groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: false,
  });

  clusterer.events.add('click', (e) => {
    const coords = e.get('target').geometry.getCoordinates();
    myMap.balloon.open(coords, {
      content:
        `<div id = "review__list"; style = "height: 100px; overflow: scroll;">${getReviewList()}</div>` +
        templates,
    });
  });

  const storage = JSON.parse(localStorage.getItem('reviews')) || [];
  let arr = localStorage.getItem('reviews')
    ? JSON.parse(localStorage.getItem('reviews'))
    : [];

  renderPlacemark();

  function renderPlacemark() {
    storage.forEach((reviews) => {
      createPlacemark(reviews.coords);
    });
  }

  document.body.addEventListener('click', onClick);

  myMap.events.add('click', function (e) {
    return (coords = e.get('coords'));
  });

  function onClick(e) {
    if (e.target.id === 'btn') {
      const myName = document.querySelector('#myName');
      const place = document.querySelector('#place');
      const review = document.querySelector('#review');

      const newReview = {
        coords: coords,
        reviews: {
          name: myName.value,
          place: place.value,
          review: review.value,
        },
      };
      arr.push(newReview);
      localStorage.setItem('reviews', JSON.stringify(arr));
      // clusterer.removeAll();
      // myMap.geoObjects.remove(clusterer);
      createPlacemark(coords);
      // renderPlacemark();
      myMap.balloon.close();
    }
  }

  function getReviewList(coords) {
    let reviewList = '';
    for (const review of storage) {
      // if (JSON.stringify(review.coords) === JSON.stringify(coords)) {
      reviewList += `<div><b>${review.reviews.name}</b>[${review.reviews.place}]</div><div>${review.reviews.review}</div>`;
      // }
    }
    return reviewList;
  }

  function createPlacemark(coords, reviews) {
    placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();
      myMap.balloon.open(coords, {
        content:
          `<div id = "review__list"; style = "height: 100px; overflow: scroll;">${getReviewList()}</div>` +
          templates,
      });
    });
    clusterer.add(placemark);
    myMap.geoObjects.add(clusterer);
  }
}
