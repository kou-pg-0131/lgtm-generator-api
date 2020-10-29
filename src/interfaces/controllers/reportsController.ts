import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ReportType } from '../../domain';
import { IReportsUsecase } from '../../usecases';
import { JsonParser, ReportsControllerFactory, IRenderer, IResponse } from '.';
import 'source-map-support/register';

export interface IReportsController {
  create(event: APIGatewayProxyEventV2): Promise<IResponse>;
}

type CreateInput = {
  type?: ReportType;
  text?: string;
};

export class ReportsController implements IReportsController {
  private renderer: IRenderer;
  private reportsUsecase: IReportsUsecase;

  constructor(config: { reportsUsecase: IReportsUsecase; renderer: IRenderer; }) {
    this.reportsUsecase = config.reportsUsecase;
    this.renderer = config.renderer;
  }

  public async create(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const input = new JsonParser().parse<CreateInput>(event.body);
    if (!input) return this.renderer.badRequest();
    if (input.text == undefined || input.type == undefined) return this.renderer.badRequest();
    if (input.text.length > 1000) return this.renderer.badRequest();
    if (!Object.values(ReportType).includes(input.type)) return this.renderer.badRequest();

    const report = await this.reportsUsecase.create({ type: input.type, text: input.text });
    return this.renderer.created({ body: JSON.stringify(report), contentType: 'application/json' });
  }
}

export const createReport: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ReportsControllerFactory().create().create(event) as APIGatewayProxyResultV2;
};
