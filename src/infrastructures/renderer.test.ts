import { Renderer } from '.';

describe('Renderer', () => {
  const renderer = new Renderer();
  describe('ok()', () => {
    it('should return 200 response', () => {
      const response = renderer.ok({ body: 'BODY' });
      expect(response).toEqual({
        statusCode: 200,
        body: 'BODY',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  });

  describe('created()', () => {
    it('should return 201 response', () => {
      const response = renderer.created({ body: 'BODY' });
      expect(response).toEqual({
        statusCode: 201,
        body: 'BODY',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  });

  describe('badRequest()', () => {
    it('should return 400 response', () => {
      const response = renderer.badRequest();
      expect(response).toEqual({
        statusCode: 400,
        body: '{"message":"Bad Request"}',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  });
});
