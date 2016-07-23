shamanicWebApp.directive('basecampButton', ['$timeout', '$http', function($timeout, $http) {
  return {
    restrict: 'E',

    template:'<span ng-show="showThisButton" ng-class="basecampButtonClass" ng-click="assignBasecamp()"><a>{{message}}</a></span>',

    link: function(scope, element, attributes) {
    //   controller: function($scope, $http) {
    // //   scope: {
    // //   type:'@'
    // // },
    scope.isLoading = function() {
      return $http.pendingRequests.length > 0;
    }

    scope.$watch(scope.isLoading, function(v) {
      if(v) {
        if(scope.basecampObj instanceof Object) {
          isBasecampObject = true;
          if(scope.basecampObj.length > 0) {
            scope.message = "Change Basecamp";
          } else {
            scope.message = "you haven\'t assigned a basecamp yet. Do so now?";
          }
        } else {
          isBasecampObject = false;
        };
        //element.show();
        scope.showThisButton = true;
      } else {
        //element.hide();
        scope.showThisButton = false;
      }
    }, true);
    var isBasecampObject = false;
    // setTimeout(function() {
    //   console.log(JSON.stringify($scope.basecampObj) + ' is the basecamp obj now');
    //   if($scope.basecampObj instanceof Object)
    //   {
    //     isBasecampObject = true;
    //   };
    // }, 30000);



    //   //more controller logic
    // },
      // var $scope = scope;
      // $scope.showThisButton = null;

      // $scope.$watch(isBasecampObject, function (newVal, oldVal, scope) {

      //   if(newVal === false) {
      //     scope.message = "you haven\'t assigned a basecamp yet. Do so now?";
      //     scope.showThisButton = true;
      //   } else if (newVal === true) {
      //     scope.message = "Change Basecamp";
      //     scope.showThisButton = true;
      //   } else {
      //     scope.showThisButton = false;
      //   }

      //   console.log(scope.showThisButton + ' was the show value, and ' + JSON.stringify(scope.basecampObj) + ' was the basecamp object, and ' + isBasecampObject + ' was the isBasecampObject.');
      // }, true);
      // var enableButton = function() {

      // }
      console.log(scope.showThisButton + ' was the show value, and ' + scope.basecampObj + ' was the basecamp object');
      // linking logic, maybe necessary?
      if(scope.type == 'button') {
        scope.basecampButtonClass = 'basecamp-button';
      }

      scope.assignBasecamp = function() {
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

      }
    }
  }
}]);