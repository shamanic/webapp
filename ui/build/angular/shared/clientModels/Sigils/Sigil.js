// (function() {
  var Sigil = angular.module('Sigil', []);

  Sigil.factory('Sigil', [ '$http', function($http) {
    var Sigil = function(data) {
      this.name = data.name;
    }

    Sigil.prototype.getSigilsSimple = function() {
      return $http.get('game/sigils');
    };

    Sigil.prototype.getSigilsByUser = function() {
      return $http.get('game/userSigils');
    };
    return Sigil;
  }]);
// }());