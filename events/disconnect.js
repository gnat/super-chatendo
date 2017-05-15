/**
 * Disconnect endpoint for Socket.io.
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