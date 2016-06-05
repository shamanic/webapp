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

exports.getLocationsForUser = function(req, res) {
  req.db.fetchAll(`SELECT * FROM user_locations WHERE user_uuid = \'${req.session.user.uuid}\'`, function(err, result) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var json = JSON.stringify(result);
    res.end(json);
  });
}

exports.getAllLocations = function(req, res) {
  req.db.fetchAll('SELECT user_locations.*, users.username FROM user_locations INNER JOIN users ON (user_locations.user_uuid = users.uuid) ', function(err, result) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var json = JSON.stringify(result);
    res.end(json);
  });
}

exports.getBasecampsJSON = function(req, res) {
  req.db.fetchAll(`SELECT l.user_locations_id
                   FROM locations_metadata AS l
                   INNER JOIN users ON
                    (users.uuid = locations_metadata.user_uuid
                    AND locations_metadata.is_basecamp = true)`,
    function(err, result) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      var json = JSON.stringify(result);
      res.end(json);
    });
}