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
app.set('view engine', 'ejs');

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

/** make our db accessible to our router */
app.use(function(req,res,next){
    req.db = dbWrapper;
    next();
});

/*************************************************************** 
 * MAP URLS TO ROUTES
 ***************************************************************/
var site = require('./controllers/index');
var game = require('./controllers/game');
var users = require('./controllers/users');
var userModel = require('./models/userModel');

/** homepage */
app.get('/', site.index);

/** play game */
app.get('/game', game.index);

/** users */
app.get('/user/account', users.myaccount);
app.get('/user/login', users.login);
app.get('/user/logout', users.logout);
app.get('/user/update', users.update);
app.get('/user/signup', users.signup);

/**************************************************************
 *  ERROR HANDLERS
 **************************************************************/

/** catch 404 and forwarding to error handler */
app.use(function(req, res, next) {
    var err = new Error('HTTP 404 Page can not be found.');
    err.status = 404;
    next(err);
});

/** production error handler no stacktraces shown to user */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
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

/** export the app */
module.exports = app;