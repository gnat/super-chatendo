/**
 * User Add endpoint for Socket.io.
 */

// Random color generator.
var color = require('randomcolor');
// User input sanitisation.
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

exports.index = function(app, io, redis, config) {
  io.sockets.on('connection', function(socket) {
    socket.on('useradd', function(message) {

      // Ensure username is filtered and it's not too long.
      message = message.substring(0, config.USERNAME_MAX_LENGTH);
      message = entities.encode(message);

      console.log('Adding User: ' + message);

      // Set up User object.
      var tag = "user:" + socket.id;
      var obj = new Object();
      obj.username = message;
      obj.color = color.randomColor({ luminosity: 'dark' });
      obj.room = 'blah';

      // Add to client's lobby immediately.
      io.emit('useradd', message);

      // Store User object in Redis.
      redis.set(tag, JSON.stringify(obj), 'EX', config.USER_TIME_EXPIRE);
    });
  });
}