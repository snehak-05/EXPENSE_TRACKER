const { Worker } = require('bullmq');
const { connection } = require('../../shared/queueClients');
const { pubClient, cacheClient } = require('../../shared/redisClient');
const { walletEventChannel } = require('../../shared/config');

const balances = new Map();

const worker = new Worker(
  'transactions',
  async (job) => {
    const { userId, type, amount, jobId } = job.data;
    const prevBal = balances.get(userId) || 0;
    let newBal = prevBal;

    if (type === 'add') newBal = prevBal + amount;
    else if (type === 'withdraw') {
      if (prevBal < amount) {
        await pubClient.publish(walletEventChannel, JSON.stringify({ userId, status: 'failed', reason: 'insufficient_funds' }));
        return;
      }
      newBal = prevBal - amount;
    }

    balances.set(userId, newBal);
    await cacheClient.set(`wallet:${userId}:balance`, String(newBal));
    await pubClient.publish(walletEventChannel, JSON.stringify({ userId, type, amount, balance: newBal, status: 'success' }));
  },
  { connection }
);

worker.on('completed', (job) => console.log(`Job done: ${job.id}`));
worker.on('failed', (job, err) => console.error('Job failed', job?.id, err));
