const geoData=  JSON.parse(geo).coordinates;
//console.log(geoData);
const camp = JSON.parse(geo).title;
const loc = JSON.parse(geo).location;
mapboxgl.accessToken = mapToken;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11', // stylesheet location
    center: geoData, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

var marker = new mapboxgl.Marker()
    .setLngLat(geoData)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(`<h6>${camp}</h6><p>${loc}</p>`)
    )
    .addTo(map);

