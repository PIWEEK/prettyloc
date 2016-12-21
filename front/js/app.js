flag = true;
newLine2 = {};
difficult = L.AwesomeMarkers.icon({
        icon: 'map-marker',
        markerColor: 'red'
      });
moderate = L.AwesomeMarkers.icon({
        icon: 'map-marker',
        markerColor: 'orange'
      });
easy = L.AwesomeMarkers.icon({
        icon: 'map-marker',
        markerColor: 'green'
      });

$(document).ready(function() {

    var outdoors = title('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw',
                         'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			             '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			             'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                         'mapbox.outdoors');

    var topomap = title('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                        'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
                        '<a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> ' +
                        '(<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                        '');

    var map = L.map('map', {
        center: [40.73784, -4.06569],
        zoom: 15,
        layers: [topomap]
    });



    var baseMaps = {
            "<span class='outdoors'>Outdoors</span>": outdoors,
            "<span class='topomap'>Topomap</span>": topomap
    };
    L.control.layers(baseMaps, null, {position: 'topright'}).addTo(map);

    var sidebar = L.control.sidebar('sidebar').addTo(map);

    $.getJSON( "js/data.json", function( data ) {
        data.results.forEach(function(path) {
            newPath(
                [path.start_point.coordinates[0],
                path.start_point.coordinates[1]],
                path.line,
                map,
                path.technical_difficulty
            );
            addDetail(path);
        });
    });


});

// choose map providers between: https://leaflet-extras.github.io/leaflet-providers/preview/
function title(url, attribution, id) {
	return L.tileLayer(url, {
		attribution: attribution,
		id: id
	});
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

function newPath(origin, path, map, difficulty) {
    var newLine;
    var difficulty_icon = easy;
    switch(difficulty) {
        case '1':
            difficulty_icon = easy;
            break;
        case '2':
            difficulty_icon = easy;
            break;
        case '3':
            difficulty_icon = moderate;
            break;
        case '4':
            difficulty_icon = moderate;
            break;
        case '5':
            difficulty_icon = difficult;
            break;
    }

    var marker = L.marker(origin, {icon: difficulty_icon})
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
