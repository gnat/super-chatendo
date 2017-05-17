var async = require('async');

/**
 * List all Users currently active.
 * Endpoint for Socket.io
 * @param {Object} app App instance.
 * @param {Object} io Socket.io instance.
 * @param {Object} redis Redis instance.
 * @param {Object} config Config instance.
 */
exports.index = function(app, io, redis, config) {
  io.sockets.on('connection', function(socket) {
    socket.on('userlist', function(message) {

      console.log('Client heartbeat recieved: ' + socket.id);

      // Use this opportunity as a heartbeat to keep our own user alive in the server list.
      redis.expire("user:" + socket.id, config.USER_TIME_EXPIRE);

      // Get all users in Redis.
      redis.keys("user:*", function(err, result) {
        var users = [];

        // No users found?
        if (err) {
          console.log('Warning: Client heartbeat recieved but no users found.');
          return;
        }

        // Asynchronously call Redis to get all users so we can make a lobby list.
        async.each(result, function(row, callback) {
          redis.get(row, function(err, result) {
            // Redis error?
            if (err) {
              callback();
              return;
            }
            // Parse to JSON.
            try {
              var object = JSON.parse(result);
            } catch (e) {
              callback(); // Issue parsing JSON.
              return;
            }
            // Update our user list to send out.
            if (object.username) {
              users.push(object.username);
            }
            callback(); // Success.
          })

        }, function() {
          // Send our lobby update.
          io.emit('userlist', JSON.stringify(users));
        });
      });
    });
  });
}
