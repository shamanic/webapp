/**
 * sigils.js
 * 
 * @author dschmitz (c) shamanic.io, http://www.shamanic.io
 */
var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;
console.log('script path: ' + currentScriptPath);
shamanicWebApp.directive('sigilGallery', function($interval, $window) {
	return {
		restrict: 'E',
		// templateUrl: currentScriptPath.replace('gameDirectives.js', 'sigilPartial.html'),
    templateUrl: 'ui/javascripts/views/sigilPartial.html',
		scope: {
			images: '='
		},
		link: function(scope, element, attributes) {
			scope.nowShowing = 0;
			$interval(function showNext() {
				if(scope.nowShowing != scope.images.length - 1) {
					scope.nowShowing++;
				}
				else {
					scope.nowShowing = 0;
				}
			}, 2000);
		  scope.openSigilPage = function(index) {
			  $window.open(scope.images[index].url);
		  };

		}
	};
});