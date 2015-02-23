/**
 * index.js
 * 
 * @author khinds (c) shamanic.io, http://www.shamanic.io
 */
var userController = angular.module("userController", []);

userController.controller("userController", [ '$scope', '$http', function($scope, $http) {
	console.log('users js here');
} ]);
