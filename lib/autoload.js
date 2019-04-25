var express = require('express');
var fs = require('fs');
var path = require('path');

/**
 * Autoload Controllers and Event handlers for routing.
 * @param {Object} app App instance.
 * @param {Object} io Socket.io instance.
 * @param {Object} redis Redis instance.
 * @param {Object} config Config instance.
 */
module.exports = function Autoload(parent, io, redis, config) {

  // Autoload Events.
  var dir = path.join(__dirname, '..', 'events'); // Event directory.

  // Travel through directory to find events to load.
  fs.readdirSync(dir).forEach(name => {
    var file = path.join(dir, name)
    if (fs.statSync(file).isDirectory()) return; // Pass if directory.
    var obj = require(file);
    obj.index(parent, io, redis, config); // Attempt to load this event.
  });

  // Autoload Controllers.
  var dir = path.join(__dirname, '..', 'controllers'); // Controller directory.

  fs.readdirSync(dir).forEach(name => {
    var file = path.join(dir, name)
    if (fs.statSync(file).isDirectory()) return; // Pass if directory.
    var obj = require(file);
    var name = obj.name || name;
    var prefix = obj.prefix || '';
    var app = express();
    var handler;
    var method;
    var url;

    // Generate routes based on exported methods.
    for (var key in obj) {
      // Reserved exports.
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
      // Route exports
      switch (key) {
        case 'show':
          method = 'get';
          url = '/' + name + '/:' + name + '_id';
          break;
        case 'list':
          method = 'get';
          url = '/' + name + 's';
          break;
        case 'edit':
          method = 'get';
          url = '/' + name + '/:' + name + '_id/edit';
          break;
        case 'update':
          method = 'put';
          url = '/' + name + '/:' + name + '_id';
          break;
        case 'create':
          method = 'post';
          url = '/' + name;
          break;
        case 'index':
          method = 'get';
          url = '/';
          break;
        default:
          throw new Error('unrecognized route: ' + name + '.' + key);
      }

      handler = obj[key];
      url = prefix + url;

      // "Before" middleware support.
      if (obj.before) {
        app[method](url, obj.before, handler);
      } else {
        app[method](url, handler);
      }
    }

    // Add routes to app.
    parent.use(app);
  });
};