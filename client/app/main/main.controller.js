/*google*/
/*d3*/
/*crossfilter*/
'use strict';

/**
 * @ngdoc function
 * @name ibmappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ibmappApp
 */
var app = angular.module('socrataApp');
  app.controller('MainCtrl', function ($scope, $timeout, $q, $mdSidenav, $mdUtil, $log,  $mdToast, $animate, $mdDialog) {


$scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      clickOutsideToClose: true,
      scope: $scope,        // use parent scope in template
      preserveScope: true ,
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
$scope.showHello = function(ev) {
    $mdDialog.show({
      controller: HelloController,
      templateUrl: 'dialog2.tmpl.html',
      clickOutsideToClose: true,
      scope: $scope,        // use parent scope in template
      preserveScope: true ,
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };

$scope.showHello();

 $scope.toggleRight = buildToggler('right');


    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
                $scope.show_after()
              });
          },300);

      return debounceFn;
    }


    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
    

$scope.loadcount = 0 ; 
 $("#more_results_wrapper_div").hide();

    $scope.ems = true ;
    $scope.age = false;
    $scope.death = false;


$scope.filterData = function (text){

  if (text == 'ems'){
    $scope.ems = true ;
    $scope.age = false;
    $scope.death = false;
  } else if (text == 'age'){
    $scope.ems = false ;
    $scope.age = true;
    $scope.death = false;
  }else {
    $scope.ems = false ;
    $scope.age = false;
    $scope.death = true;
  }

  $scope.updateData($scope.searchText )
}

        $scope.n_samples = 20000;
        $scope.n_burnin = 20000;


// var opts = {
//   lines: 13 // The number of lines to draw
// , length: 28 // The length of each line
// , width: 14 // The line thickness
// , radius: 33 // The radius of the inner circle
// , scale: 1 // Scales overall size of the spinner
// , corners: 1 // Corner roundness (0..1)
// , color: '#000' // #rgb or #rrggbb or array of colors
// , opacity: 0.25 // Opacity of the lines
// , rotate: 0 // The rotation offset
// , direction: 1 // 1: clockwise, -1: counterclockwise
// , speed: 1 // Rounds per second
// , trail: 60 // Afterglow percentage
// , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
// , zIndex: 2e9 // The z-index (defaults to 2000000000)
// , className: 'spinner' // The CSS class to assign to the spinner
// , top: '50%' // Top position relative to parent
// , left: '50%' // Left position relative to parent
// , shadow: false // Whether to render a shadow
// , hwaccel: false // Whether to use hardware acceleration
// , position: 'absolute' // Element positioning
// }
// var target = document.getElementById('foo')
// var spinner = new Spinner(opts).spin(target);



 $scope.simulateQuery = true;
    $scope.isDisabled    = false;
    // list of `state` value/display objects

    $scope.states        = $scope.homeData
    $scope.querySearch   = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;

    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ?  $scope.homeData: $scope.homeData,
          deferred;
      if ($scope.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }


//// Donut Stuff

var home_meta = { 'not drunk': 42559,
  clear: 44863,
  'dark not lighted': 17685,
  rain: 14173,
  drunk: 18504,
  'dark lighted': 10848,
  unknown: 245,
  'dark unknown lighting': 293,
  daylight: 29468,
  snow: 879,
  dusk: 1337,
  'dust/fog': 846,
  dawn: 1129,
  hail: 193,
  'not reported': 41,
  crosswinds: 109,
  other: 17 }

  $scope.metadata1 = home_meta; 
  $scope.metadata2 = home_meta; 

  // $scope.$watch('metadata', function(data){
  // $scope.metadata = data;
  // }, true)

var colorsDonutSet1 =  ['rgb(255,255,229)','rgb(255,247,188)','rgb(254,227,145)','rgb(254,196,79)','rgb(254,153,41)','rgb(236,112,20)','rgb(204,76,2)','rgb(153,52,4)','rgb(102,37,6)']


function catCodesGetter (array){
  return array.reduce(function (ob ,item, index){
    ob[item] = index;
    return ob;
  }, {} )
}



$scope.donut1 = { keys: ['drunk', 'not drunk'] , display : function (key,value, scope ){
  return 'YEAR:' +key + '\n' + value + ' ('+(value/this.sum(scope) * 100).toFixed(2)+'%)'
}, val: function ( key, scope){
 return scope[key]
 }, getArray: function (scope){
  return this.keys.map(function (item){ return scope[item] });
 }, name : function (value ){
   return 'Drunk Accidents'
 }, colors: [colorsDonutSet1[2], colorsDonutSet1[5],colorsDonutSet1[3]],
 sum: function (scope){
  return this.keys.reduce(function (total, item){ return total + scope[item] } , 0 )
 }, catCodes: catCodesGetter( ['drunk', 'not drunk'] ),
 home_meta: home_meta,
 donut_name:'donut1'

}


$scope.donut2 = { keys: [ 'clear', 'rain', 'hail', 'snow', 'dust/fog', 'crosswinds' ] , display : function (key,value, scope ){
  return 'YEAR:' +key + '\n' + value + ' ('+(value/this.sum(scope) * 100).toFixed(2)+'%)'
}, val: function ( key, scope){
 return scope[key]
 }, getArray: function (scope){
  return this.keys.map(function (item){ return scope[item] });
 }, name : function (value ){
   return 'Drunk Accidents'
 }, colors: colorsDonutSet1,
 sum: function (scope){
  return this.keys.reduce(function (total, item){ return total + scope[item] } , 0 )
 }, catCodes: catCodesGetter( [ 'clear', 'rain', 'hail', 'snow', 'dust/fog', 'crosswinds' ] ),
 home_meta: home_meta,
 donut_name:'donut1'

}


$scope.donut3 = { keys: ['daylight', 'dark not lighted', 'dark lighted', 'dark unknown lighting', 'dawn', 'dusk', 'other', 'not reported', 'unknown'] , display : function (key,value, scope ){
  return 'YEAR:' +key + '\n' + value + ' ('+(value/this.sum(scope) * 100).toFixed(2)+'%)'
}, val: function ( key, scope){
 return scope[key]
 }, getArray: function (scope){
  return this.keys.map(function (item){ return scope[item] });
 }, name : function (value ){
   return 'Drunk Accidents'
 }, colors: colorsDonutSet1,
 sum: function (scope){
  return this.keys.reduce(function (total, item){ return total + scope[item] } , 0 )
 }, catCodes: catCodesGetter( ['daylight', 'dark not lighted', 'dark lighted', 'dark unknown lighting', 'dawn', 'dusk', 'other', 'not reported', 'unknown'] ),
 home_meta: home_meta,
 donut_name:'donut1'

}

/////// Box 2






  });



    app.directive('loadingDonut', function(){
      function link(scope, el, attr){
        var color = d3.scale.category10();
        var data = [0, 6]
        var width = $(window).height() - 200
        var height = $(window).height() - 200
        var min = Math.min(width, height);
        var svg = d3.select(el[0]).append('svg').attr('id', 'loading');
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
            .attr('id', 'loading')
    
    


        scope.$watch('loadcount', function(loadcount){

          data = [loadcount, 6 - loadcount]
      ;
          arcs.data(pie(data)).attr('d', arc);
          if(loadcount == 6 ){

            // svg.remove();
          }
        }, true);

    
      }
      return {
        link: link,
        restrict: 'E'
      };
    });




  app.directive('googleVis', function($http,  $timeout,   $mdToast, $animate){
  	function link(scope, el ){





 scope.toastPosition = {
    bottom: false,
    top: true,
    left: false,
    right: true
  };
  scope.getToastPosition = function() {
    return Object.keys(scope.toastPosition)
      .filter(function(pos) { return scope.toastPosition[pos]; })
      .join(' ');
  };
 
  scope.showSimpleToast = function(text) {
    $mdToast.show(
      $mdToast.simple()
        .content(text)
        .position(scope.getToastPosition())
        .hideDelay(3000)
    );
  };




var colorDead, colorAcci, lngDim, latDim, projection, overlay, padding, mapOffset, weekDayTable, gPrints, doaDim, weekdayDim, hourDim, map, barAcciHour, styledMap, initMap, transform, ifdead, setCircle, initCircle, tranCircle, updateGraph;
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
doaDim = null;
weekdayDim = null;
hourDim = null;
map = null;
barAcciHour = null;
var overlayed = false ;
var pastzoom ; 
var layer, svg;
var zoom_changed = false ;			     //0.4
var radiusTable = [0.1, 0.2, 0.3,0.34,0.38,1, 0.41,0.5,0.55,0.74,0.95, 1.5,2.1,2.8,3.1,3.66,3.85,4.0,4.43,5.9,6.99];
var rad ; 
var radzoom = 0;
var startzoom = 10;
var outofbounds;
var safetyW;
var safetyH;
    var overlaynorthEast;
    var overlaysouthWest;
    var data20000 = []; 
    var infoWindow;
    var infoWindow2;
  var rect1_mean ;
  var rect2_mean ;
  var rect1_var ;
  var rect2_var ;
  var rect1_n ;  
  var rect2_n ;
  // scope.t_value = null; 
  var rectangle;
  var rectangle2;
  var bounds2 ;
  var inner1;
  var inner2;
  var rectcount = 0 ;
  // scope.y1 = [1.96, 2.06, 2.03, 2.11, 1.88, 1.88, 2.08, 1.93, 2.03, 2.03, 2.03, 2.08, 2.03, 2.11, 1.93]
    scope.outlier = {}
  scope.outlier.scale = 1.5;
   scope.y1 = [1.96, 2.06, 2.03, 2.11, 1.88, 1.88, 2.08, 1.93, 2.03, 2.03, 2.03, 2.08, 2.03, 2.11, 1.93];
  scope.y2 = [2.96, 1.06, 6.03, 4.11, 4.88, 4.88, 2.08, 3.93, 0.03, 5.03, 1.03, 1.08, 0.03, 6.11, 4.93, 17];
      var burn_timeout_id;
    var sample_timeout_id;
    var plot_timeout_id;
      var ttestcon;
var ttest_dash;
var dash_h ;
var dash_w ;

var svg2 ;
var analysisbutton ;
var text ;
var clicktext1;
var clicktext2;
var downy = 30; 
var updateview1;
var updateview2;
var savedLat ;
var savedLng ;

var addtopro = function(){
  scope.loadcount = scope.loadcount + 1 ;
}

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
    center: new google.maps.LatLng(40.71278370000001, -74.00594130000002),
    disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeId: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }





  });



  bounds2 = new google.maps.LatLngBounds(
    new google.maps.LatLng(25.748781939750618, -80.21240599060059),
    new google.maps.LatLng(25.77087930591169, -80.18184391784666)
      
  );

 // Define a rectangle and set its editable property to true.
  rectangle = new google.maps.Rectangle({
    bounds: bounds2,
    draggable: true,
    editable: true
  });



    rectangle2 = new google.maps.Rectangle({
    bounds: bounds2,
    draggable: true,
    editable: true
  });

    // Add an event listener on the rectangle.
  google.maps.event.addListener(rectangle2, 'bounds_changed', showNewRect2);
  google.maps.event.addListener(rectangle, 'bounds_changed', showNewRect);

  // Define an info window on the map.
  infoWindow = new google.maps.InfoWindow();
  infoWindow2 = new google.maps.InfoWindow();

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

    if(scope.searchText){
    var overlaybounds = map.getBounds();
    overlaynorthEast = overlaybounds.getNorthEast();
    overlaysouthWest = overlaybounds.getSouthWest();
    safetyW = ( overlaynorthEast.lng() - overlaysouthWest.lng() )
    safetyH = ( overlaynorthEast.lat() - overlaysouthWest.lat() )
    savedLat = ([overlaysouthWest.lat()-safetyH*3, overlaynorthEast.lat()+safetyH*3]);
    savedLng = ([overlaysouthWest.lng()-safetyW*2 , overlaynorthEast.lng()+safetyW*2 ]);


      scope.updateData(scope.searchText)
    }
});


function getCounts(data){
  return data.reduce(function (ob,  item ){

    ob[item.drunk] = (ob[item.drunk] += 1) || 1;
    ob[item.weather] = (ob[item.weather] += 1) || 1;
    ob[item.lgt_cond] = (ob[item.lgt_cond] += 1) || 1;
    return ob;
  }, {})

}



// Show the new coordinates for the rectangle in an info window.
/** @this {google.maps.Rectangle} */
function showNewRect(event) {
  var ne = rectangle.getBounds().getNorthEast();
  var sw = rectangle.getBounds().getSouthWest();
  lngDim.filterRange([sw.lng(), ne.lng()]);
  latDim.filterRange([sw.lat(), ne.lat()]);
  inner1 = lngDim.top(Infinity);


  var temp_meta = (getCounts(lngDim.top(Infinity))); 
  Object.keys(scope.metadata1).forEach(function (item){
    if(  Object.keys(temp_meta).indexOf(item) === -1   ){
      temp_meta[item] = 0 ; 
    }
  })
  scope.metadata1 = temp_meta;

$timeout( function (){
    scope.rect1ON = true;
  scope.y1 = inner1.map(function (item){
    return item.lag_seconds;
  });

})

  // rect1_mean = d3.mean(inner1, function(ob){
  //   scope.y1[scope.y1.length] = ob.lag_seconds;
  //   return ob.lag_seconds;
  // })

 // rect1_var = d3.variance(scope.y1);


// rect1_n = inner1.length

// if (rect1_n > 0 ){
// $timeout(updateview1);
// }

// console.log('HELLPO')
//   console.log(projection.fromLatLngToDivPixel(ne))
//   console.log(projection.fromLatLngToDivPixel(sw))


//Returning bounds
    var bounds, northEast, southWest;
    bounds = map.getBounds();
    northEast = bounds.getNorthEast();
    southWest = bounds.getSouthWest();
    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
// ttest();
  // infoWindow.open(map);
 

}

/** @this {google.maps.Rectangle} */
function showNewRect2(event) {
  var ne = rectangle2.getBounds().getNorthEast();
  var sw = rectangle2.getBounds().getSouthWest();
  lngDim.filterRange([sw.lng(), ne.lng()]);
  latDim.filterRange([sw.lat(), ne.lat()]);
  inner2 = lngDim.top(Infinity);



  var temp_meta = (getCounts(lngDim.top(Infinity))); 
  Object.keys(scope.metadata2).forEach(function (item){
    if(  Object.keys(temp_meta).indexOf(item) === -1   ){
      temp_meta[item] = 0 ; 
    }
  })
  scope.metadata2 = temp_meta;


$timeout( function (){
  rect2ON = true;
  scope.y2 = inner2.map(function (item){
    return item.lag_seconds;
  });

  })

  // rect2_mean = d3.mean(inner2, function(ob){
  //   scope.y2[scope.y2.length] = ob.lag_seconds;
  //   return ob.lag_seconds;
  // })

 // rect2_var = d3.variance(scope.y2);


// rect2_n = inner2.length;


//Returning bounds
    var bounds, northEast, southWest;
    bounds = map.getBounds();
    northEast = bounds.getNorthEast();
    southWest = bounds.getSouthWest();
    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
//   if (rect2_n > 0 ){
// $timeout(updateview2);
// }
  // ttest();
}
pastzoom  = map.getZoom();

google.maps.event.addListener(map, 'zoom_changed', function(){
var currentzoomlevel = this.getZoom();
if (currentzoomlevel < startzoom){
	currentzoomlevel = startzoom;
	map.setZoom(currentzoomlevel);
}
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



//TODO
    // lngDim.filterRange([overlaysouthWest.lng()-safetyW*2 , overlaynorthEast.lng()+safetyW*2 ]);
    // latDim.filterRange([overlaysouthWest.lat()-safetyH*3, overlaynorthEast.lat()+safetyH*3]);

    searchBox.setBounds(bounds); // For search bias


 // rectangle2.setOptions({fillColor:rect_color(t_value) })

    // return dc.redrawAll();
  });


  google.maps.event.addListener(map, 'dragend', function(){
    var bounds, northEast, southWest;
    bounds = this.getBounds();
    radzoom = this.getZoom();
    northEast = bounds.getNorthEast();
    southWest = bounds.getSouthWest();



    if (outofbounds( northEast, southWest)){
    
    	overlay.draw();


    }
   
  }); 


  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  $('#diff_plots_div').css('z-index', -10);
  $('#group_diff_plot').css('z-index', -10);
  $('#group_diff_hist').css('z-index', -10);
  return overlay.setMap(map);

};
  



scope.percentDone = 0 ;

scope.runbayes = function(){

   scope.showSimpleToast('-- Starting Burn in phase --')


        var n_samples = scope.n_samples;
        var n_burnin = scope.n_burnin;
        var posterior = make_BEST_posterior_func(scope.y1, scope.y2)
                var data_calc = function(params) {
            var mu_diff = params[0] - params[1]
            var sd_diff = params[2] - params[3]
            var effect_size = (params[0] - params[1]) / Math.sqrt((Math.pow(params[2], 2) + Math.pow(params[3], 2)) / 2 )
            var normality = Math.log(params[4]) / Math.LN10
            return [mu_diff, sd_diff, normality, effect_size]
        }


         var inits = [jStat.mean(scope.y1), jStat.mean(scope.y2), jStat.stdev(scope.y1), jStat.stdev(scope.y2), 5]

        var sampler = new amwg(inits, posterior, data_calc)
        var count = 0.0;
        function burn_asynch(n) {

         $timeout(function (){
          scope.percentDone = scope.percentDone < 100 ? (count /(n_burnin/500.0 ) *100).toFixed(0) : 0 ;

        })
            sampler.burn(500)
            count = count + 1;
            if(n > 0) {

                burn_timeout_id = setTimeout(function() {burn_asynch(n - 1)}, 0)
            } else {
                console.log("\n-- Finished Burn in phase --\n")
                scope.showSimpleToast('-- Starting sampling phase --')
                console.log("\n-- Started sampling phase --\n")
                  $('#group_diff_plot').css('z-index', 2);
                 $('#group_diff_hist').css('z-index', 2);
                 $("#diff_plots_div").css('z-index', 2);
                $("#diff_plots_div").show();
                sample_timeout_id = sampler.n_samples_asynch(n_samples, 50)
                plot_asynch()
            }
        }

   function plot_asynch() {
            var plot_start_time = new Date()
            var chain = sampler.get_chain()
            var plot_data = chain_to_plot_data(chain, Math.ceil(n_samples / 1000))

            plot_mcmc_chain("group_diff_plot", plot_data[5], "samples")
            //plot_mcmc_chain("plot3", plot_data[2] , "title2")
            //plot_mcmc_chain("plot5", plot_data[4], "title3")

            plot_mcmc_hist("group_diff_hist", param_chain(chain, 5), true, 0)
            //plot_mcmc_hist("plot4", param_chain(sampler.get_chain(), 2), true)
            //plot_mcmc_hist("plot6", param_chain(sampler.get_chain(), 4), true)
            
            var plot_time = (new Date()) - plot_start_time
            if(sampler.is_running_asynch()) {
                plot_timeout_id = setTimeout(function() {plot_asynch()}, plot_time * 2 )
            } else {
   
                 $("#more_results_wrapper_div").show();
                show_result()
               

            }
        }


          function show_result() {
            var chain = sampler.get_chain()
            var plot_data = chain_to_plot_data(chain, Math.ceil(n_samples / 1000))
            var mean_chains = param_chain(chain, 0).concat(param_chain(chain, 1))
            var mean_xlim = [jStat.min(mean_chains), jStat.max(mean_chains)]
            var sd_chains = param_chain(chain, 2).concat(param_chain(chain, 3))
            var sd_xlim = [jStat.min(sd_chains), jStat.max(sd_chains)]

            plot_mcmc_chain("group_diff_plot", plot_data[5], "samples")
            plot_mcmc_chain("group1_mean_plot", plot_data[0], "samples")
            plot_mcmc_chain("group1_sd_plot", plot_data[2], "samples")
            plot_mcmc_chain("group2_mean_plot", plot_data[1], "samples")
            plot_mcmc_chain("group2_sd_plot", plot_data[3], "samples")
            plot_mcmc_chain("sd_diff_plot", plot_data[6], "samples")
            plot_mcmc_chain("normality_plot", plot_data[7], "samples")
            plot_mcmc_chain("effect_size_plot", plot_data[8], "samples")

            plot_mcmc_hist("group_diff_hist", param_chain(chain, 5), true, 0)
            plot_mcmc_hist("group1_mean_hist", param_chain(chain, 0), true, null, mean_xlim)
            plot_mcmc_hist("group1_sd_hist", param_chain(chain, 2), true, null, sd_xlim)
            plot_mcmc_hist("group2_mean_hist", param_chain(chain, 1), true, null, mean_xlim)
            plot_mcmc_hist("group2_sd_hist", param_chain(chain, 3), true, null, sd_xlim)
            plot_mcmc_hist("sd_diff_hist", param_chain(chain, 6), true, 0)
            plot_mcmc_hist("normality_hist", param_chain(chain, 7), true)
            plot_mcmc_hist("effect_size_hist", param_chain(chain, 8), true, 0)

        }

        burn_asynch(Math.ceil(n_burnin /  500));
        scope.show_after = show_result;

}



// var ttest = function (){
//   // scope.$apply(function(){
//   var p = jStat.ttest((rect1_mean - rect2_mean)/ (Math.sqrt( ((rect1_var/rect1_n) + (rect2_var/rect2_n)) )) , rect1_n + rect2_n, 2 );
//   if( !isNaN(p) && !(p === undefined) ){
//  rectangle.setOptions({fillColor:rect_color(p) })
//  rectangle2.setOptions({fillColor:rect_color(p) })
//   scope.p_val =  'Two-Tailed P-value: ' + p.toFixed(5)
// }

// // });
// }




var rect_color = d3.scale.linear().domain([0,1]).range(['red','black','black'])
// scope.$watch('p_val', function (p_val){

// if ( ! (p_val === undefined) ){
 




// if (rectcount ==  0){
// svg2 = ttestcon.append('svg').attr('height', dash_h).attr('width', dash_w)
// analysisbutton = svg2.append('rect')
//           .attr({x:10, y:270 + downy, width: dash_w-(2*10), height: 40, fill: '#3182bd'}).on('mouseenter',function(){
//             analysisbutton.attr({ opacity: 0.5})
//           }).on('mouseleave',function(){
//             analysisbutton.attr({ opacity: .8})
//           }).on('click', function(){
//             runbayes();
//           });

// text = svg2.append('text').text('Run Bayesian Analysis')
//                 .attr('x', 27 )
//                 .attr('y', 295  + downy )
//                 .attr( 'text-align', 'center')
//                 .attr('class', 'muted')
                
//                 rectcount= 1;

//     }
      
// }
 

// }, true)




var removerect1 = function (){
  rectangle.setMap(null);
}

var addrect1 = function (){
  rectangle.setMap(map);

}



var removerect2 = function (){
  rectangle2.setMap(null);
}

var addrect2 = function (){
  rectangle2.setMap(map);
}

 var lagedscale =  d3.scale.linear().domain([0, 350000]).range(['rgb(189,0,38)','rgb(128,0,38)']);
 var radadd =  d3.scale.pow().domain([0, 350000]).range([1.2,1.35]);
transform = function(d){
  d = new google.maps.LatLng(d.GoogleLat, d.GoogleLng);
  d = projection.fromLatLngToDivPixel(d);
  return d3.select(this).style('left', (d.x - padding) + 'px').style('top', (d.y - padding) + 'px');
};
ifdead = function(it, iftrue, iffalse){
  if (2 > 0) {
    return iftrue;
  } else {
    return iffalse;
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
    'r': function(it){
      
      return String(rad * radadd(it.lag_seconds*60) + 'px')

    }
  }).style({
    'fill': function(it){

      return lagedscale((it.lag_seconds)*60);
    },
    'position': 'absolute',
    'opacity': function(it){
      return ifdead(it, .8, .8);
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
      return ifdead(it, 1, 1);
    }
  });                       
};

updateGraph = function(){
  var dt;
  lngDim.filterRange([overlaysouthWest.lng()-safetyW*1 , overlaynorthEast.lng()+safetyW*1 ]);
  latDim.filterRange([overlaysouthWest.lat()-safetyH*1, overlaynorthEast.lat()+safetyH*1]);

  dt = gPrints.selectAll('circle').data(lngDim.top(Infinity));
  dt.enter().append('circle').call(setCircle);
  // dt.call(setCircle);
    var bounds = map.getBounds();
    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();

    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
  dt.exit().remove();

};


$http.get('api/things/carData').success(function(result){

  scope.updateData = function ( searchText ){

    scope.showSimpleToast('Searching Splunk for your query!')

  scope.loading = false;
$http.post('api/things/query', {query: scope.searchText + getRanges(savedLat, savedLng) , age : scope.age, ems : scope.ems, death: scope.death }).success(function(result){
    if(!result.out.length){
          scope.showSimpleToast('No results were found!')
    }

    scope.loading = true ;
  ndx = crossfilter(result.out);
  all = ndx.groupAll();

  lngDim = ndx.dimension(function(it){
    return it.GoogleLng;
  });

  latDim = ndx.dimension(function(it){
    return it.GoogleLat;
  });


    overlay.draw();
})

}


function getRanges(lats, lngs){
  var out = ' | search longitud>' + lngs[0]+ ' | search longitud<' +lngs[1] +' | search latitude>' +lats[0] +' | search latitude<' + lats[1]

  return out;
} 

function getUpdated(lats, lngs){

var out = getRanges(lats, lngs);
scope.loading = false;
$http.post('api/things/query', {query: scope.searchText + out , age : scope.age, ems : scope.ems, death: scope.death }).success(function(result){


    scope.loading = true ;
  ndx = crossfilter(result.out);
  all = ndx.groupAll();

  lngDim = ndx.dimension(function(it){
    return it.GoogleLng;
  });

  latDim = ndx.dimension(function(it){
    return it.GoogleLat;
  });


    overlay.draw();
})

}


  scope.loading = true ;
  var tsvBody = result.out
  scope.homeData = result.home
  var deadData, barPerdoa, barPerWeekDay, barPerHour, barAccidoa, barAcciWeekDay, ndx, all, accidoa, acciWeekDay, acciHour, deathdoa, deathWeekDay, deathHour, barMt, barWk, barHr, marginMt, marginWk, marginHr, navls, navidx, nav;
  // deadData = [];


  ndx = crossfilter(tsvBody);

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
data20000 = _.sample(lngDim.top(Infinity),1000);
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

    // console.log([overlaysouthWest.lng()-safetyW*2 , overlaynorthEast.lng()+safetyW*2 ])
    // console.log([overlaysouthWest.lat()-safetyH*3, overlaynorthEast.lat()+safetyH*3])
//TODO

    if (map.getZoom() == startzoom){

      savedLat = ([overlaysouthWest.lat()-safetyH*3, overlaynorthEast.lat()+safetyH*3]);
      savedLng = ([overlaysouthWest.lng()-safetyW*2 , overlaynorthEast.lng()+safetyW*2 ]);
    }




    lngDim.filterRange([overlaysouthWest.lng()-safetyW*2 , overlaynorthEast.lng()+safetyW*2 ]);
    latDim.filterRange([overlaysouthWest.lat()-safetyH*3, overlaynorthEast.lat()+safetyH*3]);
 
 //    	if(data20000.length == 0 ){
 //    	lngDim.filterAll();
	// 	latDim.filterAll();
	// }
		_data = lngDim.top(Infinity);//randomCrash();

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

      dt = gPrints.selectAll('circle').data(_data);
      dt.enter().append('circle'); //.call(setCircle)
      dt.call(setCircle);
      //  returning the bounds 
	var bounds = map.getBounds();
    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();

    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
   
    return dt.exit().remove();

    };
    

  };
  // barPerdoa = dc.barChart('#Deathdoa');
  // barPerWeekDay = dc.barChart('#DeathWeekDay');
  // barPerHour = dc.barChart('#DeathHour');
  // barAccidoa = dc.rowChart('#Accidoa');



  all = ndx.groupAll();
// var doadeck = {0:"At Hospital", 7:"Died at Scene", 8:"Died En Route", 9:"Unknown" }
//   doaDim = ndx.dimension(function(it){

//  return doadeck[ Number( it['doa']) ]
    
//   });

  lngDim = ndx.dimension(function(it){
    return it.GoogleLng;
  });

  latDim = ndx.dimension(function(it){
    return it.GoogleLat;
  });

  // accidoa = doaDim.group().reduceCount();

  // deathdoa = doaDim.group().reduceSum(function(it){
  //   return it.dead;
  // });
  // deathWeekDay = weekdayDim.group().reduceSum(function(it){
  //   return it.dead;
  // });
  // deathHour = hourDim.group().reduceSum(function(it){
  //   return it.dead;
  // });
//   barMt = 350;
//   barWk = 270;
//   barHr = 550;
//   marginMt = {
//     'top': 10,
//     'right': 10,
//     'left': 30,
//     'bottom': 20
//   };
//   marginWk = marginMt;
//   marginHr = marginMt;

//   dash_h = 655;
//   dash_w = 200;
//   ttestcon = d3.select('#ttest').append('svg')
//   .attr('width', dash_w)
//   .attr('height', dash_h);


//           var dash_back = ttestcon.append('rect')
//               .attr({x:0, y:0, width: dash_w, height: dash_h , fill: 'gray', opacity: 0.5});

// var startsvg = ttestcon.append('svg').attr('height', dash_h).attr('width', dash_w)

updateview1 = function(){
scope.box1Mean = rect1_mean.toFixed(3);
// scope.box1SD = Math.sqrt(rect1_var).toFixed(3);
scope.box1N = rect1_n; 
}

   updateview2 = function(){
scope.box2Mean = rect2_mean.toFixed(3);
// scope.box2SD = Math.sqrt(rect2_var).toFixed(3);
scope.box2N = rect2_n; 
} 


scope.addbox1 = function (){
  bounds2 = new google.maps.LatLngBounds(
    (overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(684,412.9999999998836)) ),
    (overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(747,345.9999999999418)) )
  ); 
    rectangle.setOptions({bounds:bounds2 })
    addrect1();
  }


scope.addbox2 = function(){
  bounds2 = new google.maps.LatLngBounds(
    (overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(684,412.9999999998836)) ),
    (overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(747,345.9999999999418)) )
  ); 
  rectangle2.setOptions({bounds:bounds2 })

     addrect2();

  }

// clicktext1 = startsvg.append('text').text('Add')
//                 .attr('x', 40 )
//                 .attr('y', 60 + downy )
//                 .attr( 'text-align', 'center')
//                 .attr('class', 'muted')
// clicktext2 = startsvg.append('text').text('Add')
//                 .attr('x', 135 )
//                 .attr('y', 60  + downy)
//                 .attr( 'text-align', 'center')
//                 .attr('class', 'muted')

//       var enterrect1 = startsvg.append('rect')
//           .attr({x:10, y: 10 + downy, width: 85, height: 85, fill: '#3182bd'}).on('click',function(){
      
          
//           bounds2 = new google.maps.LatLngBounds(
//             (overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(684,412.9999999998836)) ),
//             (overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(747,345.9999999999418)) )
//           ); 
//           rectangle.setOptions({bounds:bounds2 })

//           if (clicktext1.attr("x") != 27 ){
//              addrect1();
//           clicktext1.text('Remove').attr('x', 27 );
//         } else {
//             removerect1();
//             clicktext1.text('Add').attr('x', 40);
//         }

//           }).attr({ opacity: 0.5});


//             var enterrect2 = startsvg
//       .append('rect')
//       // dash_h - 90 - 5
//           .attr({x:105, y: 10 + downy, width: 85, height: 85, fill: '#3182bd'}).on('click',function(){

     
//           bounds2 = new google.maps.LatLngBounds(
//             (overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(684,412.9999999998836)) ),
//             (overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(747,345.9999999999418)) )
//           ); 
//           rectangle2.setOptions({bounds:bounds2 })
//           if (clicktext1.attr("x") != 123 ){
//              addrect2();
//           clicktext2.text('Remove').attr('x', 123 );
//         } else {
//           clicktext2.text('Add').attr('x', 135);
//             removerect2();
            
//         }
//           }).attr({ opacity: 0.5});




             


  // barAccidoa.width(180)
  //       .height(220)
  //       .margins(marginMt)
  //       .group(accidoa)
  //       .dimension(doaDim)
  //               // .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
  //       .label(function (d) {
  //         return d.key;
  //       })
  //       .title(function (d) {
            
  //           return d.value;
  //       })
      
  //       .elasticX(true).on('filtered', function(c, f){
  //   if ( !checkoverlay(map.getZoom())) {
  //   return updateGraph();
  // }
  // })

  //       .xAxis().ticks(4);





  // dc.renderAll();




  initMap();

});

google.maps.event.addDomListener(window, 'load', initMap);
  	}
  	return {

  		link : link, 
  		restrict: 'E'


  	}


  })


function DialogController($scope, $mdDialog, $http) {


  $http.get('api/things/jobs').success(function (data){
    $scope.jobsList = (data)
  })

    $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };

}

DialogController.$inject = ['$scope', '$mdDialog', '$http']; 
angular.module('socrataApp').controller('DialogController', DialogController)




function HelloController($scope, $mdDialog, $http) {

// $scope.username = 'hhhh'
    $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };

  $scope.login = function(){
  $scope.logging = true;
  $http.post('api/things/login', {username: $scope.username || "", password: $scope.password || ""}).success(function (data){
    
    if(data === true){
      $mdDialog.hide();
      $scope.failed = false; 
    } else {
      $scope.failed = true; 
    }
    $scope.logging = false;
  })

}

}

DialogController.$inject = ['$scope', '$mdDialog', '$http']; 
angular.module('socrataApp').controller('HelloController', HelloController)


 