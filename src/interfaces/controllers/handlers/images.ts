import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ImagesControllerFactory } from '..';
import 'source-map-support/register';

export const search: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  const q = event.queryStringParameters?.q;
  if (!q) return { statusCode: 400, body: JSON.stringify({ message: 'Query is empty.' }) };

  const controller = new ImagesControllerFactory().create();
  const images = await controller.search(q);

  return {
    statusCode: 200,
    body: JSON.stringify(images),
  };
};
