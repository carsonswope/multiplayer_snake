var config = require('../config'),
    redis = require('redis'),
    url = require('url');

console.log(process.env.REDIS_URL);

var redisConfig = url.parse(config.REDIS_URL);
var client = redis.createClient(redisConfig.port, redisConfig.hostname);

if (redisConfig.auth !== null)
  client.auth(redisConfig.auth.split(':')[1]);

client.on('error', function(e){
  console.log(e);
});

module.exports = client;
