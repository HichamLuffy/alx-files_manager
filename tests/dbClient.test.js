const dbClient = require('../utils/db');

describe('DB Client', () => {
  it('should connect to MongoDB', async () => {
    const isAlive = await dbClient.isAlive();
    expect(isAlive).toBe(true);
  });

  it('should retrieve the number of users', async () => {
    const nbUsers = await dbClient.nbUsers();
    expect(typeof nbUsers).toBe('number');
  });
});
