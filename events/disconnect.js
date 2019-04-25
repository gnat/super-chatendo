/**
 * Disconnect a User and make inactive.
 * Endpoint for Socket.io.
 * @param {Object} app App instance.
 * @param {Object} io Socket.io instance.
 * @param {Object} redis Redis instance.
 * @param {Object} config Config instance.
 */
exports.index = (app, io, redis, config) => {
  io.sockets.on('connection', (socket) => {
    socket.on('disconnect', () => {
      // Remove User from Redis.
      var tag = "user:" + socket.id;
      console.log('User disconnected: ' + tag);
      redis.del(tag);
    });
  });
}
