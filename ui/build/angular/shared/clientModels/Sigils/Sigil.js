// (function() {
  var Sigil = angular.module('Sigil', []);

  Sigil.factory('Sigil', [ '$http', function($http) {
    function Sigil(name) {
      this.name = name;
      this.properties = null;
    }

    Sigil.prototype.getSigilsByUser = function() {
      debugger;
      var self = this;
      return $http.get('game/userSigils/' + this.name)
                  .then(function(response) {
                    self.properties = response.data;
                    return response;
                  }, function(response) {
                    self.properties = response.data || "Request failed";
                    return response;
                  });
    };

    Sigil.prototype.getSigilsSimple = function() {
      return $http.get('game/sigils');
    };
    return Sigil;
  }]);
// }());