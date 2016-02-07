/**
 * Sigil Service
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var sigilService = angular.module('sigilService', []);

sigilService.factory('sigilService', ['$http', function($http) {
//return $http.get('http://overpass-api.de/api/interpreter?data=[out:json];(node(51.249,7.148,51.251,7.152);<;);out;')
  var basecamp_icon = window.fullname;

  return {
    getMapSimple: function() {
      return $http.get('https://bost.ocks.org/mike/map/uk.json');
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
      return $http.get('game/sigils');
      // .success(function(data) {
      //   console.log("get success: " + data);
      //   return data;
      // })
      // .error(function(err) {
      //   console.log("get failed: " + err);
      //   return err;
    },
    getSigilsRobust: function() {

    },
    getBasecampLocation: function() {
      return $http.get('game/basecamp/' + basecamp_icon//,
        //{params: { user_id: user.id }
      //}
      );
      console.log('inside getBasecamp location: ' + basecamp_icon);
    }
  }
}]);
