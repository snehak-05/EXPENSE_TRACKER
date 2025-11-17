module.exports = {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  },
  jwtSecret: process.env.JWT_SECRET || 'replace_me_with_secret',
  walletEventChannel: 'wallet:events',
};
