/**
 * location.js
 * 	persist user's current lat/long and elevation to global scope, to eventually insert into db
 *
 * @author khinds (c) shamanic.io, http://www.shamanic.io
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