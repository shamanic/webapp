/**
 * Game Controllers
 *
 * @author khinds, davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var gameController = angular.module("gameController", ['gameAssetService', 'terraService', 'Sigil', 'Basecamp']);
gameController.controller("gameController", [ '$scope', '$routeParams', 'gameAssetService', 'Sigil', 'Basecamp', 'terraService', function($scope, $routeParams, gameAssetService, Sigil, Basecamp, terraService) {

	var ctrl = this;
	$scope.username = window.username;
	//console.log('username from session: ' + req.session.user.username);

	$scope.xAndyTracker = function(ev) {
		$scope.X = ev.offsetX;
		$scope.Y = ev.offsetY;
	};

	$scope.fireClick = function(event) {
        $scope.X = event.offsetX;
        $scope.Y = event.offsetY;
        $scope.inOrOut = true;
	};

	$scope.zoomButtonClicked = function() {
		$scope.zoomEnabled = !$scope.zoomEnabled;
		console.log('clicked zoomButton, zoomEnabled: ' + $scope.zoomEnabled);
	};

	$scope.terrafy = function() {
		terraService();
	};

	ctrl.sigilpack = new Sigil($scope.username);

	ctrl.sigilpack.getSigilsSimple()
		.then(function(payload) {
			$scope.restImageList = payload.data;
			console.log('from inside getSigilsSimple promise: ' + JSON.stringify(payload.data) + ' and scope.restImageList: ' + JSON.stringify($scope.restImageList));
		},
		function(errPayload) {
			console.log('failure communicating w gameAssetService API: ' + errPayload);
		});

	ctrl.sigilpack.getSigilsByUser()
		.then(function(payload) {
			$scope.userImageList = ctrl.sigilpack.properties;
			console.log('userImageList, just before basecamp obj call: ' + JSON.stringify($scope.userImageList));
		},
		function(errPayload) {
			console.log('failure getting user\'s sigilpack: ' + errPayload.data);
		});

	var basecamp = new Basecamp($scope.username);
	basecamp.getBasecampSimple().then(function() {
		$scope.basecampObj = basecamp.properties;
		console.log(JSON.stringify($scope.basecampObj));
	});

	$scope.basecamp_icon = $routeParams.basecamp_icon;
	console.log('basecamp_icon: ' + $scope.basecamp_icon);

	// gameAssetService.getSigils.success(function(data) {
	//   console.log('controller succeeded in getting map data');
	//   $scope.mapData = data;
	//   console.log('mapData from controller: ', $scope.mapData);
	// });
	// function getSigils() {
	// 	gameAssetService.getSigils()
	// 		.then(function(result) {
	// 			this.restImageList = result.data;
	// 		});
	// }
	// getSigils();

}]);
