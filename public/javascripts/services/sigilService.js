var sigilService = angular.module('sigilService', []);

sigilService.factory('sigilService', ['$http', function($http) {
  return $http.get('http://bost.ocks.org/mike/map/uk.json')
    .success(function(data) {
      return data;
    })
    .error(function(err) {
      return err;
    });
}]);