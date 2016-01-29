/**
 * appear.js
 * 	a general clickable element located throughout the game to "appear" at a certain location, persist your lat/long & elevation 
 *
 * @author khinds (c) shamanic.io, http://www.shamanic.io
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
				  data: { lat: window.latitude, long: window.latitude, elevation : window.elevation }
				}).then(function successCallback(response) {
					if (response.data == "saved") {
						$scope.message = 'Location Saved';
					}
				}, function errorCallback(response) {
					$scope.message = 'Location could not be saved';
				});
			}
			
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