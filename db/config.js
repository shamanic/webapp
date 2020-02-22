/** 
 * DB config and utilities via wrapper 
 */
var AppSettings = require('../settings/settings.js');
var DBWrapper = require('node-dbi').DBWrapper;
var dbConnectionConfig = { host:AppSettings.DBConfig.db.host, 
    user:AppSettings.DBConfig.db.username, 
    password:AppSettings.DBConfig.db.password, 
    database:AppSettings.DBConfig.db.database 
};
var regex = /(.*):\/\/([a-z].*):([0-9a-f].*)@(.*):([0-9]{4})\/([a-z0-9].*)/g;
var groups = process.env.DATABASE_URL.match(regex);
/*  groups[0]=dbAdapterName(postgres)
*   ://
*   groups[1]=username
*   :
*   groups[2]=password
*   @
*   groups[3]=host
*   :
*   groups[4]=port
*   /
*   groups[5]=database
*/
var herokuDbConnCfg = {
    host: groups[3],
    user: groups[1],
    password: groups[2],
    database: groups[5]
}
exports.dbWrapper = new DBWrapper('pg', herokuDbConnCfg);