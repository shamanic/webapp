/**
 * Shamanic Web Server
 *
 * @author khinds, davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
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

// load application resources
server.use(favicon());
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());
server.use(cookieParser());
server.use('/ui/img',express.static(path.join(__dirname, '../ui/img')));
server.use('/ui/js',express.static(path.join(__dirname, '../ui/js')));
server.use('/ui/css',express.static(path.join(__dirname, '../ui/css')));

/*
|--------------------------------------------------------------------------
| Includes / Globals
|--------------------------------------------------------------------------
|
| Global settings, Database connectivity, helper utilties
*/

// global promises
var promise = require('promise');
server.use(function(req,res,next){
    req.promise = promise;
    next();
});

// setup global app settings, cookie parsing sessions, create with application settings keys
var appSettings = require('../config/settings');
server.use(cookieParser(appSettings.sessionKeys.cookieParserKey));
server.use(session({secret: appSettings.sessionKeys.sessionKey}));
server.use(function(req,res,next){
    req.appSettings = appSettings;
    next();
});

// global environment settings
var siteEnvironment = require('../config/environment');
server.use(function(req,res,next){
    req.siteEnvironment = siteEnvironment;
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

// include helpers
var variableHelper = require('./helpers/variables');
var emailHelper = require('./helpers/email');
server.use(function(req,res,next){
    req.variableHelper = variableHelper;
    req.emailHelper = emailHelper;
    next();
});

// include email service
var emailService = require("../node_modules/emailjs/email");
server.use(function(req,res,next){
    req.emailService = emailService;
    next();
});

/*
|--------------------------------------------------------------------------
| Models
|--------------------------------------------------------------------------
|
| Encapsulate system nouns
*/
var userModel = require('./models/users');
var locationModel = require('./models/locations');
server.use(function(req,res,next){
    req.userModel = userModel;
    req.locationModel = locationModel;

    // response isLoggedIn global value
    res.locals.loggedIn =false;
    if (req.session.user) {
	  res.locals.loggedIn =true;
    }
    next();
});

/*
|--------------------------------------------------------------------------
| Routing
|--------------------------------------------------------------------------
|
| Public URIs on the system
*/

// homepage
var site = require('./controllers/index');
server.get('/', site.index);
server.get('/about', site.about);

// users
var users = require('./controllers/users');
server.get('/user/login', users.login);
server.post('/user/checkLogin', users.checkLogin);
server.get('/user/logout', users.logout);
server.get('/user/isLoggedIn', users.isLoggedIn);
server.get('/user/account', users.requireLogin, users.myaccount);
server.post('/user/update', users.requireLogin, users.update);
server.get('/user/signup', users.signup);
server.post('/user/create', users.create);
server.post('/user/checkExistingValue', users.checkExistingUserValues);
server.get('/user/forgot', users.forgot);
server.post('/user/checkForgot', users.checkForgot);
server.post('/user/saveLocation', users.saveLocation);
server.get('/user/getAltitude', users.getAltitude);

//play game
var game = require('./controllers/game');
server.get('/game', users.requireLogin, game.index);
server.get('/basecamp', users.requireLogin, game.basecamp);
server.get('/threejs', game.threejs);
server.get('/game/sigils', game.getSigils);

// utilities (Components for Monitoring/Traffic/Maintenance)
var utils = require('./controllers/utilities');
server.get('/utilities/locations', users.isAdmin, utils.locations);
server.get('/utilities/getUsers', users.isAdmin, utils.getUsers);
server.get('/utilities/getUsersJSON', users.isAdmin, utils.getUsersJSON);
server.get('/utilities/getLocationsForUser', users.isAdmin, utils.getLocationsForUser);
server.get('/utilities/getAllLocations', users.isAdmin, utils.getAllLocations);

/*
|--------------------------------------------------------------------------
| Error Handling
|--------------------------------------------------------------------------
|
| HTTP 404, development settings for stack traces
*/

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

/*
|--------------------------------------------------------------------------
| Export & Run the Application
|--------------------------------------------------------------------------
|
| HTTP 404, development settings for stack traces
*/
module.exports = server;
console.log('NodeJS application started...');
