api_url = 'http://localhost:8008/api/routes/?';
//api_url = "http://prettyloc.es/api/routes/?";

flag = true;
newLine2 = {};

lastMarker = null;
lastBounding = null;

map = null;
markers = {};
routes = {};
routes_list = {};
markersLayer = null;
routesLayer = null;
fixedRoutes = [];
clusterLayer = null;

difficultValues = {
    '1': {
        name: 'fácil',
        color: 'green'
    },
    '2': {
        name: 'fácil',
        color: 'green'
    },
    '3': {
        name: 'moderada',
        color: 'orange'
    },
    '4': {
        name: 'moderada',
        color: 'orange'
    },
    '5': {
        name: 'difícil',
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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude));
        });
    }

    //map.on('click', function(e) {
    //        alert("Lat,Lon: " + e.latlng.lat + "," + e.latlng.lng)
    //});

    map.on('moveend', function(e) {
       var bounding = map.getBounds();
       if (lastBounding){
         if (
           (lastBounding._southWest.lat != bounding._southWest.lat)||
           (lastBounding._southWest.lng != bounding._southWest.lng)||
           (lastBounding._northEast.lat != bounding._northEast.lat)||
           (lastBounding._northEast.lng != bounding._northEast.lng)
         ){
           searchRoutes();
         }
       } else {
           searchRoutes();
      }
    });

    var baseMaps = {
            "<span class='outdoors'>Outdoors</span>": outdoors,
            "<span class='topomap'>Topomap</span>": topomap
    };
    L.control.layers(baseMaps, null, {position: 'topright'}).addTo(map);

    var sidebar = L.control.sidebar('sidebar').addTo(map);

    routesLayer = new L.FeatureGroup();
    map.addLayer(routesLayer);

    clusterLayer = L.markerClusterGroup({
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: true
    });
    map.addLayer(clusterLayer);

    initializeSearch();

    searchRoutes();


    $("#fixed-route-container").on('click',function (e) {
      var external_id = $("#fixed-route-container").data("external_id");
      if (external_id !== undefined){
        var marker = markers[external_id];
        var fixed = toogleFixedRoute(external_id, marker);
        if (fixed){
          $("#fixed-route-container").addClass("selected");
          if (lastMarker != null){
            lastMarker.fire('mouseout');
          }

          lastMarker = marker;
          //map.setView(marker.getLatLng());
          marker.fire('mouseover');
        } else {
          $("#fixed-route-container").removeClass("selected");
          marker.fire('mouseout');
        }
      }
    });

});

function searchRoutes(){
  // Clear old markers
  var oldClusterLayer = clusterLayer;
  if (oldClusterLayer != null){
    //Delete old markers one second from now, to avoid blink
    setTimeout(function(){map.removeLayer(oldClusterLayer)}, 2000);
  }
  markers = {};
  routes_list = {};
  lastIcon = null;
  lastMarker = null;

  clusterLayer = L.markerClusterGroup({
      showCoverageOnHover: false,
      removeOutsideVisibleBounds: true
  });
  map.addLayer(clusterLayer);

  $(".route-title").remove();

  var url = api_url;
  url +=  getUrlParamRouteLoop();
  url += getUrlParamRouteType();
  url += getUrlParamRouteMinDist();
  url += getUrlParamRouteMaxDist();
  url += getUrlParamRouteTechnicalDifficulty();
  url += getUrlParamUphill();
  url += getUrlParamBoundBox();

  $.getJSON(url, function( data ) {

      $("#search-count").text(data.results.length + " / " + data.count);

      data.results.forEach(function(path) {
          newPath(
              [path.start_point.coordinates[0],
              path.start_point.coordinates[1]],
              path.technical_difficulty,
              path.external_id,
              path.title,
              path.route_type,
              path.route_length,
              path.route_uphill,
              path.route_downhill,
              path.url,
              path.route_loop
          );
          addDetail(path);
      });
  });
}

function initializeSearch() {

  $("#filters-title").on('click',function (e) {
      $(".filter-search-container").slideToggle();
      $("#filters-title i").toggleClass("fa-caret-up");
      $("#filters-title i").toggleClass("fa-caret-down");
      return false;
  });


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

function line(data) {
	return L.geoJSON(data).addTo(routesLayer);
}

function newPath(origin, difficulty, external_id, title, route_type, route_length, route_uphill, route_downhill, urlDetail, route_loop) {
    var newLine;
    var iconMarker;

    if (fixedRoutes.indexOf(external_id) == -1){
      iconMarker = L.AwesomeMarkers.icon({
        icon: 'map-marker',
        markerColor: difficultValues[difficulty].color
      });
    } else {
     iconMarker = L.AwesomeMarkers.icon({
        icon: 'flag',
        markerColor: difficultValues[difficulty].color,
        prefix: 'fa',
        iconColor: 'white'
      });
    }

    var popupInfo = '<div class="popup_box">';
    popupInfo += '<div class="popup_head"><div class="path_type '+difficultValues[difficulty].color+'">'+ groupActivities(route_type) +'</div>';
    popupInfo += '<div><a target="_blank" href="https://www.wikiloc.com/wikiloc/view.do?id='+external_id+'">'+title+'</a></div></div>';
    popupInfo += '<div>';
    popupInfo += '<span class="info-item">'+route_length+'km&nbsp;</span>';
    popupInfo += '<span class="info-item"><i class="fa fa-arrow-circle-up" aria-hidden="true">&nbsp;</i>'+route_uphill+'m</span>';
    popupInfo += '<span class="info-item"><i class="fa fa-arrow-circle-down" aria-hidden="true">&nbsp;</i>'+route_downhill+'m</span>';
    var isLoop = "No";
    if (route_loop){
      isLoop = "Sí";
    }
    popupInfo += '<span class="info-item"><i class="fa fa-rotate-left" aria-hidden="true">&nbsp;</i>'+isLoop+'</span>';
    popupInfo += '</div>';
    popupInfo += '</div>';

    index = fixedRoutes.indexOf(external_id);
    var marker = L.marker(origin, {icon: iconMarker})
        .on('mouseover', function() {
          //if (index == -1 && flag){
            $.getJSON(urlDetail, function( path ) {
              marker
                  .closePopup()
                  .bindPopup(popupInfo)
                  .openPopup();
              newLine = line(path.line);
              addSinglePathDetail(path);
              routes[newLine._leaflet_id] = external_id;
            });
          //}
        })
        .on('mouseout', function(e){
            clearRoutes();
            marker.closePopup();
          if (index == -1 && flag){
            flag = true;
          }
        })
        .on('click', function(e){
            toogleFixedRoute(external_id, marker);
        })
        .addTo(clusterLayer);

    markers[external_id] = marker;
}

function clearRoutes(){
  routesLayer.eachLayer(function (layer) {
    index = fixedRoutes.indexOf(routes[layer._leaflet_id]);
    if (index == -1){
      routesLayer.removeLayer(layer);
    }
  });
}

function groupActivities(activity){
  if ((activity == 'hiking') || (activity == 'walking')  || (activity == 'nordic-walking')){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="15008.597" height="21333.334" viewBox="0 0 14.070559 20"><g transform="translate(-4.922 -2)"><circle r="2" cy="4" cx="13"/><path d="M10.9 6.4l2.6 2-1.3 4.6 1.7 2.3-.8 1.7-3.2-2.6c-.6-.5-.9-1.3-.7-2.1l1.7-5.9zM9.2 22l1.8-5-1.6-1.4L7.1 22M6.2 12.7c-.9-.3-1.5-1.3-1.2-2.2l.6-2c.6-1.8 2.6-2.8 4.4-2.3l-1.6 5.3c-.3 1-1.2 1.5-2.2 1.2z"/></g><path d="M13.07 4.912v15h1v-15h-1zM6.83 10.26l-1.52 1.302 2.382 2.777c.255.32.38.695.38 1.072v4.5h2v-4.5c0-.823-.278-1.647-.82-2.325l-.012-.013-2.41-2.813z" style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" color="#000" font-family="sans-serif" white-space="normal" overflow="visible" solid-color="#000000"/><path d="M6.09 4.382l-.587 1.912 1.325.408.027.006c.63.157 1.153.455 1.635.937l.8.8c.636.635 1.552.823 2.303.673l2.5-.5-.392-1.96-2.5.5c-.248.05-.33.037-.495-.128l-.8-.8c-.72-.717-1.594-1.22-2.566-1.462l.05.014-1.3-.4z" style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" color="#000" font-family="sans-serif" white-space="normal" overflow="visible" solid-color="#000000"/></svg>';
  }

  if ((activity == 'mountain-biking') || (activity == 'cyclocross') || (activity == 'cycling') || (activity == 'bicycle-touring')){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="21333.334" height="21333.334" viewBox="0 0 20 20"><path d="M13 2a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2zM16 10.6c1.3 0 2.4 1.1 2.4 2.4 0 1.3-1.1 2.4-2.4 2.4-1.3 0-2.4-1.1-2.4-2.4 0-1.3 1.1-2.4 2.4-2.4M16 9c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM4 13.6c1.3 0 2.4 1.1 2.4 2.4 0 1.3-1.1 2.4-2.4 2.4-1.3 0-2.4-1.1-2.4-2.4 0-1.3 1.1-2.4 2.4-2.4M4 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM9.6 12.1l-.1-1.8-3-1.3 2.7-3.3 3 .3-3.6-2.7c-.6-.5-1.4-.4-1.8.2-1 1.1-2.5 2.9-3.3 3.9-.9 1.1-.5 2.8.9 3.2l5.2 1.5zM.8 6.8C.1 6.3.1 5.3.6 4.6L1.9 3c1-1.2 2.7-1.4 3.9-.4l.2.2-3 3.8c-.6.7-1.5.8-2.2.2z"/><path d="M8.42 3.254L7.21 4.848l3.52 2.668 4.078.43.21-1.99-3.523-.37L8.42 3.254zM5.862 8.156l-.894 1.79L8.4 11.662l1.568 4.612 1.894-.645-1.832-5.39-4.168-2.084z" style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" color="#000" font-family="sans-serif" white-space="normal" overflow="visible" solid-color="#000000"/></svg>';
  }

  if ((activity == 'running') || (activity == 'trail-running')){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="21349.611" height="21333.337" viewBox="0 0 20.01526 20.000003"><g transform="translate(-173.23 -438.83)"><path d="M187.13 445.33l-3.6 2.9v4.3l-2.8-3.9c-.6-.8-.5-2 .3-2.7l4.5-3.8 1.7 1.2-.1 2z"/><circle cx="-12.178" cy="4.379" r="2" transform="translate(201.408 436.45)"/><path d="M177.43 457.73l1.7 1.1 3.9-4h-2.8M180.23 444.63l1.1-.8h-8.1v1h6.7c.1-.1.2-.1.3-.2zM178.73 447.83h-5.5v1h5.8c-.2-.3-.2-.7-.3-1zM179.13 445.83h-5.9v1h5.6c0-.4.2-.7.3-1z"/><path d="M183.354 447.255l-1.818.836 1.69 3.677c.003.01-.003-.007 0 0 .037.066.05.006.02.006H176.243v2h7c1.366 0 2.372-1.5 1.818-2.793l-.004-.014-1.706-3.71zM182.423 439.654c-.43-.09-.905-.093-1.395.07l.06-.017-4.103 1.1.52 1.933 4.128-1.11.028-.008c.218-.072.5-.01.858.204l3.826 2.847c.25.188.375.37.42.594v.002l.2 1.1.006.02c.298 1.344 1.507 2.383 2.974 2.383h3.3v-2h-3.3c-.532 0-.92-.36-1.02-.815-.002 0-.003 0-.003-.002l-.193-1.07-.002-.01c-.155-.777-.63-1.39-1.18-1.803v-.002l-3.943-2.93-.043-.026c-.318-.19-.706-.37-1.137-.46z" style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" color="#000" font-family="sans-serif" white-space="normal" overflow="visible" solid-color="#000000"/></g></svg>';
  }

  return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z"/></svg>';
}

function addDetail(data) {
    routes_list[data.external_id] = data;
    var route = $("<div>");

    route.addClass("route-title");
    route.data("external_id", data.external_id);


    var name = $("<div>")
    name.addClass("route-name");
    var activity = $('<span title="' + data.route_type + '"></span>');
    activity.addClass("path_type");
    activity.addClass(difficultValues[data.technical_difficulty].color);
    activity.html(groupActivities(data.route_type));

    name.append(activity);
    name.append($("<span class='title'>"+data.title+"</span>"));
    route.append(name);

    var info = $("<div>")
    info.addClass("route-info");

    var route_length = $("<span>")
    route_length.addClass("info-item")
    route_length.text(data.route_length+"km");

    var route_uphill = $("<span title='Elevación del terreno'>")
    route_uphill.addClass("info-item")
    var arrow_up = $('<i class="fa fa-arrow-circle-up" aria-hidden="true">&nbsp;</i>');
    route_uphill.append(arrow_up);
    route_uphill.append($("<span>"+data.route_uphill+"m</span>"));

    var route_downhill = $("<span title='Descenso del terreno'>")
    route_downhill.addClass("info-item")
    var arrow_down = $('<i class="fa fa-arrow-circle-down" aria-hidden="true">&nbsp;</i>');
    route_downhill.append(arrow_down);
    route_downhill.append($("<span>"+data.route_downhill+"m</span>"));

    var isLoop = "No";
    if (data.route_loop){
      isLoop = "Yes";
    }

    var loop_text = isLoop ? 'Sí' : 'No';
    var route_loop = $('<span class="info-item"><i class="fa fa-rotate-left" aria-hidden="true">&nbsp;</i>'+ loop_text +'</span>');

    info.append(route_length);
    info.append(route_uphill);
    info.append(route_downhill);
    info.append(route_loop);
    route.append(info);

    route.on('mouseover',function (e) {
      $(".route-title").removeClass("selected");
      current = $(e.target).parents(".route-title");
      current.addClass("selected");

      var marker = markers[data.external_id];

      if (lastMarker != null){
        lastMarker.fire('mouseout');
      }

      lastMarker = marker;
      //map.setView(marker.getLatLng());
      marker.fire('mouseover');
    });

    route.on('mouseout',function (e) {
      var marker = markers[data.external_id];
      clearRoutes();
      marker.closePopup();
    });

    route.on('click',function (e) {
      $("#a-route-detail i").click();
    });

    $('#sidebar').find('#search-results').append(route);
}

function addSinglePathDetail(data) {

    $('#sidebar')
        .find('#route-detail')
        .find('h2')
        .html(data.title);
    $('#sidebar')
        .find('#route-detail')
        .find('.path_type')
        .addClass(difficultValues[data.technical_difficulty].color)
        .html(groupActivities(data.route_type));
    $('#sidebar')
        .find('#route-detail')
        .find('.path_type_text')
        .html('Tipo de ruta: '+ data.route_type);
    $('#sidebar')
        .find('#route-detail')
        .find('.path_difficulty')
        .html('Dificultad técnica: ' + difficultValues[data.technical_difficulty].name);



    var route_uphill = $("<span title='Elevación del terreno'>")
    route_uphill.addClass("info-item")
    var arrow_up = $('<i class="fa fa-arrow-circle-up" aria-hidden="true">&nbsp;</i>');
    route_uphill.append(arrow_up);
    route_uphill.append($("<span>"+data.route_uphill+"m</span>"));

    var route_downhill = $("<span title='Descenso del terreno'>")
    route_downhill.addClass("info-item")
    var arrow_down = $('<i class="fa fa-arrow-circle-down" aria-hidden="true">&nbsp;</i>');
    route_downhill.append(arrow_down);
    route_downhill.append($("<span>"+data.route_downhill+"m</span>"));

    var isLoop = "No";
    if (data.route_loop){
      isLoop = "Sí";
    }
    var route_loop = '<span class="info-item"><i class="fa fa-rotate-left" aria-hidden="true">&nbsp;</i>'+isLoop+'</span>';

    $('#sidebar')
        .find('#route-detail')
        .find('.path_size')
        .empty()
        .append('<span title="distancia" class="info-item">'+data.route_length+'km</span>')
        .append(route_uphill)
        .append(route_downhill)
        .append(route_loop);
    if (data.time) {
      $('#sidebar')
          .find('#route-detail')
          .find('.path_time')
          .html(data.time);
    }
    $('#sidebar')
        .find('#route-detail')
        .find('.last_update')
        .html('Última actualización: '+data.upload_date);

    for (var i=0;i<(data.stars-1);i++) {
        $('#sidebar')
            .find('#route-detail')
            .find('.path_stars')
            .find('.star:nth('+i+')')
            .addClass('star3');
    }


    index = fixedRoutes.indexOf(data.external_id);
    $("#fixed-route-container").data("external_id", data.external_id);
    if (index == -1){
      $("#fixed-route-container").removeClass("selected");
    } else{
      $("#fixed-route-container").addClass("selected");
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

function getUrlParamBoundBox(){
  lastBounding = map.getBounds();
  return "in_bbox="+lastBounding._southWest.lat+","+lastBounding._southWest.lng+","+lastBounding._northEast.lat+","+lastBounding._northEast.lng+"&";
}

function toogleFixedRoute(external_id, marker){
  index = fixedRoutes.indexOf(external_id);
  if (index == -1){
    fixedRoutes.push(external_id);
    marker.setIcon(L.AwesomeMarkers.icon({
      icon: 'flag',
      markerColor: marker.options.icon.options.markerColor,
      prefix: 'fa',
      iconColor: 'white'
    }));
    return true;
  } else {
    fixedRoutes.splice(index, 1);
    marker.setIcon(L.AwesomeMarkers.icon({
        icon: 'map-marker',
        markerColor: marker.options.icon.options.markerColor,
      }));
    clearRoutes();
    flag = false;
    return false;
  }
}
