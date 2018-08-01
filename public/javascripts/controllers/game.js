/**
 * game.js
 * 
 * @author khinds (c) shamanic.io, http://www.shamanic.io
 */
var gameController = angular.module("gameController", ['sigilService']);

gameController.controller("gameController", [ '$scope', 'sigilService', function($scope, sigilService) {
	
	//$scope.mapData = {};
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
	sigilService.success(function(data) {
	  console.log('controller succeeded in getting map data');
	  $scope.mapData = data;
	  console.log('mapData from controller: ', $scope.mapData);
	});
} ]);
