flag = true;
newLine2 = {};

$(document).ready(function() {
    var map = L.map('map').setView([40.73784, -4.06569], 15);
    title(map);

    var sidebar = L.control.sidebar('sidebar').addTo(map);

    $.getJSON( "js/data.json", function( data ) {
        data.results.forEach(function(path) {
            newPath(
                [path.start_point.coordinates[0], 
                path.start_point.coordinates[1]], 
                path.line, 
                map
            );
            addDetail(path);
        });
    });


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

function toggleLine(routes, map) {
    var popup = '';

    if (flag) {
        popup = $('<a class="popup_link">show route</a>').click(function(e) {
            newLine2 = line(routes, map);
            flag = false;
        })[0];
    } else {
        popup = $('<a class="popup_link">hide route</a>').click(function(e) {
            map.removeLayer(newLine2);
            flag = true;
        })[0];       
    }

    return popup;
}

function newPath(origin, path, map) {
    var newLine;

    var marker = L.marker(origin)
        .on('mouseover', function() {
            if (flag) {
                newLine = line(path, map);
            }
            marker
                .closePopup()
                .bindPopup(toggleLine(path, map))
                .openPopup();
        })
        .on('mouseout', function(e){
            if (flag) {
                map.removeLayer(newLine);
            }
        })
        .addTo(map);

    $('#map').on('click', '.popup_link',function() {
        if (marker._popup) {
            marker._popup.setContent(toggleLine(path, map));
        }
    });
}

function addDetail(data) {
    $('#sidebar').find('#route-detail').append('<p>'+data.title+'</p>');
}
