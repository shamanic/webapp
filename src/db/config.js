/** 
 * DB config and utilities via wrapper 
 */
var AppSettings = require('../../settings/settings.js');
var DBWrapper = require('node-dbi').DBWrapper;
var dbConnectionConfig = { host:AppSettings.DBConfig.db.host, 
    user:AppSettings.DBConfig.db.username, 
    password:AppSettings.DBConfig.db.password, 
    database:AppSettings.DBConfig.db.database 
};
var regex = new RegExp(/(.*):\/\/([a-z].*):(.*)@(.*):([0-9]{4})\/([a-z0-9].*)/);
var groups = process.env.DATABASE_URL.match(regex);
/*  groups[0]= the full match
*   then,
*   groups[1]= dbAdapterName(postgres)
*   ://
*   groups[2]= username
*   :
*   groups[3]= password
*   @
*   groups[4]= host
*   :
*   groups[5]= port
*   /
*   groups[6]= database
*/
var herokuDbConnCfg = {
    host: groups[4],
    user: groups[2],
    password: groups[3],
    database: groups[6]
}
exports.dbWrapper = new DBWrapper('pg', herokuDbConnCfg);