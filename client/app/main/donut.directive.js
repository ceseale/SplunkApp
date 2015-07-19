
angular.module('socrataApp').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

 

    angular.module('socrataApp').directive('donutChart', function(){
      function link(scope, el, attr){


        var gRatio = ((1 + Math.sqrt(5))/ 2)
        var color = d3.scale.category10();
        var data = scope.data;
        var dataOb = scope.slice;
        var width = 120 ;
        var height = 120 ;
        var min = Math.min(width, height);
        var svg = d3.select(el[0]).append('svg');
        var pie = d3.layout.pie().sort(null);
        
        var arc = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.75);

        function getData (data){
          return dataOb.getArray(scope.data);
        }
        scope.showSwitch = false;
        svg.on('mouseover',function (){

        })

        svg.attr({width: width, height: height});
        var g = svg.append('g')
          // center the donut chart
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        
        // add the <path>s for each arc slice
        var arcs = g.selectAll('path').data(pie(getData(data)))
          .enter().append('path').each(function(d) { this._current = d; })
            .attr('fill', function(d, i){ return scope.slice.colors[i] }).on('mouseover', function (d, i){
        //    svg.select("text").remove()
        // svg.append("svg:text")
        //   .attr("dy", "50%")
        //   .attr("dx", "50%")
        //   .attr("text-anchor", "middle")
        //   .style("font","bold 14px Georgia")
        //   .text(dataOb.display(dataOb.keys[i], d.value, scope.data ))
            })
            .on("mouseleave",function (d, i){
        //    svg.select("text").remove()
        // svg.append("svg:text")
        //   .attr("dy", "50%")
        //   .attr("dx", "50%")
        //   .attr("text-anchor", "middle")
        //   .style("font","bold 14px Georgia")
        //   .text(dataOb.name(data))
            });

        // svg.append("svg:text")
        //   .attr("dy", "50%")
        //   .attr("dx", "50%")
        //   .attr("text-anchor", "middle")
        //   .style("font","bold 14px Georgia")
        //   .text(dataOb.name(data))


function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}


        scope.$watch('data', function(data){

        scope.display = (dataOb.name(data))
        
          var out_data = getData(data);
          var OK = out_data.every(function (item ){
            return typeof item == 'number'
          })


          if(data && OK){
          arcs.data(pie( getData(data)  ))
          arcs.transition(100).duration(750).attrTween("d", arcTween); // redraw the arcs

        } 
        }, true);

        scope.$watch('slice', function (slice){
        	dataOb = slice; 
        	arcs.remove();
        	 arcs = g.selectAll('path').data(pie(getData(scope.data)))
          .enter().append('path').each(function(d) { this._current = d; })
            .attr('fill', function(d, i){ return scope.slice.colors[i] }).on('mouseover', function (d, i){
        scope.$apply(function ( ){        scope.display = (dataOb.display(dataOb.keys[i], d.value, scope.data ))})

            })
            .on("mouseleave",function (d, i){
            scope.$apply(function (){  scope.display = (dataOb.name(scope.data)) })
            });
          arcs.data(pie( getData(scope.data)  ))
          arcs.transition(100).duration(750).attrTween("d", arcTween); // redraw the arcs


        })

      }
      return {
        link: link,
        restrict: 'E',
        template:'<h5 style="top:35%; left: 21%; text-align: center; width:120px; position:absolute;">{{display}}</h5>',
        scope: { data: '=' , slice: '=', switchFn :'&'}
      };
    });


