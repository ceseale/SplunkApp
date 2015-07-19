/*google*/
/*d3*/
/*crossfilter*/
'use strict';

var app = angular.module('socrataApp');

  app.controller('TimemapCtrl', function ($scope) {
  	var date = new Date(978325200000);
    $scope.internaltime =  164.3*7 * 2;
    $scope.timeincrease = 7*24*6*600000;
    $scope.play = true ;
    $scope.bartime = 978325200000
    $scope.currentDate = date.toDateString();
      $('#butt2').css('z-index', -10);
  $('#butt3').css('z-index', -10);
  $('#butt1').css('z-index', -10);
  $('#timeplay').css('z-index', -10);
  $('#datetext').css('z-index', -10);
    $('#timeincrease').css('z-index', -10);
      $('#timenutbar').css('z-index', -10);



    $scope.pause = function (){

      d3.selectAll('circle').transition().duration(0);
      $scope.play =  false ;

    }

  	 setInterval(function(){

  	 	$scope.$apply(function(){

      if($scope.bartime <= 1388552400000 && $scope.play)
        $scope.bartime = Number($scope.bartime) + Number($scope.timeincrease);
       
 
  	 });
// 164.3
  	 },$scope.internaltime)



  
  });

    app.directive('donutChart', function(){
      function link(scope, el, attr){
        var color = d3.scale.category10();
        var data = [0, 1388552400000 ]
        var width = 200;
        var height = 200;
        var min = Math.min(width, height);
        var svg = d3.select(el[0]).append('svg').attr('id', 'timeplay');
        var pie = d3.layout.pie().sort(null);
        var arc = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.5);
       
        svg.attr({width: width, height: height});
        var g = svg.append('g')


          // center the donut chart
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // add the <path>s for each arc slice
        var arcs = g.selectAll('path').data(pie(data))
          .enter().append('path')
            // .style('stroke', 'white')
            .attr('fill', function(d, i){ return color(i) })
            .attr('id', 'timeplay')
    
    

        var mill = d3.scale.linear().domain([978325200000,1388552400000]).range([0,width]);
        var inversemill = d3.scale.linear().domain([0,width]).range([978325200000,1388552400000]);

 
         var bartimescale = d3.scale.linear().domain([0,1388552400000]).range([0,100])
         var inversetimebar = d3.scale.linear().domain([0,100]).range([978325200000,1388552400000])
        scope.$watch('bartime', function(bartime){
          var currenttime =  bartime - 978325200000
          var difftime = 1388552400000 - bartime
          data = [currenttime, difftime]
          var date = new Date( Math.floor(bartime));
          scope.currentDate = date.toDateString();
          arcs.data(pie(data)).attr('d', arc);
        }, true);

    
      }
      return {
        link: link,
        restrict: 'E'
      };
    });

    app.directive('progressBar', function(){
      function link($scope, el, attr){
        el = el[0]
        var width = $(window).width()
        var height = 50
        var mill = d3.scale.linear().domain([978325200000,1388552400000]).range([0,width])
        var inversemill = d3.scale.linear().domain([0,width]).range([978325200000,1388552400000])


        var svg = d3.select(el).append('svg')
          .attr({width: width, height: height})
          .attr( 'id', 'timeplay')
          .style('border', '1px solid black')
          .style('opacity', .4);

        // the inner progress bar `<rect>`
        // the inner progress bar `<rect>`
        var rect = svg.append('rect').style('fill', 'blue');
        var count = 0 ;

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])

          
          svg.call(tip);

      svg.on('mousemove', function(){
         var coordinates = [0, 0];
          coordinates = d3.mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          tip.attr({x:coordinates[0] , y: rect.attr("height") })
          var bartime = (new Date(Math.floor(inversemill(x))))
           tip.html(function(d) {
            return "<br/>Go to: " + bartime.toDateString() + "<br/> " + bartime.toTimeString() ;
          })
          tip.show()
          
      })


        ;
      svg.on('mouseout', tip.hide);

        svg.on("click", function() {
          
           
         var coordinates = [0, 0];
          coordinates = d3.mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          $scope.acctime =  Date(Math.floor(inversemill(x)));

        });
        $scope.$watch('acctime', function(acctime){
             
          rect.attr({x: 0, y: 0, width: mill(Date.parse(acctime)) , height: height });

        },true)

      }

      return {
        link: link,
        restrict: 'E'
      };
    });

 app.directive('googleTime', function(){
  	function link($scope, el ){

var colorDead, colorAcci, lngDim, latDim, projection, gettitles, overlay, padding, mapOffset, weekDayTable, gPrints,  weekdayDim, hourDim, map, barAcciHour, styledMap, initMap, transform, ifselected, setCircle, initCircle, tranCircle, updateGraph;
colorDead = '#de2d26';
colorAcci = 'rgb(255, 204, 0)';
lngDim = null;
latDim = null;
projection = null;
overlay = null;
padding = 5;
mapOffset = 4000;
weekDayTable = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
gPrints = null;

weekdayDim = null;
hourDim = null;
map = null;
barAcciHour = null;
var overlayed = false ;
var pastzoom ; 
var zoom_changed = false ;			     //0.4
var radiusTable = [0.1, 0.2, 0.3,0.34,0.38,1, 0.41,0.5,0.55,0.74,0.95, 1.5,4.1,4.8,4.1,4.66,6.85,7.0,8.43,9.9,40.99];
var rad ; 
var radzoom = 0;
var startzoom = 8;
var outofbounds;
var safetyW;
var safetyH;
    var overlaynorthEast;
    var overlaysouthWest;
    var data20000 = []; 
    var timeDim = null ;

var drunkselected = false ;
var man_collselected = false;
var weatherselected = false ;
var man_collscale;
var weatherscale ;
var weatherG; 
var weatherD;
var drunkD;
var drunkG;
var man_collG;
var man_collD; 
var mantable = {};
var weathertable = {}
var loadweekchart;
mantable[0] = "Not Collision With Motor Vehicle in Transport"
mantable[1] = "Rear-End"
mantable[2] = "Head-On"
mantable[3] = "Rear-to-Rear"
mantable[4] = "Angle"
mantable[5] = "Sideswipe, Same Direction"
mantable[6] = "Sideswipe, Opposite Direction"
mantable[99] = "Unknown"
weathertable[1] = 'Clear'
weathertable[2] ='Rain'
weathertable[3] ='Hail'
weathertable[4] ='Snow'
weathertable[5] ='Dust/Fog'
weathertable[6] ='Crosswinds'
$scope.selectedgraph = "Day Of Week";
$scope.button1 = "Manner Collision";
$scope.button2 = "Weather";
$scope.button3 = "Drunk Drivers";


        var styledMap = new  google.maps.StyledMapType([
    {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#193341'
            }
        ]
    },
    {
        'featureType': 'landscape',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#2c5a71'
            }
        ]
    },
    {
        'featureType': 'road',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#29768a'
            },
            {
                'lightness': -37
            }
        ]
    },
    {
        'featureType': 'poi',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#406d80'
            }
        ]
    },
    {
        'featureType': 'transit',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#406d80'
            }
        ]
    },
    {
        'elementType': 'labels.text.stroke',
        'stylers': [
            {
                'visibility': 'on'
            },
            {
                'color': '#3e606f'
            },
            {
                'weight': 2
            },
            {
                'gamma': 0.84
            }
        ]
    },
    {
        'elementType': 'labels.text.fill',
        'stylers': [
            {
                'color': '#3e606f'
            },
            {
                'lightness': 20
            }
        ]
    },
    {
        'featureType': 'administrative',
        'elementType': 'geometry',
        'stylers': [
            {
                'weight': 0.6
            },
            {
                'color': '#1a3541'
            }
        ]
    },
    {
        'elementType': 'labels.icon',
        'stylers': [
            {
                'visibility': 'off'
            }
        ]
    },
    {
        'featureType': 'poi.park',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#2c5a71'
            }
        ]
    }
] , { name: 'Styled Map'

 });
initMap = function(){
  // google.maps.visualRefresh = true;



  rad = radiusTable[startzoom];
  map = new google.maps.Map(d3.select('#map').node(), {

    zoom: startzoom,
    center: new google.maps.LatLng(25.7877,  -80.2241),
    disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeId: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }





  });

  // Add to new directive
   var input = d3.select('#pac-input').node()

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox((input));

  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
   var bounds = new google.maps.LatLngBounds();
    if (places.length == 0) {
      return;
    }
       for (var i = 0, place; place = places[i]; i++) {
      bounds.extend(place.geometry.location);


    
        map.fitBounds(bounds);
        map.setZoom(startzoom);
    }
});



pastzoom  = map.getZoom();

google.maps.event.addListener(map, 'zoom_changed', function(){
$scope.play = true; 
var currentzoomlevel = this.getZoom();
d3.select("#timeincrease").attr('max', function (){
  if (currentzoomlevel >= 8 ){
  return 2628000000
} else if (currentzoomlevel >= 7 ){
 return 2628000000 - (6 * 86400000)
} else {
 return 2628000000 - (15 * 86400000)
}

})

radzoom = currentzoomlevel ;
rad = radiusTable[radzoom];
zoom_changed = true ; 

  });

  google.maps.event.addListener(map, 'bounds_changed', function(){
    var bounds, northEast, southWest;
    bounds = this.getBounds();
    radzoom = this.getZoom();
    northEast = bounds.getNorthEast();
    southWest = bounds.getSouthWest();
    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
    searchBox.setBounds(bounds); // For search bias


    return dc.redrawAll();
  });


  google.maps.event.addListener(map, 'dragend', function(){
    var bounds, northEast, southWest;
    bounds = this.getBounds();
    radzoom = this.getZoom();
    northEast = bounds.getNorthEast();
    southWest = bounds.getSouthWest();


    if (outofbounds( northEast, southWest)){
    	console.log('out');
    	overlay.draw();


    }
   
  });


  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  return overlay.setMap(map);

};

man_collscale = d3.scale.ordinal().domain([99,0,2,3,4,5,1,2])
                  .range(['rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(189,0,38)','rgb(128,0,38)'])

weatherscale  =  d3.scale.ordinal().domain([99,1,6,5,4,5,3,2])
                  .range(['rgb(199,233,180)','rgb(127,205,187)','rgb(65,182,196)','rgb(29,145,192)','rgb(34,94,168)','rgb(37,52,148)','rgb(8,29,88)'])


transform = function(d){
  d = new google.maps.LatLng(d.GoogleLat, d.GoogleLng);
  d = projection.fromLatLngToDivPixel(d);
  return d3.select(this).style('left', (d.x - padding) + 'px').style('top', (d.y - padding) + 'px');
};
ifselected = function(it){

  if (drunkselected && it.drunk_dr > 0 ) {
    return '#800026';
  } else if (man_collselected  ){
    return man_collscale(it.man_coll)
  } else if(weatherselected ) {
    return weatherscale(it.weather)
  } else  {
    return '#e31a1c';
  }

 

};



setCircle = function(it){


  return it.attr({
    'cx': function(it){
      return it.coorx;
    },
    'cy': function(it){
      return it.coory;
    },
    'r' : rad + 'px'
  }).style({
  	'fill':function (it){
return ifselected(it)
    },
  	'position': 'absolute',
    'opacity': .9
  })
};


var accidentremove = function (it){

return it.style({
    // 'position': 'absolute',
    'opacity': function(it){
      return 0;
    }
  }).each('end', function (){
 
    d3.select(this).remove();


  });
}

var accidentHappend = function (it){

return it.attr({
    'r': function(it){

      return  rad*32 + 'px';
    }

}).style({
    'fill': function(it){
      return ifselected(it);
    },
    'position': 'absolute',
    'opacity': function(it){
      return 0;
    }
  }).each('end', function (){
    if ($scope.play){
    d3.select(this).remove();
  }

  });


};

initCircle = function(it){
  return it.style({
    'opacity': 0
  });
};
tranCircle = function(it){
  return it.style({
    'opacity': function(it){
      return 1;
    }
  });
};

var emstimer = function(it){
return it.ems_arrival*2*60;
}

var emsscale = d3.scale.linear().domain([0, 11000]).range(['yellow', 'red']);


updateGraph = function(){
  var dt;
  dt = gPrints.selectAll('circle').data(drunkD.top(Infinity));

  dt.enter().append('circle').call(setCircle);
  // dt.call(setani);
  dt.transition().duration(emstimer).ease("linear").call(accidentHappend)

  // return dt.exit().remove();
};

d3.csv('/vis1datau.csv', function(err, tsvBody){
  var deadData, barPerMonth, barPerWeekDay, barPerHour, barAcciMonth, barAcciWeekDay, ndx, all, acciMonth, acciWeekDay, acciHour, deathMonth, deathWeekDay, deathHour, barMt, barWk, barHr, marginMt, marginWk, marginHr, navls, navidx, nav;

  tsvBody.filter(function(d){

    d.GoogleLng = +d.GoogleLng;
    d.GoogleLat = +d.GoogleLat;
    d.date = new Date(( Number (d['year']) + 2000), d['month'], d['day'], d['hour'], d['minute']);
    d.week = weekDayTable[d.date.getDay()];


    return true;
  });

  console.log(tsvBody)


 function checkoverlay (currentzoom) {
	
	if (zoom_changed & (pastzoom == currentzoom)){
		overlay.draw();

		zoom_changed = false ;
		return true;

	} else if ( (pastzoom == currentzoom) ) {
		return false;
	}
	 else {
		overlay.draw();
		pastzoom = map.getZoom();
		return true;
	}
}

outofbounds = function ( northEast, southWest){
	
    var okay1 = (southWest.lng() > overlaysouthWest.lng()-safetyW*2);
    var okay2 = (southWest.lat() > overlaysouthWest.lat()-safetyH*3);
    var okay3 = (northEast.lng() < overlaynorthEast.lng()+safetyW*2);
    var okay4 = (northEast.lat() < overlaynorthEast.lat()+safetyH*3);
    // console.log((okay1 && okay2 && okay3 && okay4));
    if (okay1 && okay2 && okay3 && okay4){
		return false ;
		}
		else {
		return true; 
			}

}

var randomCrash = function (){

if (data20000.length == 0 ){
data20000 = _.sample(drunkD.top(Infinity),1000);
return data20000;
} else {
return data20000;

}


};


  overlay = new google.maps.OverlayView();

  overlay.onRemove = function (){
d3.select("circle")
       .remove();

  };

  overlay.onAdd = function(){
  	console.log("count")
    var layer, svg;
    layer = d3.select(this.getPanes().overlayLayer).append('div').attr('class', 'stationOverlay');
    svg = layer.append('svg');
    gPrints = svg.append('g').attr({
      'class': 'class',
      'gPrints': 'gPrints'
    });
    svg.attr({
      'width': mapOffset * 2,
      'height': mapOffset * 2
    }).style({
      'position': 'absolute',
      'top': -1 * mapOffset + 'px',
      'left': -1 * mapOffset + 'px'
    });
  

    return overlay.draw = function(){

    	// making internal data so overlay doesn't redraw everything
    	var _data = null;
    	// filtering out bounds 
    var overlaybounds = map.getBounds();

    overlaynorthEast = overlaybounds.getNorthEast();
    overlaysouthWest = overlaybounds.getSouthWest();
    


    safetyW = ( overlaynorthEast.lng() - overlaysouthWest.lng() )
    safetyH = ( overlaynorthEast.lat() - overlaysouthWest.lat() )

    lngDim.filterRange([overlaysouthWest.lng() , overlaynorthEast.lng()]);
    latDim.filterRange([overlaysouthWest.lat(), overlaynorthEast.lat()]);
  //  console.log('here');
 //    	if(data20000.length == 0 ){
 //    	lngDim.filterAll();
	// 	latDim.filterAll();
	// }

	// timeDim.filterAll();
	  _data = drunkD.top(Infinity);//randomCrash(); 
      
      $scope.aas = "Accident Period: " + String(($scope.timeincrease / 86400000).toFixed(2)) + " day(s)";

 
      var googleMapProjection, dt;
      projection = this.getProjection();
      googleMapProjection = function(coordinates){
        var googleCoordinates, pixelCoordinates;
        googleCoordinates = new google.maps.LatLng(coordinates[0], coordinates[1]);
        pixelCoordinates = projection.fromLatLngToDivPixel(googleCoordinates);
        return [pixelCoordinates.x + mapOffset, pixelCoordinates.y + mapOffset];
      };

      _data.filter(function(it){
        var coor;
        coor = googleMapProjection([it.GoogleLat, it.GoogleLng]);
        it.coorx = coor[0];
        it.coory = coor[1];

        return true;
      });
     var dt =  gPrints.selectAll('circle').data(_data)
 //      dt.enter().append('circle'); //.call(setCircle)
      dt.call(setCircle);
 //      // dt.call(setani);
	//   dt.transition().duration(2000).call(accidentHappend);
 //      //  returning the bounds 
	var bounds = map.getBounds();
    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();
     var timeint =  $scope.bartime+Number($scope.timeincrease);
    (timeDim.filterRange([new Date($scope.bartime), new Date(  timeint )]));

    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
   
   updateGraph();
    // return dt.exit().remove();

    };
    

  };


  ndx = crossfilter(tsvBody);

  all = ndx.groupAll();


 
 weatherD = ndx.dimension(function (it){
    return weathertable[it.weather];
  });
 drunkD = ndx.dimension(function (it){
    return it.drunk_dr > 0 ? "Drunk" : "Non Drunk"
  });


 man_collD = ndx.dimension(function (it){
    return mantable[it.man_coll];
  }); 

  timeDim = ndx.dimension(function (it){
  	return it.date;
  });



  weekdayDim = ndx.dimension(function(it){
    return weekDayTable[it.date.getDay()];
  });
  hourDim = ndx.dimension(function(it){
    return Number( it['hour'] ) ;
  });
  lngDim = ndx.dimension(function(it){
    return it.GoogleLng;
  });
  latDim = ndx.dimension(function(it){
    return it.GoogleLat;
  });



  weatherG = weatherD.group().reduceCount();
  drunkG = drunkD.group().reduceCount();
  man_collG = man_collD.group().reduceCount();


  $scope.$watch('bartime', function (bartime){


  var timeint =  Number(bartime)+ Number($scope.timeincrease);

   (timeDim.filterRange([new Date(bartime) , new Date(  timeint )]));

   overlay.draw();
   updateGraph();
   return dc.redrawAll();

   
  },true);

acciWeekDay = weekdayDim.group().reduceCount();
acciHour = hourDim.group().reduceCount();

  var hourchart = dc.barChart('#acchour');
   
  var dayOfWeekChart = dc.rowChart('#AcciWeekDay');


    barMt = 350;
  barWk = 270;
  barHr = 550;
  marginMt = {
    'top': 10,
    'right': 10,
    'left': 30,
    'bottom': 20
  };
  marginWk = marginMt;
  marginHr = marginMt;

  var dash_h = 650;
  var dash_w = 200;
  var row_h = 220;
  var row_w = 180;
  var ttestcon = d3.select('#ttest').append('svg')
  .attr('width', dash_w)
  .attr('height', dash_h);


          var dash_back = ttestcon.append('rect')
              .attr({x:0, y:0, width: dash_w, height: dash_h , fill: 'gray', opacity: 0.5});




var gettitles = function (){

if(man_collselected){
$scope.selectedgraph = "Manner Collision";
$scope.button1 = "Remove";
$scope.button2 = "Weather";
$scope.button3 = "Drunk Drivers";
} else if (weatherselected) {

$scope.selectedgraph = "Weather";
$scope.button1 = "Manner Collision";
$scope.button2 = "Remove";
$scope.button3 = "Drunk Drivers";


} else if (drunkselected){

$scope.selectedgraph = "Day Of Week";
$scope.button1 = "Manner Collision";
$scope.button2 = "Weather";
$scope.button3 = "Drunk Drivers";


} else {
$scope.selectedgraph = "Day Of Week";
$scope.button1 = "Manner Collision";
$scope.button2 = "Weather";
$scope.button3 = "Drunk Drivers";
}

}

  var ttest_dashrain = ttestcon
      .append('rect')
          .attr({x:10, y:10, width: dash_w-(2*10), height: 40, fill: '#3182bd'}).on('mouseenter',function(){
            ttest_dashrain.attr({ opacity: 0.5})

          }).on('mouseleave',function(){
            ttest_dashrain.attr({ opacity: .8})
          }).on('click',function(){
            ttest_dashrain.attr({ opacity: .8})
            if (!man_collselected){
             man_collselected = true ; 
             weatherselected = false ;
             drunkselected = false  ; 


dayOfWeekChart.width(row_w)
        .height(row_h)
        .margins(marginMt)
        .group(man_collG)
        .dimension(man_collD)
                .colors([man_collscale(0) , man_collscale(1) , man_collscale(2) , man_collscale(3) , man_collscale(4) ,
                man_collscale(5), man_collscale(6), man_collscale(99)  ])
        .label(function (d) {
          return d.key;
        })
        .title(function (d) {
            
            return d.value;
        })
        .elasticX(true).on('filtered', function(c, f){
    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
  }
  })
  .xAxis().ticks(4);



            } else {
              man_collselected = false;
              weatherselected = false ;
              drunkselected = false  ; 
               loadweekchart();
            }

           $scope.$apply(gettitles()) 

          });


    var ttest_dashsnow = ttestcon
      .append('rect')
          .attr({x:10, y:60, width: dash_w-(2*10), height: 40, fill: '#3182bd'}).on('mouseenter',function(){
            ttest_dashsnow.attr({ opacity: 0.5})

          }).on('mouseleave',function(){
            ttest_dashsnow.attr({ opacity: .8})

          }).on('click',function(){
            ttest_dashsnow.attr({ opacity: .8})
            
              if (!weatherselected){
             weatherselected = true ; 
             man_collselected = false ;
             drunkselected = false  ;



dayOfWeekChart.width(row_w)
        .height(row_h)
        .margins(marginMt)
        .group(weatherG)
        .dimension(weatherD)
                             .colors([weatherscale(0) , weatherscale(1) , weatherscale(2) , weatherscale(3) , weatherscale(4) ,
                weatherscale(5), weatherscale(6), weatherscale(99)  ])
        .label(function (d) {
          return d.key;
        })
        .title(function (d) {
            
            return d.value;
        })
        .elasticX(true).on('filtered', function(c, f){
    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
  }
  })
  .xAxis().ticks(4);






            } else {
              man_collselected = false;
              weatherselected = false ;
              drunkselected = false  ; 
               loadweekchart();
            }

                   $scope.$apply(gettitles()) 
          });

        var ttest_dashdrunk = ttestcon
      .append('rect')
          .attr({x:10, y:110, width: dash_w-(2*10), height: 40, fill: '#3182bd'}).on('mouseenter',function(){
            ttest_dashdrunk.attr({ opacity: 0.5})

          }).on('mouseleave',function(){
            ttest_dashdrunk.attr({ opacity: .8})

          }).on('click',function(){
           ttest_dashdrunk.attr({ opacity: .8})
              if (!drunkselected){

             drunkselected = true ; 
             man_collselected = false ;
             weatherselected = false  ; 


dayOfWeekChart.width(row_w)
        .height(row_h)
        .margins(marginMt)
        .group(drunkG)
        .dimension(drunkD)
                .colors(['#800026', '#e31a1c'])
        .label(function (d) {
          return d.key;
        })
        .title(function (d) {
            
            return d.value;
        })
        .elasticX(true).on('filtered', function(c, f){
    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
  }
  })
  .xAxis().ticks(4);


            } else {
              man_collselected = false;
              weatherselected = false ;
              drunkselected = false  ; 
              loadweekchart();
            }

                   $scope.$apply(gettitles()) 
          });    


// Real!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


        loadweekchart = function(){
        dayOfWeekChart.width(row_w)
        .height(row_h)
        .margins(marginMt)
        .group(acciWeekDay)
        .dimension(weekdayDim)
                .colors(['#1f77b4'])
        .label(function (d) {
          return d.key;
        })
        .title(function (d) {
            
            return d.value;
        })
        .elasticX(true).on('filtered', function(c, f){
    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
  }
  })
  .xAxis().ticks(4);

}

   loadweekchart();
     hourchart.width((180*1.61803398875*1.61803398875)).height(100)
     .margins(marginMt).dimension(hourDim)
     .group(acciHour).x(d3.scale.ordinal()
      .domain(d3.range(0, 24))).xUnits(dc.units.ordinal)
     .elasticY(true).on('filtered', function(c, f){
  
    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
  }
  }).yAxis().ticks(4);
$scope.$apply(gettitles()) 
    $('#butt2').css('z-index', 6);
  $('#butt3').css('z-index', 6);
  $('#butt1').css('z-index', 6);
  $('#timeplay').css('z-index', 6);
  $('#datetext').css('z-index', 6);
    $('#timeincrease').css('z-index', 6);
      $('#timenutbar').css('z-index', 6);

dc.renderAll();
  initMap();

});

  google.maps.event.addDomListener(window, 'load', initMap);

  	}
  	return {

  		link : link, 
  		restrict: 'E'

  	}


  })