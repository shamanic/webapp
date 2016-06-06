/**
 * Model for locations in the system
 *
 * @author khinds, dpshcmitz
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */

/**
 * save new user location
 */
exports.addLocationForUser = function(req, lat, long, elevation) {
  return new req.promise(function (resolve, reject) {
  	var userLocationObj = {latitude : lat, longitude: long, elevation : elevation};
  	userLocationObj.created_on = new req.db.DBExpr('NOW()');
  	userLocationObj.user_uuid = req.session.user.uuid;
  	req.db.insert('user_locations', userLocationObj , function(err) {
        if (err) {
          return reject(err);
        }
        return resolve(true);
  	});
  });
}

/**
 * save new basecamp
 */
exports.addBasecamp = function(req, location) {
  return new req.promise(function (resolve, reject) {
    var basecampObj = { user_locations_id: location };
    basecampObj.is_basecamp = true;
    basecampObj.assigned_basecamp_on = new req.db.DBExpr('NOW()');
    basecampObj.user_uuid = req.session.user.uuid;
    req.db.insert('locations_metadata', basecampObj, function(err) {
      if(err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
}

/**
 * get a current basecamp for user
 */
exports.getCurrentBasecamp = function(req) {
  return new req.promise(function(resolve, reject) {
    req.db.fetchRow('SELECT * FROM locations_metadata WHERE user_uuid = ? AND is_basecamp = true', [req.session.user.uuid], function(err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * update location to basecamp status - as a user can only define one basecamp, this should also disable the old one
 */
exports.updateLocationToBasecamp = function(req, location) {
  return new req.promise(function(resolve, reject) {
    var basecampObj = { user_locations_id: location.location_id };
    basecampObj.is_basecamp = true;
    basecampObj.assigned_basecamp_on = new req.db.DBExpr('NOW()');
    basecampObj.user_uuid = req.session.user.uuid;
    req.db.update('locations_metadata', basecampObj, [['user_uuid=?', uuid], ['user_locations_id', location.location_id]], function(err) {
      if(err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
}
