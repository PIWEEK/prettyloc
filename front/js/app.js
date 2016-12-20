$(document).ready(function() {

    var denver = [39.75383843460583, -105.00341892242432];
	var map = L.map('map').setView(denver, 15);
	title(map);
    var sidebar = L.control.sidebar('sidebar').addTo(map);

    var line1;

    L.marker(denver)
        .on('mouseover', function() {
            line1 = line(routes, map);
        })
        .on('mouseout', function(){
            map.removeLayer(line1);
        })
        .bindPopup('<a onclick="hideLine('+ this +','+ map +')">ocultar ruta</a>').openPopup()
        .addTo(map);

});

// choose map providers between: https://leaflet-extras.github.io/leaflet-providers/preview/
function title(map) {
	return L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	}).addTo(map);
}

function line(data, map) {
	return L.geoJSON(data).addTo(map);
}

function hideLine(line, map) {
    map.removeLayer(line);
}
