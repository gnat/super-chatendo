/**
 * Disconnect a User and make inactive.
 * Endpoint for Socket.io.
 * @param {Object} app App instance.
 * @param {Object} io Socket.io instance.
 * @param {Object} redis Redis instance.
 * @param {Object} config Config instance.
 */
exports.index = function(app, io, redis, config) {
  io.sockets.on('connection', function(socket) {
    socket.on('disconnect', function() {
      // Remove User from Redis.
      var tag = "user:" + socket.id;
      console.log('User disconnected: ' + tag);
      redis.del(tag);
    });
  });
}
