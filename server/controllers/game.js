/**
 * Play Game Controller
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */

/**
 * play the game home page
 */
exports.index = function(req, res){
	res.render('pages/game', {
		title: 'Shamanic [Play]',
		websiteName: req.siteEnvironment.websiteConfig.websiteName
  });
};

/**
 * visit basecamp
 */
exports.basecamp = function(req, res) {
  res.render('pages/basecamp', {
    title: req.session.user.username + '\'s Shamanic [basecamp]',
    websiteName: req.siteEnvironment.websiteConfig.websiteName
  });
};

/**
 * three.js test
 */
exports.threejs = function(req, res) {
  res.render('pages/threejs', {
    title: 'Three.js Test',
    websiteName: req.siteEnvironment.websiteConfig.websiteName
  });
};

exports.getSigils = function(req, res) {
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
  res.writeHead(200, {'Content-Type': 'application/json'});
  var json = JSON.stringify(result);
  res.end(json);
};
