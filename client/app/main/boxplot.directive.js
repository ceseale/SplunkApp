
    angular.module('socrataApp').directive('boxPlot', function(){
      function link(scope, el, attr){





var margin = {top: 10, right: 50, bottom: 20, left: 50},
    width = 120 - margin.left - margin.right,
    height = 268 - margin.top - margin.bottom;

var min = Infinity,
    max = -Infinity;

var chart = d3.box()
    .whiskers(iqr(Number (scope.outScale) || 1.5  ))
    .width(width)
    .height(height);

d3.csv("morley.csv", function(error, csv) {
  if (error) throw error;

  var data = [scope.data] 
  // var data =[];


  // csv.forEach(function(x) {
  //   var e = Math.floor(x.Expt - 1),
  //       r = Math.floor(x.Run - 1),
  //       s = Math.floor(x.Speed),
  //       d = data[e];
  //   if (!d) d = data[e] = [s];
  //   else d.push(s);
  //   if (s > max) max = s;
  //   if (s < min) min = s;
  // });
  chart.domain([d3.min(data[0]), d3.max(data[0])] );

  // chart.domain([620, 1070]);
  // chart.domain([min, max]);

  var svg = d3.select(el[0]).selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "box")
      .attr("width", 268)
      .attr("height", 88)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")" + " rotate(90 90 113)")
      .call(chart);
var check = false;
var check2 = false;
scope.$watch('data', function (data){
  
  if (check && data.length){
  chart.domain([d3.min(data), d3.max(data)] );
  svg.datum(data).call(chart.duration(1000));
} else{
  check = true;
}
  check = true;

}, true) 

scope.$watch('out', function (out){

    if (check2 && data.length){
  chart.whiskers(iqr(Number (scope.out) || 1.5  ))
  svg.datum(scope.data).call(chart.duration(1000));
} else {
  check2 = true ;
}

}, true )


  // setInterval(function() {
  //   svg.datum(randomize).call(chart.duration(1000));
  // }, 2000);


});

function randomize(d) {
  if (!d.randomizer) d.randomizer = randomizer(d);
  return d.map(d.randomizer);
}

function randomizer(d) {
  var k = d3.max(d) * .02;
  return function(d) {
    return Math.max(min, Math.min(max, d + k * (Math.random() - .5)));
  };
}


// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;

            scope.med = d.quartiles[1].toFixed(2)
            scope.count = j;
            scope.iqr = (q3 - q1).toFixed(2);

    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}


      }
      return {
        link: link,
        restrict: 'E',
        template:'<h5 style="text-align: center;" > <b>Count</b>:{{count}} <b>Median</b>:{{med}} <b>IQR</b>:{{iqr}}</h5>',
        scope: { data: '=' , out : '=' }
      };
    });
