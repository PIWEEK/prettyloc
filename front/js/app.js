$(document).ready(function() {

	var map = L.map('map').setView([39.74739, -105], 15);
	title(map);

    var line1;

    L.marker([39.75383843460583, -105.00341892242432])
        .on('click', function() {
            line1 = line(routes, map);
        })
        .bindPopup('<a onclick="hideLine('+ this +','+ map +')">ocultar ruta</a>').openPopup()
        .addTo(map);

});

function title(map) {
	return L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.light'
	}).addTo(map);
}

function line(data, map) {
	return L.geoJSON(data).addTo(map);
}

function hideLine(line, map) {
    map.removeLayer(line);
}