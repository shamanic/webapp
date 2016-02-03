/**
 * Scrolled Element Directive
 * 	any element can have an angular "scrolled" state
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
shamanicWebApp.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 100) {
                 element.addClass('scrolled');
             } else {
                 element.removeClass('scrolled');
             }
        });
    };
});
