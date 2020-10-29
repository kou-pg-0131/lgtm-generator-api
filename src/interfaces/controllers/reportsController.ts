import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ReportsControllerFactory } from '.';
import 'source-map-support/register';

export interface IReportsController {
  create(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2>;
}

export class ReportsController implements IReportsController {
  public async create(_event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    return {
      statusCode: 201,
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify({ message: 'hello' }),
    };
  }
}

export const createReport: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ReportsControllerFactory().create().create(event);
};
