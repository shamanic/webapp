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
}]);
