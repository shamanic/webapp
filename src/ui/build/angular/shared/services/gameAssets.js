/**
 * Game Asset Service
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var gameAssetService = angular.module('gameAssetService', []);

gameAssetService.factory('gameAssetService', ['$http', 'globalSettings', 'coordinateSystem', function($http, globalSettings, coordinateSystem) {
//return $http.get('http://overpass-api.de/api/interpreter?data=[out:json];(node(51.249,7.148,51.251,7.152);<;);out;')
  var basecamp_icon = window.fullname;

  return {
    getMapSimple: function() {
      return $http.get('https://bost.ocks.org/mike/map/uk.json');
      // .success(function(data) {
      //   return data;
      // })
      // .error(function(err) {
      //   return err;
      // });
    },
    getMapRobust: function() {
      return $http.get('game/map');
    },
    getSigilsSimple: function() {
      return $http.get('game/sigils');
      // .success(function(data) {
      //   console.log("get success: " + data);
      //   return data;
      // })
      // .error(function(err) {
      //   console.log("get failed: " + err);
      //   return err;
    },
    getSigilsRobust: function() {
      //return $http.get('');
    },
    getBasecampLocation: function() {
        console.log('inside getBasecamp location: ' + basecamp_icon);
      return $http.get('game/basecamp/' + basecamp_icon//,
        //{params: { user_id: user.id }
      //}
      );

    },
    initialise: function(canvasContext, graphicsFile) {
      console.log('inside initialise.');
      this.spriteWidth = globalSettings.spriteSize;
      this.spriteHeight = globalSettings.spriteSize;
      this.canvas = canvasContext;
      this.spriteSheet = new Image();
      this.spriteSheet.src = graphicsFile;
    },

    convertGameXCoordinateToPixels: function(x) {
      return x * globalSettings.spriteSize;
    },

    convertGameYCoordinateToPixels: function(y) {
      return (y * globalSettings.spriteSize) + globalSettings.scoreBoardArea;
    },

    blankScreen: function() {
      this.canvas.fillStyle = globalSettings.gameBoardBackgroundColour;
      this.canvas.fillRect(0, 0, globalSettings.gameBoardWidth * this.spriteWidth, globalSettings.scoreBoardArea + (globalSettings.gameBoardHeight * this.spriteHeight));
    },

    drawText: function(coordSystem, x, y, text, colour, font) {
      if (coordSystem === coordinateSystem.world) {
        x = this.convertGameXCoordinateToPixels(x);
        y = this.convertGameYCoordinateToPixels(y);
      }
      this.canvas.fillStyle = colour;
      this.canvas.font = font;
      this.canvas.fillText(text, x, y)
    },

    drawImage: function(coordSystem, x, y, image) {
      if (coordSystem === coordinateSystem.world) {
        x = this.convertGameXCoordinateToPixels(x);
        y = this.convertGameYCoordinateToPixels(y);
      }
      this.canvas.drawImage(
        this.spriteSheet,
        this.spriteWidth * (image % globalSettings.spriteSheetWidth),
        this.spriteHeight * Math.floor(image / globalSettings.spriteSheetWidth),
        this.spriteWidth,
        this.spriteHeight,
        x,
        y,
        this.spriteWidth,
        this.spriteHeight);
    }
  };
}]);
// angular.module("gameApp")
    // .factory("graphicsEngineService", ["globalSettings", "coordinateSystem", function(globalSettings, coordinateSystem) {
       // "use strict";
        // return {

        // }
    // }]);