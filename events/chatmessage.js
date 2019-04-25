// User input sanitisation.
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

/**
 * User chat message handling.
 * Endpoint for Socket.io.
 * @param {Object} app App instance.
 * @param {Object} io Socket.io instance.
 * @param {Object} redis Redis instance.
 * @param {Object} config Config instance.
 */
exports.index = (app, io, redis, config) => {
  io.sockets.on('connection', socket => {
    socket.on('chatmessage', message => {

      // Is this a valid message?
      if (message.message == null) {
        return console.log("Invalid JSON sent to: " + __filename);
      }

      // Ensure message is filtered and it's not too long.
      message.message = message.message.substring(0, config.MESSAGE_MAX_LENGTH);
      message.message = entities.encode(message.message);

      // See which user this belongs to and send associated color.
      var tag = "user:" + socket.id;
      redis.get(tag, (error, result) => {
        // Don't bother displaying message if user does not exist.
        if (error) {
          console.log('Could not find user: ' + tag);
          return;
        }
        result = JSON.parse(result);
        // Only continue if stored object is valid.
        if (result) {
          message.color = result.color;
          message.username = result.username;
          console.log('Message from: ' + result.username + ' - ' + message.message);
          io.emit('chatmessage', message);
        }
      });
    });
  });
}
