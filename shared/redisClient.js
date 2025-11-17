const IORedis = require('ioredis');
const { redis } = require('./config');

const cacheClient = new IORedis(redis);

const pubSubClient = new IORedis(redis);

const pubClient = pubSubClient.duplicate(); 
const subClient = pubSubClient.duplicate(); 

module.exports = { cacheClient, pubClient, subClient };
