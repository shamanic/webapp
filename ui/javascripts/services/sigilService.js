
var sigilService = angular.module('sigilService', []);

sigilService.factory('sigilService', ['$http', function($http) {
//return $http.get('http://overpass-api.de/api/interpreter?data=[out:json];(node(51.249,7.148,51.251,7.152);<;);out;')
  return {
    getMapSimple: function() {
      return $http.get('http://bost.ocks.org/mike/map/uk.json');
      // .success(function(data) {
      //   return data;
      // })
      // .error(function(err) {
      //   return err;
      // });
    },
    getMapRobust: function() {

    },
    getSigilsSimple: function() {
      return $http.get('http://127.0.0.1:3000/game/sigils');
      // .success(function(data) {
      //   console.log("get success: " + data);
      //   return data;
      // })
      // .error(function(err) {
      //   console.log("get failed: " + err);
      //   return err;
    },
    getSigilsRobust: function() {

    }
  }
}]);