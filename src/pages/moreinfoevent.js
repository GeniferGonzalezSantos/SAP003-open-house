const moreInfoTemplate = (props) => {
  const template = `
  <article class="card mb-3 cards-background p-1 more-info card-desktop">
    <img src=${props.img} class="moreinfo-card mb-1 img-desktop img-desktop" alt="...">
    <div class="d-flex flex-column height-div">  
      <div class="card-body bg-white infos-desktop">
        <h5 class="card-title text-truncate font-regular-size big-title"><span class="font-weight-bold">${props.title}</span> ${props.date} - ${props.hour}</h5>
        <p class="font-regular-size"><span class="font-weight-bold">Descrição: </span>${props.description}</p>
        <p class="card-text text-truncate font-regular-size m-0"><i class="fas fa-map-marker-alt icon-small-size"></i> ${props.local}</p>
      </div>
      <div class="mt-1 map-desktop map-container"></div>
    </div>
  </article>
  `;
  return template;
};

const getMoreEvent = (id) => {
  const main = document.querySelector('main');
  const noHashId = id.replace(/#/, '');
  document.querySelector('.container-category').innerHTML = '';
  document.querySelectorAll('.arrow').forEach((arrow) => arrow.classList.add('hide'));

  firebase.firestore().collection('events').doc(noHashId).get()
    .then((doc) => {
      main.innerHTML = moreInfoTemplate(doc.data());
      getMap(doc.data().location);
    });
};

const getMap = (searchText) => {
  let platform = new H.service.Platform({
    apikey: 'O9FC31KMgVFrvFFFc5QIMm2GWYnXeCpHXjRox3A0ENs',
  });

  let maptypes = platform.createDefaultLayers();

  let map = new H.Map(
    document.querySelector('.map-container'),
    maptypes.vector.normal.map,
    {
      zoom: 15,
    },
  );

  const geocodingParams = {
    searchText,
  };

  const onResult = (result) => {
    const locations = result.Response.View[0].Result;
    let position;
    let marker;
    // Add a marker for each location found
    for (let i = 0; i < locations.length; i++) {
      position = {
        lat: locations[i].Location.DisplayPosition.Latitude,
        lng: locations[i].Location.DisplayPosition.Longitude,
      };

      map.setCenter(position);
      marker = new H.map.Marker(position);
      map.addObject(marker);
    }
  };

  const geocoder = platform.getGeocodingService();
  geocoder.geocode(geocodingParams, onResult);
};

export default getMoreEvent;
