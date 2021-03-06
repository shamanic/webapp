/**
 * D3 Map Directive
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
shamanicWebApp.directive('d3Map', ['gameAssetService', function(gameAssetService) {
	  return {
	    restrict: 'E',
		  template: '<div class="d3map"></div>',
	    scope: {
	      data: '=',
	      zoomEnabled: '=d3Map'
	    },
	    link: function(scope, element, attributes) {
				// ,
	   		//    eventHandler: '&ngMousemove'
	   		// ng-mousemove="eventHandler()"

	      console.log('elem: ' + JSON.stringify(element[0]));

	      var width = document.body.clientWidth - 160, height = document.body.clientHeight - 160;
	      // var width = element[0].offsetWidth, height = element[0].offsetHeight;


	      var svg = d3.select("d3-map").append("svg")
	        .attr("width", width)
	        .attr("height", height);

	      svg.attr("ng-mousemove", "xAndyTracker($event)");
	    //   svg.attr("ng-mousemove", "xAndyTracker($event)");
	      svg.call(d3.behavior.zoom().on("zoom", redraw));


	      if(scope.zoomEnabled) {
        	console.log("zoomEnabled...");
        	svg.call(d3.behavior.zoom().on("zoom", redraw));
          }

	      svg.append("rect")
	        .attr("fill", function(d) {
	          return bgColors();
	        });
	      d3.selectAll("svg").attr("id", "gradient");

	      var uk = svg.append("svg:g").attr("id", "uk");

	      var projection = d3.geo.albers()
	        .center([-5.0, 55.4])
	        .rotate([4.4, 0])
	        .parallels([50, 60])
	        .scale(6000)
	        .translate([width / 2, height / 2]);

	      var path = d3.geo.path().projection(projection);

	      var t = projection.translate(); // the projection's default translation
	      var s = projection.scale(); // the projection's default scale
	      var subunits = {};

	      var promise = gameAssetService.getMapSimple(); //getMapRobust();
	      promise.then(
	        function(payload) {
	          scope.ukTopology = payload.data;
	          subunits = topojson.feature(scope.ukTopology, scope.ukTopology.objects.subunits);
	          uk.append("path")
	            .datum(subunits)
	            .attr("d", path);
	        },
	        function(errPayload) {
	          console.log('failure communicating w gameAssetService.getMap API: ' + errPayload);
	      });
	      // document.getElementsByTagName("svg").onmousemove = function() {
	      // 	console.log('x: ' + e.PageX);
	      // 	document.getElementById("xes").innerHTML = JSON.stringify(e.PageX);
	      // 	document.getElementById("yes").innerHTML = JSON.stringify(e.PageY);
	      // };

	      /*
	      from http://bl.ocks.org/biovisualize/2322933
	      Zoom/pan map example: integrates d3.geo and d3.behavior
	      Iain Dillingham, http://dillingham.me.uk/
	      With help from Jason Davies, http://www.jasondavies.com/
	      */
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

	      //excellent function from Mario Klingemann http://codepen.io/quasimondo/pen/lDdrF
	      function bgColors() {
	        var colors = new Array(
	          [62, 35, 255], [60, 255, 60], [255, 35, 98], [45, 175, 230], [255, 0, 255], [255, 128, 0]);

	        var step = 0;
	        //color table indices for:
	        // current color left
	        // next color left
	        // current color right
	        // next color right
	        var colorIndices = [0, 1, 2, 3];

	        //transition speed
	        var gradientSpeed = 0.002;

	        function updateGradient() {

	          var c0_0 = colors[colorIndices[0]];
	          var c0_1 = colors[colorIndices[1]];
	          var c1_0 = colors[colorIndices[2]];
	          var c1_1 = colors[colorIndices[3]];

	          var istep = 1 - step;
	          var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
	          var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
	          var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
	          var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

	          var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
	          var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
	          var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
	          var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

	          d3.select('#gradient').style({
	            background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
	          }).style({
	            background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
	          });

	          step += gradientSpeed;
	          if (step >= 1) {
	            step %= 1;
	            colorIndices[0] = colorIndices[1];
	            colorIndices[2] = colorIndices[3];

	            // pick two new target color indices, do not pick the same as the current one
	            colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
	            colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
	          }
	        }
	        setInterval(updateGradient, 10);
	      }
	      function transition(path) {
	        path.transition()
	          .duration(7500)
	          .attrTween("stroke-dasharray", tweenDash)
	          .each("end", function() {
	            d3.select(this).call(transition);
	          });
	      }
	      function tweenDash() {
	        var l = this.getTotalLength(),
	          i = d3.interpolateString("0," + l, l + "," + l);
	        return function(t) {
	          return i(t);
	        };
	      }
	    }
	  };
}]);
