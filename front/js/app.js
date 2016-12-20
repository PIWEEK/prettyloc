$(document).ready(function() {

	var map = L.map('map').setView([39.74739, -105], 15);
	title(map);

    //icon('./assets/baseball-marker.png', [32, 37], [16, 37], [0, -28], map);

    
    var marker = marker([39.74739, -105], map);

    marker.on('mouseover', function() {
        console.log('hola');
        line(routes, map);
    });

/*	L.geoJSON([bicycleRental, campus], {

		style: function (feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature: onEachFeature,

		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: "#ff7800",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		}
	}).addTo(map);*/

    



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

function icon(url, size, anchor, popup, map) {
    var iconData = L.icon({
		iconUrl: url,
		iconSize: size,
		iconAnchor: anchor,
		popupAnchor: popup
	});

	var coorsLayer = L.geoJSON(coorsField, {

		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {icon: iconData});
		},

		onEachFeature: onEachFeature
	}).addTo(map);
}

function line(data, map) {
	L.geoJSON(data, {

/*		filter: function (feature, layer) {
			if (feature.properties) {
				// If the property "underConstruction" exists and is true, return false (don't render features under construction)
				return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
			}
			return false;
		},

		onEachFeature: onEachFeature*/
	}).addTo(map);
}

function area(map) {

}

function circle(map) {

}

function marker(lnglat, map) {
    console.log(lnglat, 'log');
    L.marker(lnglat).addTo(map);
}

function onEachFeature(feature, layer) {
    var popupContent = "<p>I started out as a GeoJSON " +
            feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

    layer.bindPopup(popupContent);
}