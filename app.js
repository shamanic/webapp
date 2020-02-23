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
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('cookie-session');

/** view engine setup */
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/** load application resources */
app.use(favicon('public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** cookie parsing sessions, create with application settings keys */
var AppSettings = require('./settings/settings.js');
app.use(cookieParser(AppSettings.sessionKeys.cookieParserKey));
app.use(session({secret: AppSettings.sessionKeys.sessionKey}));

/** make our db and application models and other global libraries accessible to our router */
var dbi = require('./db/config');
dbi.dbWrapper.connect();
app.use(function(req,res,next){
    req.db = dbi.dbWrapper;
    req.db.DBExpr = require('node-dbi').DBExpr; 
    req.bcrypt = bcrypt;
    next();
});

/** generic require logged in user checking for any routes that may require it  */
function requireLogin (req, res, next) {
  if (!req.session.user) {
    res.redirect('/user/login');
  } else {
    next();
  }
};

/** check user logged in */
app.use(function (req, res, next) {
	res.locals.loggedIn =false;
	  if (req.session.user) {
		  res.locals.loggedIn =true;
	  }
	next();
});

/*************************************************************** 
 * MAP URLS TO ROUTES
 ***************************************************************/
var site = require('./controllers/index');
var game = require('./controllers/game');
var users = require('./controllers/users');

/** 
 * HOMEPAGE 
 */
app.get('/', site.index);

/** 
 * PLAY GAME 
 */
app.get('/game', requireLogin, game.index);

/** 
 * USERS 
 */

/** login / logout */
app.get('/user/login', users.login);
app.post('/user/checkLogin', users.checkLogin);
app.get('/user/logout', users.logout);

/** edit account */
app.get('/user/account', requireLogin, users.myaccount);
app.post('/user/update', requireLogin, users.update);

/** create users */
app.get('/user/signup', users.signup);
app.post('/user/create', users.create);
app.post('/user/checkExistingValue', users.checkExistingUserValues);

/** forgot login */
app.get('/user/forgot', users.forgot);
app.post('/user/checkForgot', users.checkForgot);

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
    	title: 'Application Error',
        message: err.message,
        error: {}
    });
});

/** development error handler will print stacktrace */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
        	title: 'Application Error',
            message: err.message,
            error: err
        });
    });
}

/** export the app */
module.exports = app;
console.log('NodeJS application started...');
