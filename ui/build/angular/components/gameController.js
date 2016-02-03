/**
 * Game Controllers
 *
 * @author khinds, davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var gameController = angular.module("gameController", ['sigilService', 'terraService']);
gameController.controller("gameController", [ '$scope', '$routeParams', 'sigilService', 'terraService', function($scope, $routeParams, sigilService, terraService) {

	$scope.terrafy = function() {
		terraService();
	}
	$scope.sigilList = [];

	var promise = sigilService.getSigilsSimple();
	promise.then(function(payload) {
		$scope.restImageList = payload.data;
		console.log('from inside getSigilsSimple promise: ' + JSON.stringify(payload.data))
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

	$scope.basecamp_icon = $routeParams.basecamp_icon;
	console.log('basecamp_icon: ' + $scope.basecamp_icon);
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
