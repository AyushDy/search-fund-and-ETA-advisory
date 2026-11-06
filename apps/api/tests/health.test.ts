import request from 'supertest';
import { createApp } from '../src/app';

describe('health endpoint', () => {
  it('reports that the API process is running', async () => {
    const response = await request(createApp()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, message: 'API is running', data: { status: 'ok' } });
  });

  it('returns a controlled response for unknown routes', async () => {
    const response = await request(createApp()).get('/missing');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
