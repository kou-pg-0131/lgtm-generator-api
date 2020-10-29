import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import 'source-map-support/register';

export const createReport: APIGatewayProxyHandlerV2 = async (_event, _context, _callback) => {
  return {
    statusCode: 201,
    headers: {
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify({ message: 'hello' }),
  };
};
