shamanicWebApp.directive('basecampButton', function() {
  return {
    restrict: 'E',
    scope: {
      type:'@'
    },
    template:'<span ng-show="showThisButton" ng-class="basecampButtonClass" ng-click="assignBasecamp()"><a>{{message}}</a></span>',
    controller: function($scope, $http) {
      $scope.showThisButton = true;

      if($scope.basecampObj === null || $scope.basecampObj === undefined) {
        $scope.message = "you haven\'t assigned a basecamp yet. Do so now?";
      } else {
        $scope.message = "Change Basecamp";
      }

      $scope.assignBasecamp = function() {
        // need some logic to see if, of any of the location_metadata rows for this user, there's one with is_basecamp = true
        if(1==1) {
          // $http({
          //   method: 'POST',
          //   url: '/user/assignNewBasecamp',
          //   data: {
          //     location:'666'
          //   }
          // }).then(function successCallback(response) {
          //   if(response.data == "OK") {
          //     $scope.showThisButton = false;
          //     $scope.message = "fkn success yall!";
          //     console.log('basecamp success!');
          //   }
          // }, function errorCallback(response) {
          //   console.log('basecamp error..:' + JSON.stringify(response));
          // });
          console.log("http POSTing to assignNewBasecamp");
        } else {
          console.log("http POSTing to updateBasecamp");
          // $http({
          //   method: 'POST',
          //   url: '/user/updateBasecamp',
          //   data: {
          //     location:'666'
          //   }
          // }).then(function successCallback(response) {
          //   if(response.data == "OK") {
          //     $scope.showThisButton = false;
          //     $scope.message = "fkn success yall!";
          //     console.log('basecamp success!');
          //   }
          // }, function errorCallback(response) {
          //   console.log('basecamp error..:' + JSON.stringify(response));
          // });
        }

      };

      //more controller logic
    },
    link: function(scope, element, attributes) {
      // linking logic, maybe necessary?
      if(scope.type == 'button') {
        scope.basecampButtonClass = 'basecamp-button';
      }
    }
  };
});
