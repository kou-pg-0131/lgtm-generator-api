import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import { IReportsUsecase } from '../../usecases';
import { ReportsControllerFactory, IRenderer, IResponse } from '.';
import 'source-map-support/register';

export interface IReportsController {
  create(event: APIGatewayProxyEventV2): Promise<IResponse>;
}

export class ReportsController implements IReportsController {
  private renderer: IRenderer;
  private reportsUsecase: IReportsUsecase;

  constructor(config: { reportsUsecase: IReportsUsecase; renderer: IRenderer; }) {
    this.reportsUsecase = config.reportsUsecase;
    this.renderer = config.renderer;
  }

  public async create(event: APIGatewayProxyEventV2): Promise<IResponse> {
    // FIXME: use JsonParser
    const input = JSON.parse(event.body);
    const report = await this.reportsUsecase.create(input);
    return this.renderer.created({ body: JSON.stringify(report), contentType: 'application/json' });
  }
}

export const createReport: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ReportsControllerFactory().create().create(event);
};
