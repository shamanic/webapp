/** DB config and utilities via wrapper */
var DBConfig = {
  db:{
    host:"localhost",
    username:"shamanic_user",
    password:"password",
    database:"shamanic"
  }
}
var DBWrapper = require('node-dbi').DBWrapper;
var dbConnectionConfig = { host:DBConfig.db.host, user:DBConfig.db.username, password:DBConfig.db.password, database:DBConfig.db.database };
exports.dbWrapper = new DBWrapper('pg', dbConnectionConfig);