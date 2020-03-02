/**
 * Utilities Controller
 *
 * @author khinds, davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */

/**
 * show locations that currently exist in the game
 */
exports.locations = function(req, res) {
  res.render('pages/utilities/locations', {
    title : req.siteEnvironment.websiteConfig.websiteName + ' [Utilities - Locations]',
    websiteName: req.siteEnvironment.websiteConfig.websiteName
  });
};

/**
 * get list of users
 */
exports.getUsers = function(req, res) {
  req.db.fetchAll('SELECT * FROM users', function(err, result) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(result);
  });
}

/**
 * get list of users JSON string
 */
exports.getUsersJSON = function(req, res) {
  req.db.fetchAll('SELECT * FROM users', function(err, result) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var json = JSON.stringify(result);
    res.end(json);
  });
}

/**
 * for user, what are all their locations?
 */
exports.getLocationsForUser = function(req, res) {
  req.db.fetchAll(`SELECT * FROM user_locations WHERE user_uuid = \'${req.session.user.uuid}\'`, function(err, result) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var json = JSON.stringify(result);
    res.end(json);
  });
}

/**
 * complete list of game locations
 */
exports.getAllLocations = function(req, res) {
  req.db.fetchAll('SELECT user_locations.*, users.username FROM user_locations INNER JOIN users ON (user_locations.user_uuid = users.uuid) ', function(err, result) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var json = JSON.stringify(result);
    res.end(json);
  });
}

/**
 * complete list of basecamps
 */
exports.getBasecampsJSON = function(req, res) {
  req.db.fetchAll('SELECT locations_metadata.* FROM locations_metadata INNER JOIN users ON (users.uuid = locations_metadata.user_uuid AND locations_metadata.is_basecamp = true)', function(err, result) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var json = JSON.stringify(result);
    res.end(json);
  });
}
