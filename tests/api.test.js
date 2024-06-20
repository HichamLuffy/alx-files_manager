const request = require('supertest');
const app = require('../server');
describe('API Endpoints', () => {
  it('should get the status', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('redis');
    expect(res.body).toHaveProperty('db');
  });

  it('should get stats', async () => {
    const res = await request(app).get('/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('files');
  });


});
