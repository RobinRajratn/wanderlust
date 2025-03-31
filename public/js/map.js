// FILE FOR USING MAPBOX MAPS


mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

// ADDING MARKER ON THE MAP
const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h6>${listing.location}</h6><p>Exact location will be provided after booking</p>`))
    .addTo(map);