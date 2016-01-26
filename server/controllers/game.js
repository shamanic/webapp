/** 
 * play the game 
 */
exports.index = function(req, res){
	var SiteEnvironment = require('../../config/environment.js');
	res.render('pages/game', {
		title: 'Shamanic [Play]',
		websiteName: SiteEnvironment.websiteConfig.websiteName
  });
};

/** 
 * three.js test 
 */
exports.threejs = function(req, res) {
  var SiteEnvironment = require('../../config/environment.js');
  res.render('pages/threejs', {
    title: 'Three.js Test',
    websiteName: SiteEnvironment.websiteConfig.websiteName
  });
};

exports.getSigils = function(req, res) {
  var SiteEnvironment = require('../../config/environment.js');
  //database call eventually to go here..
  //return function(err, result) {
    var result = [
    {
      url: 'http://placekitten.com/201/201',
      name: 'sigilOne'
    },
    {
      url: 'http://placekitten.com/201/203',
      name: 'sigilTwo'
    }
  ];
  //if(!err) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      var json = JSON.stringify(result);
      res.end(json);
    //}
    // else{
    //   console.log(err);
    //   res.render('pages/response', {
    //     response : 'not found'
    //   });
    // }
  //}
};
