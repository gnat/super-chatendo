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

      // Get all users stored in our Redis.
      redis.keys("user:*", (error, result) => {
        var users = [];

        // No users found?
        if (error) {
          console.log('Warning: Client heartbeat recieved but no users found.');
          return;
        }

        // Asynchronously query Redis for each user so we can make a definitive lobby list.
        Promise.all(result.map(row => {
          return new Promise(resolve => {
            redis.get(row, (error, result) => {
              // Redis error?
              if (error) {
                return;
              }
              // Parse result to JSON.
              try {
                var object = JSON.parse(result);
              } catch (e) {
                return; // Issue parsing JSON.
              }
              // Update our user list to send out.
              if (object.username) {
                users.push(object.username);
              }
              resolve(); // Success.
            })
          });
        }))
        .then(() => {
          // Send our lobby update.
          io.emit('userlist', JSON.stringify(users));
        });

      });
    });
  });
}
