const { transactionQueue } = require('../../shared/queueClients');
const { cacheClient } = require('../../shared/redisClient');
const { v4: uuidv4 } = require('uuid');

async function addMoney(req, res) {
  try {
    const { id: userId } = req.user;
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const jobId = uuidv4();
    await transactionQueue.add('add', { jobId, userId, type: 'add', amount }, { jobId });

    res.status(202).json({ message: 'Transaction queued', jobId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function withdrawMoney(req, res) {
  try {
    const { id: userId } = req.user;
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const jobId = uuidv4();
    await transactionQueue.add('withdraw', { jobId, userId, type: 'withdraw', amount }, { jobId });

    res.status(202).json({ message: 'Transaction queued', jobId });
  } catch (err) {  
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function getBalance(req, res) {
  const userId = req.user.id;
  const cacheKey = `wallet:${userId}:balance`;
  const balance = await cacheClient.get(cacheKey) || 0;
  res.json({ balance: Number(balance) });
}

module.exports = { addMoney, withdrawMoney, getBalance };
