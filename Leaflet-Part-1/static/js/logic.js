console.log('test')
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Create a map object.
var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
  });

// Define arrays to hold the created magnitude markers.
let magnitudeMarkers = [];

// Loop through data
d3.json(queryUrl,function(data) {

    //console.log(response);
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
      // set different color from magnitude
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
        return "#ea2c2c";
    case magnitude > 4:
        return "#ea822c";
    case magnitude > 3:
        return "#ee9c00";
    case magnitude > 2:
        return "#eecc00";
    case magnitude > 1:
        return "#d4ee00";
    default:
        return "#98ee00";
    }
    }
    // set radiuss from magnitude
    function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }

    return magnitude * 4;
    }

    L.geoJson(data, {
        // Maken cricles
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        // cirecle style
        style: styleInfo,
        // popup for each marker
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
      }).addTo(myMap);
  
  });
  

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create two separate layer groups: one for the city markers and another for the state markers.
let magnitude = L.layerGroup(magnitudeMarkers);
let tectonicPlates = L.layerGroup(magnitudeMarkers);

// Create a baseMaps object.
let baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};

// Create an overlay object.
let overlayMaps = {
  "Earth quake magnitude": magnitude,
  "tectonic plates": tectonicPlates
};

// Pass our map layers to our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
