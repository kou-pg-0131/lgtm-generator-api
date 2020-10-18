import { JsonParser } from '.';
import { LgtmsControllerFactory } from '..';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import 'source-map-support/register';

type CreateInput = {
  base64: string;
};

export const getAll: APIGatewayProxyHandlerV2 = async (_event, _context, _callback) => {
  const controller = new LgtmsControllerFactory().create();
  const lgtms = await controller.getAll();

  return {
    statusCode: 200,
    body: JSON.stringify(lgtms),
  };
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
  const lgtm = await controller.create({
    base64: input.base64,
  });

  return {
    statusCode: 201,
    body: JSON.stringify(lgtm),
  };
};
