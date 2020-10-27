import { JsonParser } from '.';
import { LgtmsControllerFactory } from '..';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import 'source-map-support/register';

type CreateInput = {
  base64?: string;
  url?: string;
};

export const getAll: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  const controller = new LgtmsControllerFactory().create();
  const { lgtms, evaluatedId } = await controller.getAll({ evaluatedId: event.queryStringParameters?.evaluated_id });

  return {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify({ lgtms, evaluated_id: evaluatedId }),
  };
};

export const create: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  const [input, ok]: [CreateInput, boolean] = new JsonParser().parse(event.body);

  if (!ok || (!input.base64 && !input.url)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON.' }),
    };
  }

  const controller = new LgtmsControllerFactory().create();
  const lgtm = await controller.create(input);

  return {
    statusCode: 201,
    headers: {
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify(lgtm),
  };
};
