import funcs from './home.js';
const main = document.querySelector('main');

const favoritesTemplate = (props) => {
  const template = `
  <article class="card d-flex flex-row favorite-card p-1 m-2 cards-background">
    <img src=${props.img} class="favorite-card-img">
    <div class="p-2 favorite-card-body bg-white ml-1">
      <h5 class="card-title text-truncate font-weight-bold font-regular-size mb-1">${props.title}</h5>
      <p class="card-text font-regular-size mb-1">${props.date} - ${props.hour}</p>
      <p class="card-text text-truncate font-regular-size m-0"><i class="fas fa-map-marker-alt icon-small-size"></i> ${props.local}</p>
      <div class="d-flex align-items-center flex-row justify-content-center mt-2" id=${props.id} onClick="favorites.handleClick(event,${funcs.moreInfo})">
        <i class="fas fa-plus icon-regular-size"></i>
        <p class="text-center mb-0 ml-1"> Saiba Mais</p>
      </div>
    </div>
</article>
    `;
  return template;
};

const getFavorites = () => {
  const user = firebase.auth().currentUser.uid;
  document.querySelector('.container-category').innerHTML = '';
  main.innerHTML = '';
  document.querySelectorAll('.arrow').forEach((arrow) => arrow.classList.add('hide'));

  firebase.firestore().collection('users')
    .where('user_uid', '==', user)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.data().id_save.forEach((ref) => {
          firebase.firestore().collection('events')
            .doc(ref)
            .get()
            .then((querySnapshot2) => {
              const docEvent = {
                ...querySnapshot2.data(),
                id: querySnapshot2.id,
              }
              main.innerHTML += favoritesTemplate(docEvent);
            });
        });
      });
    });
};

window.favorites = {
  handleClick: (event, callBack) => {
    callBack(event.currentTarget);
  },
};

export default getFavorites;
