/**
 * app.js
 * 
 * @author khinds (c) shamanic.io, http://www.shamanic.io
 */
var shamanicWebApp = angular.module('shamanicWebApp', [ 'indexController', 'userController', 'gameController']);

/** Intercept POST requests, convert to standard form encoding */
shamanicWebApp.config([ '$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $httpProvider.defaults.transformRequest.unshift(function(data, headersGetter) {
	var key, result = [];
	for (key in data) {
	    if (data.hasOwnProperty(key)) {
		if (typeof (data[key]) == "undefined")
		    data[key] = '';
		result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
	    }
	}
	return result.join("&");
    });
} ]);