Basecamp.js

var Basecamp = angular.module('Basecamp', []);

  Basecamp.factory('Basecamp', [ '$http', function($http) {
    var Basecamp = function(data) {
      this.id = data.id;
      this.name = data.name;
      this.icon = data.icon;
      this.location = data.location;
    }

    Basecamp.prototype.getBasecampSimple = function() {
      return $http.get('game/basecamp/:id');
    };
    return Basecamp;
  }]);