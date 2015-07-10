/**
 * game.js
 * 
 * @author khinds (c) shamanic.io, http://www.shamanic.io
 */
var gameController = angular.module("gameController", []);

gameController.controller("gameController", [ '$scope', '$http', function($scope, $http) {
	
	$scope.data = {};
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
	
	$scope.data.objects = {
		one: "testObject",
		two: "anotherObject"
	};

	/** populate sigils */
	$http({
		method: 'GET',
		url: '/sigils'
	}).success(function(data, status, headers, config) {
		$scope.sigilList = data;
	}).error(function(data, status, headers, config) {
		console.log('http get sigils failed. status: ' + status);
	});
} ]);
