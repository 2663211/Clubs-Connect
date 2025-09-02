// server/tests/api.test.js
import request from 'supertest';
import { app } from '../index.js'; // your Express app

describe('Clubs Connect API', () => {
  // Health check
  describe('GET /', () => {
    it('should return server status', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Server is running!');
      expect(res.body).toHaveProperty('timestamp');
      expect(new Date(res.body.timestamp).toString()).not.toBe('Invalid Date');
    });
  });

  // Events endpoint
  describe('GET /api/events', () => {
    it('should return an array of upcoming events', async () => {
      const res = await request(app).get('/api/events');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      res.body.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('title');
        expect(event).toHaveProperty('date');
        expect(event).toHaveProperty('location');
        expect(event).toHaveProperty('description');

        // Optional: check if event date is in the future
        const eventDate = new Date(event.date);
        expect(eventDate.getTime()).toBeGreaterThanOrEqual(new Date().getTime());
      });
    });

    it('should handle empty events array gracefully', async () => {
      const res = await request(app).get('/api/events');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
