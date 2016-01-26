/**
 * game.js
 *
 * @author khinds (c) shamanic.io, http://www.shamanic.io
 */
var gameController = angular.module("gameController", ['sigilService', 'terraService']);

gameController.controller("gameController", [ '$scope', 'sigilService', 'terraService', function($scope, sigilService, terraService) {

	$scope.terrafy = function() {
		terraService();
	}

	//$scope.mapData = {};
	$scope.sigilList = [];

	var promise = sigilService.getSigilsSimple();
	promise.then(function(payload) {
		$scope.restImageList = payload.data;
	},
	function(errPayload) {
		console.log('failure communicating w sigilService API: ' + errPayload)
	});

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

	// sigilService.getSigils.success(function(data) {
	//   console.log('controller succeeded in getting map data');
	//   $scope.mapData = data;
	//   console.log('mapData from controller: ', $scope.mapData);
	// });
	// function getSigils() {
	// 	sigilService.getSigils()
	// 		.then(function(result) {
	// 			this.restImageList = result.data;
	// 		});
	// }
	// getSigils();
}]);
