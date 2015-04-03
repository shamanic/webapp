/** 
 * DB config and utilities via wrapper 
 */
var AppSettings = require('../settings/settings.js');
var DBWrapper = require('node-dbi').DBWrapper;
var dbConnectionConfig = { host:AppSettings.DBConfig.db.host, user:AppSettings.DBConfig.db.username, password:AppSettings.DBConfig.db.password, database:AppSettings.DBConfig.db.database };
exports.dbWrapper = new DBWrapper('pg', dbConnectionConfig);