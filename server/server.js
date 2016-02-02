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

// dependencies
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('cookie-session');

// view engine setup
var server = express();
server.set('views', path.join(__dirname, '../ui/html'));
server.set('view engine', 'ejs');

// global environment settings
var SiteEnvironment = require('../config/environment.js');
server.use(function(req,res,next){
    req.siteEnvironment = SiteEnvironment;
    next();
});

// load application resources
server.use(favicon());
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());
server.use(cookieParser());
server.use('/ui/images',express.static(path.join(__dirname, '../ui/images')));
server.use('/ui/javascripts',express.static(path.join(__dirname, '../ui/javascripts')));
server.use('/ui/stylesheets',express.static(path.join(__dirname, '../ui/stylesheets')));

// setup global app settings, cookie parsing sessions, create with application settings keys
var AppSettings = require('../config/settings.js');
server.use(cookieParser(AppSettings.sessionKeys.cookieParserKey));
server.use(session({secret: AppSettings.sessionKeys.sessionKey}));
server.use(function(req,res,next){
    req.appSettings = AppSettings;
    next();
});

// make our db and application models and other global libraries accessible to our router
var dbi = require('./db/config');
dbi.dbWrapper.connect();
server.use(function(req,res,next){
    req.db = dbi.dbWrapper;
    req.db.DBExpr = require('node-dbi').DBExpr;
    req.bcrypt = bcrypt;
    next();
});

// generic require logged in user checking for any routes that may require it
function requireLogin (req, res, next) {
  if (!req.session.user) {
    res.redirect('/user/login');
  } else {
    next();
  }
};

// check user logged in
server.use(function (req, res, next) {
	res.locals.loggedIn =false;
	  if (req.session.user) {
		  res.locals.loggedIn =true;
	  }
	next();
});

//determine if the user requesting the page is an admin, for Utils pages
function isAdmin (req, res, next) {
    if (!req.session.user.is_admin) {
        console.log(req.session.user.username + 'requested an admin page without credentials');
        res.redirect('/');
    } else {
        console.log(req.session.user.username + ', an admin, requested an admin page');
        next();
    }
}

// server.use(function (req, res, next) {
//     res.locals.isAdmin = false;
//     if (req.session.user.is_admin) {
//         res.locals.isAdmin = true;
//     }
//     next();
// });

// find the user's icon from the database
server.param('basecamp_icon', function(req, res, next, id) {

    if(err) {
        next(err);
    } else if(req.session.user) {
        req.basecamp_icon =  basecamp_icon;
        next();
    } else {
        next(new Error('failed to get the user\'s basecamp icon'));
    }

})

/***************************************************************
 * MAP URLS TO ROUTES
 ***************************************************************/
var site = require('./controllers/index');
var game = require('./controllers/game');
var users = require('./controllers/users');
var utils = require('./controllers/utilities');

// HOMEPAGE //
server.get('/', site.index);

// PLAY GAME //
server.get('/game', requireLogin, game.index);
server.get('/basecamp', requireLogin, game.basecamp);
server.get('/threejs', game.threejs);
server.get('/game/sigils', game.getSigils);

// USERS //
// login / logout
server.get('/user/login', users.login);
server.post('/user/checkLogin', users.checkLogin);
server.get('/user/logout', users.logout);
server.get('/user/isLoggedIn', users.isLoggedIn);

// edit account
server.get('/user/account', requireLogin, users.myaccount);
server.post('/user/update', requireLogin, users.update);

// create users
server.get('/user/signup', users.signup);
server.post('/user/create', users.create);
server.post('/user/checkExistingValue', users.checkExistingUserValues);

// forgot login
server.get('/user/forgot', users.forgot);
server.post('/user/checkForgot', users.checkForgot);

// user persists location info
server.post('/user/saveLocation', users.saveLocation);
server.get('/user/getAltitude', users.getAltitude);


// UTILITIES
/** Components for Monitoring/Traffic/Maintenance */

// locations tables
server.get('/utilities/locations', isAdmin, utils.locations);

// get the list of users / also in JSON format
server.get('/utilities/getUsers', isAdmin, utils.getUsers);
server.get('/utilities/getUsersJSON', isAdmin, utils.getUsersJSON);

//get lists of location points
server.get('/utilities/getLocationsForUser', isAdmin, utils.getLocationsForUser);
server.get('/utilities/getAllLocations', isAdmin, utils.getAllLocations);


/**************************************************************
 *  ERROR HANDLERS
 **************************************************************/

// catch 404 and forwarding to error handler
server.use(function(req, res, next) {
    var err = new Error('HTTP 404 Page can not be found.');
    err.status = 404;
    next(err);
});

// production error handler no stacktraces shown to user
server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    	title: 'Application Error',
        message: err.message,
        error: {}
    });
});

// development error handler will print stacktrace
if (server.get('env') === 'development') {
    server.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
        	title: 'Application Error',
            message: err.message,
            error: err
        });
    });
}

// export the server
module.exports = server;
console.log('NodeJS application started...');
