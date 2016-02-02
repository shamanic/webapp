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