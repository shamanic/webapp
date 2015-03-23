/**
 * index.js
 * 
 * @author khinds (c) shamanic.io, http://www.shamanic.io
 */
var userController = angular.module("userController", []);
userController.controller("userController", [ '$scope', '$http', function($scope, $http) {

	/** setup the default form validation values */
	$scope.showValidationMessages = false;
	$scope.passwordMatch = true;

	/** user submit form, show errors if present */
	$scope.submit = function(isFormValid) {

		$scope.showValidationMessages = true;

		/** make sure the passwords match */
		$scope.passwordMatch = true;
		if ($scope.password != $scope.confirm) {
			$scope.passwordMatch = false;
			isFormValid = false;
		}

		/** if valid form, now we have to check for unique user names and email addresses */
		if (isFormValid) {
			$scope.showEmailTakenError = false;
			$scope.showUserTakenError = false;
			var values = {
				email : $scope.email,
				username : $scope.username
			};
			angular.forEach(values, function(value, key) {
				$http({
					url : '/user/checkExistingValue',
					method : "POST",
					data : {
						property : key,
						value : value
					}
				}).then(function(response) {
					if (response.data == 'value exists') {
						if (key == 'email') {
							$scope.showEmailTakenError = true;
						} else {
							$scope.showUserTakenError = true;
						}
						isFormValid = false;
					}

					/** submit the create user form after the 2nd validation has finished */
					if (key == 'username' && isFormValid) {
						document.forms.signupform.submit();
					}

				}, function(response) {
					isFormValid = false;
				});
			});
		}
	};
} ]);
