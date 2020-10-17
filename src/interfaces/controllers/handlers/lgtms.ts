import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import 'source-map-support/register';

export const create: APIGatewayProxyHandlerV2 = async (_event, _context, _callback) => {
  return {
    statusCode: 201,
    body: JSON.stringify({ message: 'hello world' }),
  };
};
