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
		    if (typeof (data[key]) === "undefined") {
		      data[key] = '';
        }
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
