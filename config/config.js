var config = {
  PORT: getEnv('PORT', 3000),
  REDISPORT: getEnv('REDISPORT', 6379),
  REDISURL: getEnv('REDISURL', 'localhost'),
  MESSAGE_MAX_LENGTH: getEnv('MESSAGE_MAX_LENGTH', 3000),
  USERNAME_MAX_LENGTH: getEnv('USERNAME_MAX_LENGTH', 30),
  USER_TIME_EXPIRE: getEnv('USER_TIME_EXPIRE', 22), // In seconds.
};
 
/** 
 * Return environment variable. If not found, return a fallback value.
 * @param {string} variable Environment variable to find.
 * @param {string|number} fallback Fallback value if environment variable is not found.
 * @return {string|number} Value to use.
 */
function getEnv(variable, fallback) {
  if(process.env[variable] === undefined) {
    return fallback;
  }
  return process.env[variable];
}
 
module.exports = config;
