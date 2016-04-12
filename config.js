var config = {
  REDIS_URL: getEnv('REDIS_URL'),
  PORT: getEnv('PORT')
};

function getEnv(variable){
  if (process.env[variable] === undefined){
    throw new Error('You must create an environment variable for ' + variable);
  }

  return process.env[variable];
};

module.exports = config;
