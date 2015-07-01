/**
 * game.js
 * 
 * @author khinds (c) shamanic.io, http://www.shamanic.io
 */
var gameController = angular.module("gameController", []);

gameController.controller("gameController", [ '$scope', '$http', function($scope, $http) {
	console.log('game js here');
	$scope.sigilList = [];
	$scope.imageList = [
		{
			url: 'http://placekitten.com/201/201',
			name: 'sigilOne'
		},
		{
			url: 'http://placekitten.com/201/203',
			name: 'sigilTwo'
		}
	];
	$scope.objects = {
		one: "testObject",
		two: "anotherObject"
	};
	$http({
		method: 'GET',
		url: '/sigils'
	}).success(function(data, status, headers, config) {
		console.log('http get sigils succeeded, ' + data.length + ' sigils retrieved');
		$scope.sigilList = data;
		console.log($scope.sigilList.length + ' sigils in the gameController\'s $scope');
	}).error(function(data, status, headers, config) {
  	console.log('http get sigils failed. status: ' + status);
	});
} ])
.directive('sigilGallery', function($interval, $window) {
	return {
		restrict: 'A',
		templateUrl: '../../../views/pages/partials/sigilPartial.html',
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
		}
		}
	};
});
