/**
 * Terra Service
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var terraService = angular.module('terraService',[]);
terraService.factory('terraService', ['$window', '$timeout', function($window, $timeout) {
  var width, height;
  var cyclicTerrarium = {};

  $timeout(function() {

    width = d3.select("svg#gradient").attr("width");//160;
    height = d3.select("svg#gradient").attr("height");//160;
    cyclicTerrarium = new terra.Terrarium((width / 10 ), (height / 10 ), {
      "id":"terraCycle",
      // "style":"background-color:\'black\'",
      cellSize: width / 64,
      // insertAfter: document.getElementById("div#buttonsDiv"),
      periodic: true
    });
    document.getElementById("terraCycle").addEventListener("mousemove", function() {

      if(Math.round(Math.random() * 100) <= 1) {
        console.log('1!');
        //
        // terra.registerCreature({
        //   type:'buh',
        //   color:[255,255,255],
        //   size: width/16,
        //   move: true,
        //   process: function (){}
        // });
        terra.registerCreature({
          type: 'simplePlant',
          color: [166, 226, 46],
          size: 10,
          reproduceLv: 0.8,
          wait: function() { this.energy += 3; },
          move: false
        },
        {
          //init
        });
      } else {
        console.log('0.');
      }

//       terra.registerCreature({
//   type: 'simplePlant',
//   color: [166, 226, 46],
//   size: 10,
//   reproduceLv: 0.8,
//   wait: function() { this.energy += 3; },
//   move: false
// });

    });
    cyclicTerrarium.grid = cyclicTerrarium.makeGrid('cyclic');
    cyclicTerrarium.animate();
  }, 5000);

  var cycles = [];

  cycles.push(cyclicTerrarium);

  return function() {
    console.log('inside terraService return');
    terra.registerCA({
    type: 'cyclic',
    character: '•',
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
 };
}]);
