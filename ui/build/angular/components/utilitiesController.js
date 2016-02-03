/**
 * Utilities Controller
 * 	utilities page angular resources
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var utilitiesController = angular.module("utilitiesController", []);
utilitiesController.controller("statsController", ['$scope', '$http', function($scope, $http) {
  var promise = $http.get('/utilities/getAllLocations');
  promise.then(function(payload) {
    $scope.locations = payload.data;
  },
  function(errPayload) {
    console.log('failure communicating w sigilService API: ' + errPayload);
  });
}]);
