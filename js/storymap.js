//Don't change. Creates the fadeOut function, which control how fast or slow the story take to fade and disappear.
function fadeOut(element) {
    //Don't change. It takes the element opacity attribute, it sets the opacity level ('op') of the element to itself, and reduces it by 0.05. After a delay of 4 millisecond, it loops the function again. If op is below 0, it escape the interval loop with clearInterval
    var op = element.style.opacity;
    var timer = setInterval(function () {
        if (op <= 0){
            clearInterval(timer);
        }
        element.style.opacity = op;
        op -= 0.05; //Change if needed. This determines by how much to reduce the op every iteration.
    }, 4);//Change if needed. This is the delay, the interval in milliseconds between iterations. setInterval is structured in a form setInterval(code, delay).
}

//Don't change. See above for a description of how fadeIn works
function fadeIn(element) {
    var op = 0;  //Change if needed. Start opacity when fading in
    var timer = setInterval(function () {
        if (op >= storyOpacity){ //Don't change. storyOpacity is set in test.html
            clearInterval(timer);
        }
        element.style.opacity = op;
        op += 0.04; //Change if needed. This determines by how much to increase the op every iteration.
    }, 20); //Change if needed. This is the delay, the interval in milliseconds between iterations.
}

function changeStory(position, title, id, content, elementzoom) {
	map.flyTo(position,elementzoom,{ // Pan map to new position, at the elementzoom level of zoom. Notice that they call the function arguments.
		animate:false, //Change if needed. If true, the map zoom out and then in, but the geojson renders poorly as it does not re-renders fast enough at each zoom level.
		duration:panTime //Change if needed. The time the animation takes, set using the variable panTime (check test.html)
	}),
	setTimeout(function() {
		document.getElementById(id).innerHTML = content
		fadeIn(document.getElementById(id))
	}, 100);
}

//Change if needed. You can create here different baseMaps, and give them names. Later, you can call them using the baseMap variable in test.html. For additional maps, check https://leaflet-extras.github.io/leaflet-providers/preview/
if (baseMap=="osm") {
	var mapType = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { // This is the background map
	 attribution: 'Open Street Map'
	});
}
if (baseMap=="toner") {
	var mapType = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ext: 'png'
});
}
if (baseMap=="carto_db_voyager") {
    var mapType = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd'
});
}

var positions = L.layerGroup([]); //Don't change This group layer holds dynamically created markers. It is created empty.

//Don't change. It creates the map and sets the centre and the starting zoom level. Notice that they are variables defined in test.html
var map = L.map('map', {
 center: startCoordinate,
 zoom: startZoom,
 layers: [mapType, positions], //Don't change.by default add the positions layers and the mapType, which are defined above
 keyboard: false, //Don't change. If false, you cannot control the map with the keyboards' arrows, which free them up to be associated with other map functions.
});

L.control.scale({imperial:false, maxWidth:300}).addTo(map); //Don't change. Simple scale bar

var osm2 = new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {minZoom: 0, maxZoom: 13, attribution: 'Open Street Map' }); //Change if needed. Basemap for the overview map
var rect1 = {color: "#ff1100", weight: 3}; //Change if needed. Style of the rectangle fill in the overlay map
var rect2 = {color: "#0000AA", weight: 1, opacity:0, fillOpacity:0}; //Change if needed. Style of the rectangle border in the overlay map
var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true, aimingRectOptions : rect1, shadowRectOptions: rect2, position: 'bottomleft'}).addTo(map); //Change if needed. Adds the overlay map in a specific position, enable the option to collapse or expand it. Check https://github.com/Norkart/Leaflet-MiniMap for more info

//Don't change. Gets a series of information on the style of different element and store them in variables for later. The Document method getElementById() returns an Element object representing the element whose id property matches the specified string.
document.getElementById('title').style.opacity = titleOpacity;
document.getElementById('story').style.opacity = storyOpacity;
document.getElementById('title').style.color = titleTextColor;
document.getElementById('title').style.background = titleBackground;
document.getElementById('story').style.color = storyTextColor;
document.getElementById('story').style.background = storyBackground;
document.getElementById('story').style.backgroundImage = backgroundImage;

//Don't change. Calls the element map, and gets the zoom level.
var currentZoom = map.getZoom();
//Change if needed. Markers do not change size with the zoom level. Ideally, you would want 22 different styles (one per zoom level), and ensure that the marker is change on zoomend. Here we have created 3 (small, normal, and large) to be used at different zoom levels.
var bronteIcon_large = L.icon({
    iconUrl: "./icons/BronteIcon.png",
    iconSize:[currentZoom*6, currentZoom*6*1.47], // size of the icon. The BronteIcon.png as a ration 1:1.47
});

var bronteIcon = L.icon({
    iconUrl: "./icons/BronteIcon.png",
    iconSize:[currentZoom*4, currentZoom*4*1.47],
});

var bronteIcon_small = L.icon({
    iconUrl: "./icons/BronteIcon.png",
    iconSize:[currentZoom*2, currentZoom*2*1.47],
});

//Don't change. Here we create a general variable called num, starting as -1. 'num' will be change when we move backward and forward along the list of stories, and it keeps track of where we are.
var num = -1;

//Don't change. Show start story when page has loaded
window.onload = function() {
	changeStory(startCoordinate, 'Startpage', 'story', startText); //Don't change. It calls the function changeStory, passing the parameters listed here.
};

//Don't change. We define the function onEachFeature, which determines what happens when you click on a feature.
function onEachFeature(feature, layer) {
    layer.on('click', function (e) {
      L.DomEvent.stopPropagation(e);
      // e = event
			var year = feature.properties.Year
			var translator = feature.properties.Translator
			let str = year;
			str += ' - ';
			str += translator;
			num = titles.indexOf(str)
			positions.clearLayers(); // Remove any markers
			if (useMarker) {
			if (showPopUp) { // Add new marker and pop-up visible or not
				L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]).openPopup();
			} else {
				L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]);
			};
			changeStory(position[num], bubbleText[num], 'story', storyText[num],elementZoom);
			}; // change the story (function)
		})
	};

//Don't change. Function to forward the story when clicking in the map
map.on('click', function() { //Don't change. Event is click, and it is when happens on the map
   try {
	num += 1; //Don't change. increases num by 1
  positions.clearLayers(); //Don't change. Remove any markers
	if (useMarker) {
	if (showPopUp) { // Add new marker and pop-up visible or not
		L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]).openPopup();
	} else {
		L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]);
	};
	};
	changeStory(position[num], bubbleText[num], 'story', storyText[num],elementZoom); // change the story (function)
   }
  catch(err) { // If this was the last story do the same, but show the start styry and start again.
	fadeOut(document.getElementById('story')),
	num = -1,
	positions.clearLayers(),
	changeStory(startCoordinate, 'Startsida', 'story', startText),
	setTimeout(function() {
		map.flyTo(startCoordinate,startZoom)
	}, panTime);
   }
});

L.easyButton('<img src="./icons/previous-svgrepo-com.svg" style="height:15px; margin-top:7px">', function(btn, map) {
    try {
	num -= 1;
	positions.clearLayers(); // Remove any markers
	if (useMarker) {
	if (showPopUp) { // Add new marker and pop-up visible or not
		L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]).openPopup();
	} else {
		L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]);
	};
	};
	changeStory(position[num], bubbleText[num], 'story', storyText[num]); // change the story (function)
    } catch(err) { // If it was the first story do the same, but show the start story again.
	num = -1,
	positions.clearLayers(),
	changeStory(startCoordinate, 'Startpage', 'story', startText),
	setTimeout(function() {
    map.flyTo(startCoordinate,startZoom)
  }, panTime);
    }
}).addTo( map );

L.easyButton('<img src="./icons/next-svgrepo-com.svg" style="height:15px; width:15px; margin-top:7px ; margin-left:3px">', function(btn, map) { // Function to forward the story when clicking in the map
   try {
	num += 1;
  positions.clearLayers(); // Remove any markers
	if (useMarker) {
	if (showPopUp) { // Add new marker and pop-up visible or not
		L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]).openPopup();
	} else {
		L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]);
	};
	};
	changeStory(position[num], bubbleText[num], 'story', storyText[num],elementZoom); // change the story (function)
   }
  catch(err) { // If this was the last story do the same, but show the start styry and start again.
	fadeOut(document.getElementById('story')),
	num = -1,
	positions.clearLayers(),
	changeStory(startCoordinate, 'Startsida', 'story', startText),
	setTimeout(function() {
		map.flyTo(startCoordinate,startZoom)
	}, panTime);
   }

}).addTo( map );

L.easyButton('<img src="./icons/refresh-svgrepo-com.svg" style="height:15px; width:15px; margin-top:7px ; margin-left:1px">', function(btn, map) { // Function to forward the story when clicking in the map
   // If this was the last story do the same, but show the start styry and start again.
	fadeOut(document.getElementById('story')),
	num = -1,
	positions.clearLayers(),
	changeStory(startCoordinate, 'Startsida', 'story', startText),
	setTimeout(function() {
		map.flyTo(startCoordinate,startZoom)
	}, panTime);
}).addTo( map );

L.easyButton('<img src="./icons/expand-06-svgrepo-com.svg" style="height:15px; width:15px; margin-top:7px ; margin-left:1px">', function(btn, map) { // Function to forward the story when clicking in the map
   // If this was the last story do the same, but show the start styry and start again.
		map.flyTo(position[0],startZoom,{ // Pan map to new location
  		animate:false,
  		duration:panTime
  	});
}).addTo( map );

map.on ('zoomend', function (){
  var zoomLevel = map.getZoom();
  if (num > -1){
    positions.clearLayers();
    if (zoomLevel > 16){
      if (useMarker) {
        if (showPopUp) { // Add new marker and pop-up visible or not
        L.marker(position[num],{icon: bronteIcon_large}).addTo(positions).bindPopup(bubbleText[num]).openPopup();
        }
      else {
        L.marker(position[num],{icon: bronteIcon_large}).addTo(positions).bindPopup(bubbleText[num]);
        };
      };
    };
    if (zoomLevel > 12 && zoomLevel <= 16){
      if (useMarker) {
        if (showPopUp) { // Add new marker and pop-up visible or not
        L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]).openPopup();
        }
      else {
        L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]);
        };
      };
    };
    if (zoomLevel <= 12){
      if (useMarker) {
        if (showPopUp) { // Add new marker and pop-up visible or not
        L.marker(position[num],{icon: bronteIcon_small}).addTo(positions).bindPopup(bubbleText[num]).openPopup();
        }
      else {
        L.marker(position[num],{icon: bronteIcon_small}).addTo(positions).bindPopup(bubbleText[num]);
        };
      };
    };
  };
});

function handleKeyDown(e) {
  if (e.keyCode == 37) {
    try {
      num -= 1;
      positions.clearLayers(); // Remove any markers
      if (useMarker) {
         if (showPopUp) { // Add new marker and pop-up visible or not
             L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]).openPopup();
           }
         else {
             L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]);
            };
      };
      changeStory(position[num], bubbleText[num], 'story', storyText[num],elementZoom); // change the story (function)
    }
    catch(err) { // If this was the last story do the same, but show the start styry and start again.
      fadeOut(document.getElementById('story')),
      num = -1,
      positions.clearLayers(),
      changeStory(startCoordinate, 'Startsida', 'story', startText),
      setTimeout(function() {
        map.flyTo(startCoordinate,startZoom)
      }, panTime);
    };
  }
  if (e.keyCode == 39){ // Function to forward the story when clicking in the map
    try {
    	num += 1;
      positions.clearLayers(); // Remove any markers
    	if (useMarker) {
    	   if (showPopUp) { // Add new marker and pop-up visible or not
    		     L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]).openPopup();
           }
         else {
    		     L.marker(position[num],{icon: bronteIcon}).addTo(positions).bindPopup(bubbleText[num]);
    	      };
    	};
    	changeStory(position[num], bubbleText[num], 'story', storyText[num],elementZoom); // change the story (function)
    }
    catch(err) { // If this was the last story do the same, but show the start styry and start again.
    	fadeOut(document.getElementById('story')),
    	num = -1,
    	positions.clearLayers(),
    	changeStory(startCoordinate, 'Startsida', 'story', startText),
    	setTimeout(function() {
    		map.flyTo(startCoordinate,startZoom)
      }, panTime);
    };
  };
};

document.addEventListener('keydown', handleKeyDown);
