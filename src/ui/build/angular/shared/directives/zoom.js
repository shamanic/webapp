shamanicWebApp.directive('zoom', function($interval, $window) {
  return {
    restrict: 'E',
    // templateUrl: currentScriptPath.replace('gameDirectives.js', 'sigilPartial.html'),
    template: '<button id="zoomButton" ng-class="zoomButtonClass" ng-click="zoomEnabled = !zoomEnabled; console.log("clicked the zoom button");/>',
    scope: {
      type: '@',
      zoomEnabled: '=zoom'
    },
    link: function(scope, element, attributes) {

      if(scope.zoomEnabled) {
        console.log("zoomEnabled!");
        d3.select("svg").call(d3.behavior.zoom().on("zoom", redraw));
      }

      function redraw() {
          // d3.event.translate (an array) stores the current translation from the parent SVG element
          // t (an array) stores the projection's default translation
          // we add the x and y vales in each array to determine the projection's new translation
          var tx = t[0] * d3.event.scale + d3.event.translate[0];
          var ty = t[1] * d3.event.scale + d3.event.translate[1];
          projection.translate([tx, ty]);

          // now we determine the projection's new scale, but there's a problem:
          // the map doesn't 'zoom onto the mouse point'
          projection.scale(s * d3.event.scale);

          // redraw the map
          uk.selectAll("path").attr("d", path);

          // // redraw the x axis
          // xAxis.attr("x1", tx).attr("x2", tx);

          // // redraw the y axis
          // yAxis.attr("y1", ty).attr("y2", ty);
        }
      if (scope.type == 'button') {
        scope.zoomButtonClass = 'zoom-button';
      }
    }
  };
});