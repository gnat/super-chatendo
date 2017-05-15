'use strict';

// Dependencies.
var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var socketio = require('socket.io');
var Redis = require('ioredis');

// Configuration.
var config = require('./config/config');
var base_url = process.env.BASE_URL || 'http://localhost:' + config.PORT;

// Setup.
var app = express();
app.set('port', config.PORT);

// Listen on provided port, on all network interfaces.
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
})

// Setup Socket.io and Redis.
var io = socketio(server);
var redis = Redis(config.REDISPORT);

// View engine setup.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up middleware.
app.use(logger('dev')); // Colored logs. Use 'combined' for Apache style.
app.use(express.static(path.join(__dirname, 'public'))); // Static files.
app.use(bodyParser.urlencoded({ extended: true })); // Parse request body.
app.use(methodOverride('_method')); // Allow overriding methods in query (?_method=put).

// Autoload Controllers and Event handlers.
require('./lib/autoload')(app, io, redis, config);

/** Render special 404 page when no middleware has responded. */
app.use(function notFoundHandler(req, res, next) {
  res.status(404).render('404', {
    url: req.originalUrl
  });
});

/** Console log error handler. */
app.use(function consoleErrorHandler(err, req, res, next) {
  console.error(err.stack); // Push error to stderr.
  next(err); // Pass to next handler.
});

/** Final error handler. Render special error page. */
app.use(function errorHandler(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  //if(req.app.get('env') !== 'development') res.locals.error = 'Please contact the developer!';
  res.status(500).render('error'); // Render error page.
});

// Server init handled in /bin/www. Allows for importing app for test suite, etc.
//module.exports = app;
