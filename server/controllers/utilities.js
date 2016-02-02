/**
 * Shamanic Web Application
 * @copyright 2015 Shamanic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
*
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
  req.db.fetchAll('SELECT * FROM user_locations WHERE user_uuid = \'' + req.session.user.uuid + '\'', function(err, result) {
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