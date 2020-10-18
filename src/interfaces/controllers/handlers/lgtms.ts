import { JsonParser } from '.';
import { LgtmsControllerFactory } from '..';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import 'source-map-support/register';

type CreateInput = {
  base64: string;
};

export const create: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  const [input, ok]: [CreateInput, boolean] = new JsonParser().parse(event.body);

  if (!ok) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON.' }),
    }
  }

  const controller = new LgtmsControllerFactory().create();
  const base64 = controller.create(input);

  return {
    statusCode: 201,
    body: JSON.stringify({ base64 }),
  };
};
