/**
 * index.js
 * 
 * @author khinds (c) shamanic.io, http://www.shamanic.io
 */
var indexController = angular.module("indexController", []);

indexController.controller("indexController", [ '$scope', '$http', function($scope, $http) {
	console.log('index js here');
} ]);