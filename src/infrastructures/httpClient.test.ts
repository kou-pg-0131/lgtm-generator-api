import axios from 'axios';
import { HttpClient } from '.';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('HttpClient', () => {
  const httpClient = new HttpClient();
  describe('get()', () => {
    it('should call axios.get with correct args', async () => {
      (axios as any).get = jest.fn().mockResolvedValue({ data: 'RESPONSE', status: 200 });
      const response = await httpClient.get('https://example.com');
      expect(response).toEqual({ data: 'RESPONSE', status: 200 });
    });
  });
});
