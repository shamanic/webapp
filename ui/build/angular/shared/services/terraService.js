/**
 * Terra Service
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var terraService = angular.module('terraService',[]);
terraService.factory('terraService', ['$window', '$timeout', function(win, $timeout) {
  var width, height;
  var cyclic = {};
  $timeout(function() {

    width = d3.select("svg#gradient").attr("width");
    height = d3.select("svg#gradient").attr("height");
    cyclic = new terra.Terrarium((width / 10), (height / 10), {
      "id":"terraCycle",
      cellSize: width / 100,
      insertAfter: document.getElementById("stuffFromDavid"),
      periodic:true
    });
    cyclic.grid = cyclic.makeGrid('cyclic');
    cyclic.animate();

  }, 5000);

  var cycles = [];

  cycles.push(cyclic);

  return function() {
    terra.registerCA({
    type: 'cyclic',
    colors: ['255,0,0,0.1', '255,96,0,1', '255,191,0,0.2', '223,255,0,1', '128,255,0,0.3', '32,255,0,1', '0,255,64,0.4', '0,255,159,1',
           '0,255,255,0.5', '0,159,255,1', '0,64,255,0.6', '32,0,255,1', '127,0,255,0.7', '223,0,255,1', '255,0,191,0.8', '255,0,96,1'],
    colorFn: function () { return this.colors[this.state];},
    process: function (neighbors, x, y) {
      var next = (this.state + 1) % 16;
      var changing = neighbors.some(function (spot) {
        return spot.creature.state === next;
      });
      if (changing) this.state = next;
      return true;
    }
  }, function () {
    this.state = Math.floor(Math.random() * 16);
  });


  // msgs.push(msg);
  //  if (msgs.length == 3) {
  //    win.alert(msgs.join("\n"));
  //    msgs = [];
  //  };
 }
}]);
