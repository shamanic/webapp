/**
 * sigils.js
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;
shamanicWebApp.directive('sigilGallery', function($interval, $window) {
	return {
		restrict: 'E',
    templateUrl: 'ui/js/views/sigilPartial.html',
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
		  scope.promptForSigil = function(location) {
		  	//here we want to have a sigilarray prepared so we can compare user input against it..
		  }

		}
	};
});
