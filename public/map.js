  // Initialize map (center Pakistan)
 document.addEventListener('DOMContentLoaded',()=>{
    const map = L.map('map').setView([listingCoordinates.lat, listingCoordinates.lon], 6);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  //Color of marker
  const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

  // Add markers dynamically
    L.marker([listingCoordinates.lat, listingCoordinates.lon],{icon:redIcon})
      .addTo(map)
      .bindPopup(`<b>${listingCoordinates.title}</b><br><h5>Exact Location will be given after Booking</h5>`);
  });