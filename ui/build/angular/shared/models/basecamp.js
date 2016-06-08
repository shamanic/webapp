var Basecamp = angular.module('Basecamp', []);

Basecamp.factory('Basecamp', [ '$http', function($http) {
  var Basecamp = function (id) {
    this.id = id;
    this.properties = null;
  };

  Basecamp.prototype.getBasecampSimple = function() {
    var self = this;
    return $http({method: 'GET',
                  url: 'game/basecamp/' + this.id})
            .then(function(response) {
              // console.log(JSON.stringify(response));
              self.properties = response.data;
              return response;
            }, function(response) {
              self.properties = response.data || "Request failed";
              return response;
            });
  };
  return Basecamp;
}]);
