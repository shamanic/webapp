shamanicWebApp.directive('sigilGallery', function($interval, $window) {
	return {
		restrict: 'E',
		templateUrl: 'javascripts/views/sigilPartial.html',
		scope: {
			images: '='
		},
		link: function(scope, element, attributes) {
			scope.nowShowing = 0;
			$interval(function showNext() {
				if(scope.nowShowing != scope.images.length - 1) {
					scope.nowShowing++;
				}
				else {
					scope.nowShowing = 0;
				}
			}, 2000);
		  scope.openSigilPage = function(index) {
			  $window.open(scope.images[index].url);
		  };

		}
	};
})
.directive('d3Map', ['$timeout', 'sigilService', function($timeout, sigilService) {

  return {
    restrict: 'E',
	  templateUrl: 'javascripts/views/mapPartial.html',
    scope: {
      data: '='
    },
    link: function(scope, element, attributes) {

      var width = 600, height = 800;

      var svg = d3.select(".main-container").append("svg")
        .attr("width", width)
        .attr("height", height);

      svg.append("rect")
        .attr("fill", function(d) {
          return bgColors();
        });
      d3.selectAll("svg").attr("id", "gradient");

      var projection = d3.geo.albers()
        .center([-5.0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(6000)
        .translate([width / 2, height / 2]);

      var path = d3.geo.path().projection(projection);

      var promise = sigilService.getMapSimple();
      promise.then(
        function(payload) {
          scope.ukTopology = payload.data;
          var subunits = topojson.feature(scope.ukTopology, scope.ukTopology.objects.subunits);
          svg.append("path")
            .datum(subunits)
            .attr("d", path);
        },
        function(errPayload) {
          console.log('failure communicating w sigilService.getMap API: ' + errPayload);
      });

      var topology = {
        type: "Topology",
        transform: {scale: [1, 1], translate: [0, 0]},
        objects: {foo: {type: "Polygon", arcs: [[0]]}, bar: {type: "Polygon", arcs: [[0, 1]]}},
        arcs: [[[0, 0], [1, 1]], [[1, 1], [-1, -1]]]
      };

      var arcs = topojson.feature(topology, topology.objects.foo);

      svg.append("circle")
         .attr("cx", 30)
         .attr("cy", 80)
         .attr("r", 20);

      // scope.$watch('data', function(newVal) {
      //   if(newVal) { var subunits = topojson.feature(scope.ukTopology, scope.ukTopology.objects.subunits); }
      // }, true);

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

          if ($ === undefined) {
			return;
		  }

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

          $('#gradient').css({
            background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
          }).css({
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
      };
      function transition(path) {
        path.transition()
          .duration(7500)
          .attrTween("stroke-dasharray", tweenDash)
          .each("end", function() {
            d3.select(this).call(transition);
          });
      };
      function tweenDash() {
        var l = this.getTotalLength(),
          i = d3.interpolateString("0," + l, l + "," + l);
        return function(t) {
          return i(t);
        }
      };
    }
  }
}]);