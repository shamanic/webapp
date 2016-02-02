/**
 * User Controllers 
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var userControllers = angular.module("userControllers", []);

// login controller
userControllers.controller("loginController", [ '$scope', '$http', function($scope, $http) {
	
	// setup the default form validation values
	$scope.showValidationMessages = false;
	$scope.userNotFound = false;
	
	// user submit form, show errors if present
	$scope.submit = function(isFormValid) {		
		$scope.showValidationMessages = true;

		// if valid form, check if the user account exists for given password
		if (isFormValid) {
		    $http({
			    url : '/user/checkLogin',
			    method : "POST",
			    data : {
				    'username' : $scope.username,
				    'password' : $scope.password
			    }
		    }).then(function(response) {
			
			    // if no user then show the user not found message, else we go to account page
			    $scope.userNotFound = false;
			    if (response.data != "user login sucessful") {
				    $scope.userNotFound = true;
				    return;
			    }
			    window.location = "/user/account"
		    }, function(response) {
			    isFormValid = false;
		    });
		}
	};
} ]);

// signup controller
userControllers.controller("signupController", [ '$scope', '$http', function($scope, $http) {
	
	// setup the default form validation values
	$scope.showValidationMessages = false;
	$scope.passwordMatch = true;

	// user submit form, show errors if present
	$scope.submit = function(isFormValid) {

		$scope.showValidationMessages = true;

		// make sure the passwords match
		$scope.passwordMatch = true;
		if ($scope.password != $scope.confirm) {
			$scope.passwordMatch = false;
			isFormValid = false;
		}

		// if valid form, now we have to check for unique user names and email addresses
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

					// submit the create user form after the 2nd validation has finished
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

// manage user account controller
userControllers.controller("userAccountController", [ '$scope', '$http', function($scope, $http) {
	
	// default values for the user submit form messages
	$scope.showAccountForm = false;
	$scope.showValidationMessages = false;
	$scope.fullname = window.fullname;
	$scope.showUpdateMessage= false;
	$scope.updateMessage = '';

	// user submit form, show errors if present
	$scope.submit = function(isFormValid) {
		$scope.showValidationMessages = true;
		
		// make sure the passwords match
		$scope.passwordMatch = true;
		if ($scope.password != $scope.confirm) {
			$scope.passwordMatch = false;
			isFormValid = false;
		}
				
		// if valid form submission then save user data and show success/fail message
		if (isFormValid) {
			
			// default the user submit form messages
			$scope.showUpdateMessage= false;
			$scope.updateMessage = '';
			
			$http({
				url : '/user/update',
				method : "POST",
				data : {
					fullname : $scope.fullname,
					password : $scope.password
				}
			}).then(function(response) {
				$scope.showUpdateMessage= true;
				$scope.updateMessage = response.data;
				$scope.showAccountForm = false;
			});
		}
	};
} ]);

// forgot controller
userControllers.controller("forgotController", [ '$scope', '$http', function($scope, $http) {
	
	// setup the default form validation values
	$scope.showValidationMessages = false;
	$scope.userNotFound = false;
	$scope.passwordReset = false;
	
	// user submit form, show errors if present
	$scope.submit = function(isFormValid) {
		
		$scope.showValidationMessages = true;
		$scope.userNotFound = false;

		// if they didn't put anything in the fields, then we're not found
		if ((typeof($scope.username) == 'undefined' || $scope.username == '') && (typeof($scope.email) == 'undefined' || $scope.email == '')) {
			$scope.userNotFound = true;	
			isFormValid = false;
		}
		
		// if valid form, check if the user account exists for given email or username
		if (isFormValid) {
		    $http({
			    url : '/user/checkForgot',
			    method : "POST",
			    data : {
				    'username' : $scope.username,
				    'email' : $scope.email
			    }
		    }).then(function(response) {
		    	if (response.data == 'user password recovered') {
		    		$scope.passwordReset = true;
		    	} else {
		    		$scope.userNotFound = true;
		    	}
		    });
		}
	};
} ]);
