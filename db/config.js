/**
 * Shamanic Web Application
 * @copyright 2015 Shamanic
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** 
 * DB config and utilities via wrapper 
 */
var AppSettings = require('../settings/settings.js');
var DBWrapper = require('node-dbi').DBWrapper;
var dbConnectionConfig = { host:AppSettings.DBConfig.db.host, user:AppSettings.DBConfig.db.username, password:AppSettings.DBConfig.db.password, database:AppSettings.DBConfig.db.database };
exports.dbWrapper = new DBWrapper('pg', dbConnectionConfig);