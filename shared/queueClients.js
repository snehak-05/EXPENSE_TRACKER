const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const { redis } = require('./config');

const connection = new IORedis(redis);
const transactionQueue = new Queue('transactions', { connection });

module.exports = { transactionQueue, Worker, connection };
