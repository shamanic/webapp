/**
 * Model for locations in the system
 *
 * @author khinds
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
