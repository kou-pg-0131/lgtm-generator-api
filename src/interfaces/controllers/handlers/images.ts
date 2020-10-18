import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import 'source-map-support/register';

export const search: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  const q = event.queryStringParameters?.q

  return {
    statusCode: 200,
    body: JSON.stringify({ q }),
  };
};
