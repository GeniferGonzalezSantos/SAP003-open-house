import Card from '../components/main-card.js';
import templateCategory from '../components/event-categories.js';
import Select from '../components/input.js';

const hammer = new Hammer(document.querySelector('main'));
let index = 0;
let tamanho = 0;

const moreInfo = (target) => {
  window.location.hash = target.id;
};

const select = (id) => {
  window.location.hash = id;
};

const showEvents = (array) => {
  const main = document.querySelector('main');
  document.querySelector('.container-category').innerHTML = `
    ${Select(select)}
    ${templateCategory({ src: 'img/tickets.png', title: 'Todos' })}
    ${templateCategory({ src: 'img/karaoke.png', title: 'Show' })}
    ${templateCategory({ src: 'img/theater.png', title: 'Teatro' })}
    ${templateCategory({ src: 'img/popcorn.png', title: 'Cinema' })}
    ${templateCategory({ src: 'img/stretching-exercises.png', title: 'Esporte' })}
    ${templateCategory({ src: 'img/museum.png', title: 'Arte' })}
    `;

  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    const userUid = currentUser.uid;
    firebase.firestore().collection('users').where('user_uid', '==', userUid)
      .get()
      .then((query) => {
        query.forEach((user) => {
          main.innerHTML = Card(array[index], funcs);
          const arraySalvos = user.data().id_save;
          if (arraySalvos.includes(array[index].id)) {
            const bookmark = document.querySelector('.save');
            bookmark.classList.add('fas');
            bookmark.classList.remove('far');
          }
        });
      });
  } else {
    main.innerHTML = Card(array[index], funcs);
  }
}

let arrayEvents = [];
const getEvents = () => {
  document.querySelectorAll('.arrow').forEach((arrow) => arrow.classList.remove('hide'));
  firebase.firestore().collection('events').orderBy('date')
    .get()
    .then((querySnapshot) => {
      arrayEvents = [];
      querySnapshot.forEach((doc) => {
        const docEvent = {
          ...doc.data(),
          id: doc.id,
          position: index,
        };
        arrayEvents.push(docEvent);
        tamanho = arrayEvents.length;
      });
      showEvents(arrayEvents);
    });
};

const save = (bookmark) => {
  bookmark.classList.add('animated', 'tada');
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    const user = currentUser.uid;
    if (bookmark.classList.contains('far')) {
      bookmark.classList.add('fas');
      bookmark.classList.remove('far');
      document.querySelector('.save').classList.add('animated', 'tada');
      firebase.firestore().collection('users')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (user === doc.data().user_uid) {
              firebase.firestore().collection('users').doc(doc.id)
                .update({
                  id_save: firebase.firestore.FieldValue.arrayUnion(id),
                });
            }
          });
        });
    } else {
      bookmark.classList.add('far');
      bookmark.classList.remove('fas');
      firebase.firestore().collection('users')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (user === doc.data().user_uid) {
              firebase.firestore().collection('users').doc(doc.id)
                .update({
                  id_save: firebase.firestore.FieldValue.arrayRemove(id),
                });
            }
          });
        });
    }
  } else {
    $('#small-modal').modal('show');
  }
};

let arrayfilter = [];

const getCategory = (parameter, hash) => {
  const category = hash.replace(/\#(.*?)\-/, '')
  document.querySelector('main').innerHTML = '';

  firebase.firestore().collection('events')
    .where(parameter, 'array-contains', category)
    .orderBy('date')
    .get()
    .then((querySnapshot) => {
      arrayfilter = [];
      querySnapshot.forEach((doc) => {
        const docEvent = {
          ...doc.data(),
          id: doc.id,
          position: index,
        };
        arrayfilter.push(docEvent);
        tamanho = arrayfilter.length;
      });
      index = 0;
      showEvents(arrayfilter);
    })
};

const swipeRight = () => {
  (index === tamanho - 1) ? index = 0 : index += 1;
  const card = document.querySelector('article');
  card.className = 'card card-size p-1 cards-background swiping-right';
  if (window.location.hash === '') {
    card.addEventListener('animationend', () => { showEvents(arrayEvents) });
  } else {
    card.addEventListener('animationend', () => { showEvents(arrayfilter) });
  }
};

const swipeLeft = () => {
  (index === 0) ? index = tamanho - 1 : index -= 1;
  const card = document.querySelector('article');
  card.className = 'card card-size p-1 cards-background swiping-left';
  if (window.location.hash === '') {
    card.addEventListener('animationend', () => { showEvents(arrayEvents) });
  } else {
    card.addEventListener('animationend', () => { showEvents(arrayfilter) });
  }
};

const funcs = {
  swipeLeft,
  swipeRight,
  moreInfo,
  select,
  getEvents,
  save,
  getCategory,
};

hammer.on('swiperight', swipeRight);
hammer.on('swipeleft', swipeLeft);
document.querySelector('.fa-angle-left').addEventListener('click', swipeLeft);
document.querySelector('.fa-angle-right').addEventListener('click', swipeRight);

export default funcs;
