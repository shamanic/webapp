/**
 * Play Game Controller
 *
 * @author davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */

/**
 *
 */
 exports.getMapForUser = function(req, res) {
  if (!req.variableHelper.isEmpty(req.session.user.uuid)) {
    res.locationModel.getMapDistances(req)
    .then(function (result) {
      res.render('pages/response', {response : 'saved'});
    }).catch(function(err) {
      res.render('pages/response', {response : 'error'});
    });
  } else {
    res.render('pages/response', {response : 'unauthorized'});
  }
 }


/**
 * play the game home page
 */
exports.index = function(req, res){
	res.render('pages/game/game', {
		title: 'Shamanic [Play]',
		websiteName: req.siteEnvironment.websiteConfig.websiteName,
    username: req.session.user.username
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
 * for given ID, what's the user's basecamp?
 */
exports.getBasecampById = function(req, res) {
  req.locationModel.getCurrentBasecamp(req, req.params.id).then(function(result) {
    console.log('Getting this user\'s basecamp, id: ' + req.params.id);
    res.writeHead(200, {'Content-Type': 'application/json'});
    var json = JSON.stringify(result);
    res.end(json);
  });
}

/**
 * three.js test
 */
exports.threejs = function(req, res) {
  res.render('pages/threejs', {
    title: 'Three.js Test',
    websiteName: req.siteEnvironment.websiteConfig.websiteName
  });
};

/**
 * grid test page
 */
exports.grid = function(req, res) {
  res.render('pages/grid', {
    title: 'a test page for the grid directive',
    websiteName: req.siteEnvironment.websiteConfig.websiteName
  });
};

/**
 * get the existing sigils for user
 */
exports.getSigilsForUser = function(req, res) {
  req.sigilRepo.getSigilsByUserId(req, req.params.username).then(function(result) {
    console.log('Getting this user\'s sigils, username: ' + req.params.username);
    res.writeHead(200, {'Content-Type': 'application/json'});
    var json = JSON.stringify(result);
    res.end(json);
  })
  .catch(function(err) {
    console.log("well, that didn\'t work: " + err);
    res.render('pages/response', {response : 'error'});
  });
};
