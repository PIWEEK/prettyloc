flag = true;
newLine2 = {};

selectedIcon = L.AwesomeMarkers.icon({
  icon: 'map-marker',
  markerColor: 'blue'
});

lastIcon = null;
lastMarker = null;

map = null;
markers = {};
markersLayer = null;
difficultValues = {
    '1': {
        name: 'easy',
        color: 'green'
    },
    '2': {
        name: 'easy',
        color: 'green'
    },
    '3': {
        name: 'moderate',
        color: 'orange'
    },
    '4': {
        name: 'moderate',
        color: 'orange'
    },
    '5': {
        name: 'difficult',
        color: 'red'
    }
};

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

    map = L.map('map', {
        center: [40.73784, -4.06569],
        zoom: 15,
        layers: [outdoors]
    });

    //map.on('click', function(e) {
    //        alert("Lat,Lon: " + e.latlng.lat + "," + e.latlng.lng)
    //});

    var baseMaps = {
            "<span class='outdoors'>Outdoors</span>": outdoors,
            "<span class='topomap'>Topomap</span>": topomap
    };
    L.control.layers(baseMaps, null, {position: 'topright'}).addTo(map);

    var sidebar = L.control.sidebar('sidebar').addTo(map);





    initializeSearch(map);

    searchRoutes();

});

function searchRoutes(){
  // Clear old markers
  if (markersLayer != null){
    map.removeLayer(markersLayer);
  }
  markers = {};
  lastIcon = null;
  lastMarker = null;

  markersLayer = new L.FeatureGroup();
  map.addLayer(markersLayer);

  $(".route-title").remove();





  var url = "http://localhost:8000/routes?"
  url +=  getUrlParamRouteLoop();
  url += getUrlParamRouteType();
  url += getUrlParamRouteMinDist();
  url += getUrlParamRouteMaxDist();
  url += getUrlParamRouteTechnicalDifficulty();
  url += getUrlParamUphill();

  $.getJSON(url, function( data ) {
      data.forEach(function(path) {
          newPath(
              [path.start_point.coordinates[0],
              path.start_point.coordinates[1]],
              path.line,
              map,
              path.technical_difficulty,
              path.external_id
          );
          addDetail(path);
      });
  });
}

function initializeSearch(map) {
  var geoSearch = new L.Control.GeoSearch({
      provider: new L.GeoSearch.Provider.OpenStreetMap(),
      position: 'bottomright',
      showMarker: false,
  }).addTo(map);

  $('#search-text').on('keypress',function (e) {
    if (e.which == 13) {
      geoSearch.geosearch($('#search-text').val());
      return false;
    }
  });

  $('#search-text-icon').on('click',function (e) {
      geoSearch.geosearch($('#search-text').val());
      return false;
  });

  $('.activity-search').on('click',function (e) {
    $('.activity-search').removeClass("selected");
    $(e.currentTarget).addClass("selected");

  });






  $( function() {
    $( "#distance-search-slider-range" ).slider({
      range: true,
      min: 0,
      max: 100,
      values: [ 0, 100 ],
      slide: function( event, ui ) {
        $("#distance-search-min").text(ui.values[0]+"km");
        $("#distance-search-max").text(ui.values[1]+"km");
      },
      stop: function( event, ui ) {
        searchRoutes();
      }
    });
  } );

  $( function() {
    $( "#difficulty-search-slider-range" ).slider({
      range: true,
      min: 1,
      max: 5,
      values: [ 1, 5 ],
      slide: function( event, ui ) {
        $("#difficulty-search-min").text(ui.values[0]);
        $("#difficulty-search-max").text(ui.values[1]);
      },
      stop: function( event, ui ) {
        searchRoutes();
      }
    });
  } );

  $( function() {
    $( "#uphill-search-slider-range" ).slider({
      range: true,
      min: 0,
      max: 5000,
      values: [ 0, 5000 ],
      slide: function( event, ui ) {
        $("#uphill-search-min").text(ui.values[0]+"m");
        $("#uphill-search-max").text(ui.values[1]+"m");
      },
      stop: function( event, ui ) {
        searchRoutes();
      }
    });
  } );


  $(".research").on('click',function (e) {
    searchRoutes();
  });

}

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

function newPath(origin, path, map, difficulty, external_id) {
    var newLine;

    var iconMarker = L.AwesomeMarkers.icon({
        icon: 'map-marker',
        markerColor: difficultValues[difficulty].color
      });

    var marker = L.marker(origin, {icon: iconMarker})
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
        .addTo(markersLayer);

    markers[external_id] = marker;

    $('#map').on('click', '.popup_link',function() {
        if (marker._popup) {
            marker._popup.setContent(toggleLine(path, map));
        }
    });
}

function groupActivities(activity){
  if ((activity == 'hiking') || (activity == 'walking')  || (activity == 'nordic-walking')){
    return 'hiking';
  }

  if ((activity == 'mountain-biking') || (activity == 'cyclocross') || (activity == 'cycling') || (activity == 'bicycle-touring')){
    return 'mountain-biking';
  }

  if ((activity == 'running') || (activity == 'trail-running')){
    return 'running';
  }

  return 'other';
}

function addDetail(data) {
    var route = $("<div>");

    route.addClass("route-title");
    route.data("external_id", data.external_id);


    var name = $("<div>")
    name.addClass("route-name");
    var activity = $('<span title="' + data.route_type + '"></span>');
    activity.addClass("path_type");
    activity.addClass(groupActivities(data.route_type));


    name.append($("<span>"+data.title+"</span>"));
    name.append(activity);
    route.append(name);

    var info = $("<div>")
    info.addClass("route-info");

    var route_length = $("<span>")
    route_length.addClass("info-item")
    route_length.text(data.route_length+"km");

    var route_uphill = $("<span title='Elevation gain uphill'>")
    route_uphill.addClass("info-item")
    var arrow_up = $('<i class="fa fa-arrow-circle-up" aria-hidden="true">&nbsp;</i>');
    route_uphill.append(arrow_up);
    route_uphill.append($("<span>"+data.route_uphill+"m</span>"));

    var route_downhill = $("<span title='Elevation gain downhill'>")
    route_downhill.addClass("info-item")
    var arrow_down = $('<i class="fa fa-arrow-circle-down" aria-hidden="true">&nbsp;</i>');
    route_downhill.append(arrow_down);
    route_downhill.append($("<span>"+data.route_downhill+"m</span>"));

    info.append($("<span title='Difficulty "+data.technical_difficulty+"' class='info-item difficulty"+data.technical_difficulty+"'>&nbsp;</span>"));
    info.append(route_length);
    info.append(route_uphill);
    info.append(route_downhill);
    route.append(info);




    route.on('mouseover',function (e) {
      $(".route-title").removeClass("selected");
      current = $(e.target).parents(".route-title");
      current.addClass("selected");

      var marker = markers[data.external_id];

      if (lastMarker != null){
        lastMarker.setIcon(lastIcon);
        lastMarker.fire('mouseout');
      }
      lastIcon = marker.options.icon;
      lastMarker = marker;
      map.setView(marker.getLatLng());
      marker.setIcon(selectedIcon)
      marker.fire('mouseover');
    });



    $('#sidebar').find('#search-results').append(route);

    $('#sidebar')
        .find('#route-detail')
        .find('h2')
        .html(data.title);
    $('#sidebar')
        .find('#route-detail')
        .find('.path_type')
        .addClass(data.route_type);
    $('#sidebar')
        .find('#route-detail')
        .find('.path_difficulty')
        .html('Technical difficulty: ' + difficultValues[data.technical_difficulty].name);
    $('#sidebar')
        .find('#route-detail')
        .find('.path_size')
        .html('Lenght: ' + data.route_length + ' / '+ 'Height: ' + data.route_height);
    $('#sidebar')
        .find('#route-detail')
        .find('.path_time')
        .html(data.time);

    for (var i=0;i<(data.stars-1);i++) {
        $('#sidebar')
            .find('#route-detail')
            .find('.path_stars')
            .find('.star:nth('+i+')')
            .addClass('star3');
    }
}
var debug;

function getUrlParamRouteLoop(){
  if ($("#loop-search")[0].checked) {
    return "route_loop=2&"
  }
  return "route_loop=1&";
}
function getUrlParamRouteType(){
   if ($("#activity-hiking").hasClass("selected")){
    return "route_type=hiking&route_type=walking&route_type=nordic-walking&";
  } else if ($("#activity-running").hasClass("selected")){
    return "route_type=running&route_type=trail-running&";
  } else if ($("#activity-mountain-biking").hasClass("selected")){
    return "route_type=mountain-biking&route_type=cyclocross&route_type=cycling&route_type=bicycle-touring&";
  } else if ($("#activity-other").hasClass("selected")){
    return "route_type=other&";
  }

  return "";
}
function getUrlParamRouteMinDist(){
  var str = $("#distance-search-min").text();
  return "min_dist="+str.substring(0, str.length - 2)+"&";
}
function getUrlParamRouteMaxDist(){
  var str = $("#distance-search-max").text();
  return "max_dist="+str.substring(0, str.length - 2)+"&";
}
function getUrlParamRouteTechnicalDifficulty(){
  var diffMin = parseInt($("#difficulty-search-min").text(), 10);
  var diffMax = parseInt($("#difficulty-search-max").text(), 10);
  var str = "";
  for (var i=diffMin;i<=diffMax;i++){
    str += "technical_difficulty="+i+"&";
  }
  return str;
}

function getUrlParamUphill(){
  var strMin = $("#uphill-search-min").text();
  var strMax = $("#uphill-search-max").text();
  str = "min_route_uphill="+strMin.substring(0, strMin.length - 1)+"&";
  str += "max_route_uphill="+strMax.substring(0, strMax.length - 1)+"&";
  return str;
}
