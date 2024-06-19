const redisClient = require('../utils/redis');

describe('Redis Client', () => {
  it('should connect to Redis', async () => {
    const isAlive = await redisClient.isAlive();
    expect(isAlive).toBe(true);
  });

  it('should set and get values', async () => {
    await redisClient.set('test_key', 'test_value', 10);
    const value = await redisClient.get('test_key');
    expect(value).toBe('test_value');
  });
});
