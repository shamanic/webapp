/**
 * Database Configuration
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */

// DB config and utilities via wrapper 
var AppSettings = require('../../config/settings.js');
var DBWrapper = require('node-dbi').DBWrapper;
var dbConnectionConfig = { host:AppSettings.DBConfig.db.host, user:AppSettings.DBConfig.db.username, password:AppSettings.DBConfig.db.password, database:AppSettings.DBConfig.db.database };
exports.dbWrapper = new DBWrapper('pg', dbConnectionConfig);
