/**
 * Shamanic HTML5 Web Application 
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var shamanicWebApp = angular.module('shamanicWebApp', [ 'mm.foundation', 'indexController', 'userControllers', 'gameController', 'menuControllers', 'utilitiesController', 'navigationController', 'ngRoute']);

// Intercept POST requests, convert to standard form encoding
shamanicWebApp.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $httpProvider.defaults.transformRequest.unshift(function(data, headersGetter) {
	var key, result = [];
	for (key in data) {
	    if (data.hasOwnProperty(key)) {
		if (typeof (data[key]) == "undefined")
		    data[key] = '';
			result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
	    }
	}
	return result.join("&");
    });

  //match basecamp_icon requests at the correct url, and use the right template and controller
  $routeProvider.when('/game/basecamp/:basecamp_icon', {
    templateUrl: 'ui/js/views/basecamp.html',
    controller: 'gameController'
  })
  .otherwise({ redirectTo: '/' });
}]);

/**
 * Game Controllers
 *
 * @author khinds, davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var gameController = angular.module("gameController", ['gameAssetService', 'terraService', 'Sigil', 'Basecamp']);
gameController.controller("gameController", [ '$scope', '$routeParams', 'gameAssetService', 'Sigil', 'Basecamp', 'terraService', function($scope, $routeParams, gameAssetService, Sigil, Basecamp, terraService) {

	var ctrl = this;
	$scope.username = window.username;
	console.log('username from session: ' + req.session.user.username);

	$scope.xAndyTracker = function(ev) {
		$scope.X = ev.offsetX;
		$scope.Y = ev.offsetY;
	};
	
	$scope.fireClick = function(event) {
        $scope.X = event.offsetX;
        $scope.Y = event.offsetY;
        $scope.inOrOut = true;
	};

	$scope.zoomButtonClicked = function() {
		$scope.zoomEnabled = !$scope.zoomEnabled;
		console.log('clicked zoomButton, zoomEnabled: ' + $scope.zoomEnabled);
	};

	$scope.terrafy = function() {
		terraService();
	};

	ctrl.sigilpack = new Sigil($scope.username);

	ctrl.sigilpack.getSigilsSimple()
		.then(function(payload) {
			$scope.restImageList = payload.data;
			console.log('from inside getSigilsSimple promise: ' + JSON.stringify(payload.data) + ' and scope.restImageList: ' + JSON.stringify($scope.restImageList));
		},
		function(errPayload) {
			console.log('failure communicating w gameAssetService API: ' + errPayload);
		});

	ctrl.sigilpack.getSigilsByUser()
		.then(function(payload) {
			$scope.userImageList = ctrl.sigilpack.properties;
			console.log('userImageList, just before basecamp obj call: ' + JSON.stringify($scope.userImageList));
		},
		function(errPayload) {
			console.log('failure getting user\'s sigilpack: ' + errPayload.data);
		});

	var basecamp = new Basecamp($scope.username);
	basecamp.getBasecampSimple().then(function() {
		$scope.basecampObj = basecamp.properties;
		console.log(JSON.stringify($scope.basecampObj));
	});

	$scope.basecamp_icon = $routeParams.basecamp_icon;
	console.log('basecamp_icon: ' + $scope.basecamp_icon);

	// gameAssetService.getSigils.success(function(data) {
	//   console.log('controller succeeded in getting map data');
	//   $scope.mapData = data;
	//   console.log('mapData from controller: ', $scope.mapData);
	// });
	// function getSigils() {
	// 	gameAssetService.getSigils()
	// 		.then(function(result) {
	// 			this.restImageList = result.data;
	// 		});
	// }
	// getSigils();

}]);

/**
 * Main Index Controllers
 *
 * @author khinds, davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var indexController = angular.module("indexController", []);

indexController.controller("indexController", [ '$scope', '$http', function($scope, $http) {
	
} ]);

/**
 * Menu Controllers 
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var menuControllers = angular.module("menuControllers", []);
menuControllers.controller("menuController", [ '$scope', '$http', function($scope, $http) {
	
} ]);

/**
 * User Controllers
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var userControllers = angular.module("userControllers", []);

// login controller
userControllers.controller("loginController", [ '$scope', '$http', function($scope, $http) {

	// setup the default form validation values
	$scope.showValidationMessages = false;
	$scope.userNotFound = false;

	// user submit form, show errors if present
	$scope.submit = function(isFormValid) {
		$scope.showValidationMessages = true;

		// if valid form, check if the user account exists for given password
		if (isFormValid) {
		    $http({
			    url : '/user/checkLogin',
			    method : "POST",
			    data : {
				    'username' : $scope.username,
				    'password' : $scope.password
			    }
		    }).then(function(response) {

			    // if no user then show the user not found message, else we go to account page
			    $scope.userNotFound = false;
			    if (response.data != "user login sucessful") {
				    $scope.userNotFound = true;
				    return;
			    }
			    window.location = "/user/account";
		    }, function(response) {
			    isFormValid = false;
		    });
		}
	};
} ]);

// signup controller
userControllers.controller("signupController", [ '$scope', '$http', function($scope, $http) {

	// setup the default form validation values
	$scope.showValidationMessages = false;
	$scope.passwordMatch = true;

	// user submit form, show errors if present
	$scope.submit = function(isFormValid) {

		$scope.showValidationMessages = true;

		// make sure the passwords match
		$scope.passwordMatch = true;
		if ($scope.password != $scope.confirm) {
			$scope.passwordMatch = false;
			isFormValid = false;
		}

		// if valid form, now we have to check for unique user names and email addresses
		if (isFormValid) {
			$scope.showEmailTakenError = false;
			$scope.showUserTakenError = false;
			var values = {
				email : $scope.email,
				username : $scope.username
			};
			angular.forEach(values, function(value, key) {
				$http({
					url : '/user/checkExistingValue',
					method : "POST",
					data : {
						property : key,
						value : value
					}
				}).then(function(response) {
					if (response.data === 'value exists') {
						if (key == 'email') {
							$scope.showEmailTakenError = true;
						} else {
							$scope.showUserTakenError = true;
						}
						isFormValid = false;
					}

					// submit the create user form after the 2nd validation has finished
					if (key === 'username' && isFormValid) {
						document.forms.signupform.submit();
					}

				}, function(response) {
					isFormValid = false;
				});
			});
		}
	};
} ]);

// manage user account controller
userControllers.controller("userAccountController", [ '$scope', '$http', function($scope, $http) {

	// default values for the user submit form messages
	$scope.showAccountForm = false;
	$scope.showValidationMessages = false;
	$scope.fullname = window.fullname;
	$scope.showUpdateMessage= false;
	$scope.updateMessage = '';

	// user submit form, show errors if present
	$scope.submit = function(isFormValid) {
		$scope.showValidationMessages = true;

		// make sure the passwords match
		$scope.passwordMatch = true;
		if ($scope.password != $scope.confirm) {
			$scope.passwordMatch = false;
			isFormValid = false;
		}

		// if valid form submission then save user data and show success/fail message
		if (isFormValid) {

			// default the user submit form messages
			$scope.showUpdateMessage= false;
			$scope.updateMessage = '';

			$http({
				url : '/user/update',
				method : "POST",
				data : {
					fullname : $scope.fullname,
					password : $scope.password
				}
			}).then(function(response) {
				$scope.showUpdateMessage= true;
				$scope.updateMessage = response.data;
				$scope.showAccountForm = false;
			});
		}
	};
} ]);

// forgot controller
userControllers.controller("forgotController", [ '$scope', '$http', function($scope, $http) {

	// setup the default form validation values
	$scope.showValidationMessages = false;
	$scope.userNotFound = false;
	$scope.passwordReset = false;

	// user submit form, show errors if present
	$scope.submit = function(isFormValid) {

		$scope.showValidationMessages = true;
		$scope.userNotFound = false;

		// if they didn't put anything in the fields, then we're not found
		if ((typeof($scope.username) === 'undefined' || $scope.username === '') && (typeof($scope.email) === 'undefined' || $scope.email === '')) {
			$scope.userNotFound = true;
			isFormValid = false;
		}
		
		// if valid form, check if the user account exists for given email or username
		if (isFormValid) {
		    $http({
			    url : '/user/checkForgot',
			    method : "POST",
			    data : {
				    'username' : $scope.username,
				    'email' : $scope.email
			    }
		    }).then(function(response) {
		    	if (response.data == 'user password recovered') {
		    		$scope.passwordReset = true;
		    	} else {
		    		$scope.userNotFound = true;
		    	}
		    });
		}
	};
} ]);

/**
 * Utilities Controller
 * 	utilities page angular resources
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var utilitiesController = angular.module("utilitiesController", []);

utilitiesController.controller("statsController", ['$scope', '$http', function($scope, $http) {
  $http.get('/utilities/getAllLocations')
  .then(function(payload) {
    $scope.locations = payload.data;
  },
  function(errPayload) {
    console.log('failure communicating w sigilService API: ' + errPayload);
  });
}]);

 /**
 * navigation.js
 * 	controller for main site navigation
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var navigationController = angular.module("navigationController", []);
navigationController.controller("navigationController", [ '$scope', '$http', function($scope, $http) {
	
}]);

/**
 * Appear Button Directive
 * 	a general clickable element located throughout the game to "appear" at a certain location, persist your lat/long & elevation
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
shamanicWebApp.directive('appearButton', function() {
	return {
		restrict: 'E',
    scope: {
      type:'@'
    },
		template: '<span ng-show="showThisButton" ng-class="appearButtonClass" ng-click="saveLocation()"><a>{{message}}</a></span>',
		controller:function($scope, $http){

			// save location, user clicked the appear element
			$scope.message = 'Appear (check in)';
			$scope.saveLocation = function() {
				$http({
				  method: 'POST',
				  url: '/user/saveLocation',
				  data: { lat: window.latitude, long: window.longitude, elevation : window.elevation }
				}).then(function successCallback(response) {
					if (response.data == "saved") {
						$scope.message = 'Location Saved';
					}
				}, function errorCallback(response) {
					$scope.message = 'Location could not be saved';
				});
			};

			// show button if they user is logged in
			$scope.showThisButton = false;
			$http({
			  method: 'GET',
			  url: '/user/isLoggedIn'
			}).then(function successCallback(response) {
				if (response.data == "true") {
					$scope.showThisButton = true;
				}
			}, function errorCallback(response) {});
	    },
		link: function(scope, element, attributes) {
			if (scope.type == 'button') {
				scope.appearButtonClass = 'appear-button';
			}
		}
	};
});

shamanicWebApp.directive('basecampButton', function() {
  return {
    restrict: 'E',
    scope: {
      type:'@'
    },
    template:'<span ng-show="showThisButton" ng-class="basecampButtonClass" ng-click="assignBasecamp()"><a>{{message}}</a></span>',
    controller: function($scope, $http) {
      $scope.showThisButton = true;

      if($scope.basecampObj === null || $scope.basecampObj === undefined) {
        $scope.message = "you haven\'t assigned a basecamp yet. Do so now?";
      } else {
        $scope.message = "Change Basecamp";
      }

      $scope.assignBasecamp = function() {
        // need some logic to see if, of any of the location_metadata rows for this user, there's one with is_basecamp = true
        if(1==1) {
          // $http({
          //   method: 'POST',
          //   url: '/user/assignNewBasecamp',
          //   data: {
          //     location:'666'
          //   }
          // }).then(function successCallback(response) {
          //   if(response.data == "OK") {
          //     $scope.showThisButton = false;
          //     $scope.message = "fkn success yall!";
          //     console.log('basecamp success!');
          //   }
          // }, function errorCallback(response) {
          //   console.log('basecamp error..:' + JSON.stringify(response));
          // });
          console.log("http POSTing to assignNewBasecamp");
        } else {
          console.log("http POSTing to updateBasecamp");
          // $http({
          //   method: 'POST',
          //   url: '/user/updateBasecamp',
          //   data: {
          //     location:'666'
          //   }
          // }).then(function successCallback(response) {
          //   if(response.data == "OK") {
          //     $scope.showThisButton = false;
          //     $scope.message = "fkn success yall!";
          //     console.log('basecamp success!');
          //   }
          // }, function errorCallback(response) {
          //   console.log('basecamp error..:' + JSON.stringify(response));
          // });
        }

      };

      //more controller logic
    },
    link: function(scope, element, attributes) {
      // linking logic, maybe necessary?
      if(scope.type == 'button') {
        scope.basecampButtonClass = 'basecamp-button';
      }
    }
  };
});

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

	      //console.log('elem: ' + JSON.stringify(element[0]));

	      var width = document.body.clientWidth - 160, height = document.body.clientHeight - 160;
	      // var width = element[0].offsetWidth, height = element[0].offsetHeight;


	      var svg = d3.select("d3-map").append("svg")
	        .attr("width", width)
	        .attr("height", height);

	      // svg.attr("ng-mousemove", "xAndyTracker($event)");
	      // svg.attr("ng-mousemove", "xAndyTracker($event)");
	      svg.call(d3.behavior.zoom().on("zoom", redraw));


	      if(scope.zoomEnabled) {
        	console.log("zoomEnabled...");
        	svg.call(d3.behavior.zoom().on("zoom", redraw));
          }

	      svg.append("rect")
	        .attr("fill", function(d) {
	          //return bgColors();
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

	      var promise = gameAssetService.getMapSimple();
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

shamanicWebApp.directive('grid', function() {
    return {
        replace: true,
        restrict: 'E',
        template: "<canvas id='xyCanvas'></canvas>",
        scope: {
            width:'@',
            height:'@'
        },
        link: function(scope, element, attributes) {

            d3.selectAll("canvas").attr("width", 600).attr("height", 800);
            var canvas = document.getElementById('xyCanvas');
            var ctx = canvas.getContext("2d");
            var cty = canvas.getContext("2d");

            element.bind('mousemove', function(event) {
                drawBackground();
                draw(event.x, event.y);
            });

            function draw(mouseX, mouseY) {

                // fixes offset caused by event.clientX and the canvas element
                // having different origins for their coordinate systems:
                var xCoord = mouseX - canvas.getBoundingClientRect().left;
                var yCoord = mouseY - canvas.getBoundingClientRect().top;

                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.lineWidth = 0.1;
                ctx.moveTo(xCoord, 0);
                ctx.lineTo(xCoord, canvas.height);
                ctx.stroke();
                ctx.closePath();

                cty.beginPath();
                cty.strokeStyle = "black";
                cty.lineWidth = 0.1;
                cty.moveTo(0, yCoord);
                cty.lineTo(canvas.width, yCoord);
                cty.stroke();
                cty.closePath();
            }

            function drawBackground() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            function detectIntersections() {
                // TODO: This is enormously complicated.. or at least, requires a lot of code.
            }
        }
    };
});

/**
 * Location Tracker Directive
 * 	persist user's current lat/long and elevation to global scope, to eventually insert into db
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
shamanicWebApp.directive('locationTracker', function() {
	return {
		restrict: 'E',
		controller:function($scope, $http){
		    $scope.savePosition = function(position) {
		    	window.latitude = position.coords.latitude;
		    	window.longitude = position.coords.longitude;
		    	$http({
					  method: 'GET',
					  url: '/user/getAltitude?lat=' + window.latitude + '&long=' + window.longitude
					}).then(function successCallback(response) {
						window.elevation = response.data;
				}, function errorCallback(response) {});
		    };
		    if (navigator.geolocation) {
		    	navigator.geolocation.getCurrentPosition($scope.savePosition);
		    }
	    },
		link: function(scope, element, attributes) {
		}
	};
});

/**
 * Scrolled Element Directive
 * 	any element can have an angular "scrolled" state
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
shamanicWebApp.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 100) {
                 element.addClass('scrolled');
             } else {
                 element.removeClass('scrolled');
             }
        });
    };
});

/**
 * sigils.js
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;
shamanicWebApp.directive('sigilGallery', function($interval, $window) {
	return {
		restrict: 'E',
    templateUrl: 'ui/js/views/sigilPartial.html',
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
});

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
var Basecamp = angular.module('Basecamp', []);

Basecamp.factory('Basecamp', [ '$http', function($http) {
  var Basecamp = function (id) {
    this.id = id;
    this.properties = null;
  };

  Basecamp.prototype.getBasecampSimple = function() {
    var self = this;
    return $http({method: 'GET',
                  url: 'game/basecamp/' + this.id})
            .then(function(response) {
              // console.log(JSON.stringify(response));
              self.properties = response.data;
              return response;
            }, function(response) {
              self.properties = response.data || "Request failed";
              return response;
            });
  };
  return Basecamp;
}]);

// (function() {
  var Sigil = angular.module('Sigil', []);

  Sigil.factory('Sigil', [ '$http', function($http) {
    function Sigil(name) {
      this.name = name;
      this.properties = null;
    }

    Sigil.prototype.getSigilsByUser = function() {
      var self = this;
      return $http.get('game/userSigils/' + this.name)
                  .then(function(response) {
                    self.properties = response.data;
                    return response;
                  }, function(response) {
                    self.properties = response.data || "Request failed";
                    return response;
                  });
    };

    Sigil.prototype.getSigilsSimple = function() {
      return $http.get('game/sigils');
    };
    return Sigil;
  }]);
// }());
/**
 * Game Asset Service
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var gameAssetService = angular.module('gameAssetService', []);

gameAssetService.factory('gameAssetService', ['$http', function($http) {
//return $http.get('http://overpass-api.de/api/interpreter?data=[out:json];(node(51.249,7.148,51.251,7.152);<;);out;')
  var basecamp_icon = window.fullname;

  return {
    getMapSimple: function() {
      return $http.get('https://bost.ocks.org/mike/map/uk.json');
      // .success(function(data) {
      //   return data;
      // })
      // .error(function(err) {
      //   return err;
      // });
    },
    getMapRobust: function() {

    },
    getSigilsSimple: function() {
      return $http.get('game/sigils');
      // .success(function(data) {
      //   console.log("get success: " + data);
      //   return data;
      // })
      // .error(function(err) {
      //   console.log("get failed: " + err);
      //   return err;
    },
    getSigilsRobust: function() {

    },
    getBasecampLocation: function() {
        console.log('inside getBasecamp location: ' + basecamp_icon);
      return $http.get('game/basecamp/' + basecamp_icon//,
        //{params: { user_id: user.id }
      //}
      );
      
    }
  };
}]);

/**
 * Terra Service
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var terraService = angular.module('terraService',[]);
terraService.factory('terraService', ['$window', '$timeout', function($window, $timeout) {
  var width, height;
  var cyclic = {};
  $timeout(function() {

    width = d3.select("svg#gradient").attr("width");
    height = d3.select("svg#gradient").attr("height");
    cyclic = new terra.Terrarium((width / 10), (height / 10), {
      "id":"terraCycle",
      cellSize: width / 100,
      insertAfter: document.getElementById("stuffFromDavid"),
      periodic:true
    });
    cyclic.grid = cyclic.makeGrid('cyclic');
    cyclic.animate();

  }, 5000);

  var cycles = [];

  cycles.push(cyclic);

  return function() {
    terra.registerCA({
    type: 'cyclic',
    colors: ['255,0,0,0.1', '255,96,0,1', '255,191,0,0.2', '223,255,0,1', '128,255,0,0.3', '32,255,0,1', '0,255,64,0.4', '0,255,159,1',
           '0,255,255,0.5', '0,159,255,1', '0,64,255,0.6', '32,0,255,1', '127,0,255,0.7', '223,0,255,1', '255,0,191,0.8', '255,0,96,1'],
    colorFn: function () { return this.colors[this.state];},
    process: function (neighbors, x, y) {
      var next = (this.state + 1) % 16;
      var changing = neighbors.some(function (spot) {
        return spot.creature.state === next;
      });
      if (changing) this.state = next;
      return true;
    }
  }, function () {
    this.state = Math.floor(Math.random() * 16);
  });


  // msgs.push(msg);
  //  if (msgs.length == 3) {
  //    win.alert(msgs.join("\n"));
  //    msgs = [];
  //  };
 };
}]);
