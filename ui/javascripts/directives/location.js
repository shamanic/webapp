/**
 * location.js
 * 	persist to global scope user's current lat/long and elevation to save later 
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
		    }
		    if (navigator.geolocation) {
		    	navigator.geolocation.getCurrentPosition($scope.savePosition);
		    }
	    },
		link: function(scope, element, attributes) {
		}
	};
});
