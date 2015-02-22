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

/** dependancies */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/** view engine setup */
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/** load application resources */
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** DB config and utilities via wrapper */
var DBConfig = {
  db:{
    host:"localhost",
    database:"shamanic",
    username:"root",
    password:"password"
  }
}
var DBWrapper = require('node-dbi').DBWrapper;
var dbConnectionConfig = { host:DBConfig.db.host, user:DBConfig.db.username, password:DBConfig.db.password, database:DBConfig.db.database };
var dbWrapper = new DBWrapper('pg', dbConnectionConfig);

/** Make our db accessible to our router */
app.use(function(req,res,next){
    req.db = dbWrapper;
    next();
});

/*************************************************************** 
 * MAP URLS TO ROUTES
 ***************************************************************/
var users = require('./routes/users');
var site = require('./routes/index');

/** homepage */
app.get('/', site.index);

/** users */
app.get('/users', users.list);
app.all('/user/:id/:op?', users.load);
app.get('/user/:id', users.view);
app.get('/user/:id/view', users.view);
app.get('/user/:id/edit', users.edit);
app.put('/user/:id/edit', users.update);

/**************************************************************
 *  ERROR HANDLERS
 **************************************************************/

/** catch 404 and forwarding to error handler */
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/** development error handler will print stacktrace */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/** production error handler no stacktraces shown to user */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/** export the app */
module.exports = app;