import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { IReportsUsecase } from '../../usecases';
import { ReportsControllerFactory } from '.';
import 'source-map-support/register';

export interface IReportsController {
  create(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2>;
}

export class ReportsController implements IReportsController {
  private reportsUsecase: IReportsUsecase;

  constructor(config: { reportsUsecase: IReportsUsecase; }) {
    this.reportsUsecase = config.reportsUsecase;
  }

  public async create(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    // FIXME: use JsonParser
    const input = JSON.parse(event.body);
    const report = await this.reportsUsecase.create(input);

    return {
      statusCode: 201,
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(report),
    };
  }
}

export const createReport: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ReportsControllerFactory().create().create(event);
};
