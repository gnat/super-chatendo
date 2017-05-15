var config = {
  PORT: 3000, //getEnv('PORT')
  REDISPORT: 6379, //getEnv('REDISPORT')
  REDISURL: 'localhost', //getEnv('REDISURL')
  MESSAGE_MAX_LENGTH: 3000,
  USERNAME_MAX_LENGTH: 30,
  USER_TIME_EXPIRE: 22, // In seconds.
};
 
/** 
 * Return environment variable. If not found, throw error.
 * @param {string} variable Environment variable to find.
 */
function getEnv(variable){
  if(process.env[variable] === undefined) {
    throw new Error('You must create an environment variable for ' + variable);
  }
  return process.env[variable];
};
 
module.exports = config;
