/** dependancies */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/** map route variables */
var routes = require('./routes/index');
var users = require('./routes/users');

/** view engine setup */
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** map URLs to routes */
app.use('/', routes);
app.use('/users', users);

/** DB config */
var config = {
  db:{
    host:"localhost",
    database:"shamanic",
    username:"root",
    password:"password"
  },
}

/**
 * DB utilities via wrapper
 */
var DBWrapper = require('node-dbi').DBWrapper;
var dbConnectionConfig = { host:config.db.host, user:config.db.username, password:config.db.password, database:config.db.database };
var dbWrapper = new DBWrapper('pg', dbConnectionConfig);

/*

@todo

dbWrapper.connect();
dbWrapper.fetchAll('select 1 where 1', null, function (err, result) {
  if (!err) {
    console.log("Data came back from the DB.");
  } else {
    console.log("DB returned an error: %s", err);
  }
  dbWrapper.close(function (close_err) {
    if (close_err) {
      console.log("Error while disconnecting: %s", close_err);
    }
  });
});

module.exports = config;
module.exports = dbWrapper;

*/

/**************************
 *  error handlers
 **************************/

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
