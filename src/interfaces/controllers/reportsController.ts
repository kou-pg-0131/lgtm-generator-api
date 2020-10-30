import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ReportType } from '../../domain';
import { IReportsRepository } from '../../usecases';
import { JsonParser, ReportsControllerFactory, IRenderer, IResponse } from '.';
import * as uuid from 'uuid';
import 'source-map-support/register';

export interface IReportsController {
  create(event: APIGatewayProxyEventV2): Promise<IResponse>;
}

type CreateInput = {
  type?: ReportType;
  text?: string;
  lgtm_id?: string;
};

export class ReportsController implements IReportsController {
  private renderer: IRenderer;
  private reportsRepository: IReportsRepository;

  constructor(config: { reportsRepository: IReportsRepository; renderer: IRenderer; }) {
    this.reportsRepository = config.reportsRepository;
    this.renderer = config.renderer;
  }

  public async create(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const input = new JsonParser().parse<CreateInput>(event.body);
    if (!input) return this.renderer.badRequest();
    if (input.text == undefined) return this.renderer.badRequest();
    if (input.type == undefined) return this.renderer.badRequest();
    if (input.lgtm_id == undefined) return this.renderer.badRequest();
    if (typeof input.text !== 'string') return this.renderer.badRequest();
    if (typeof input.type !== 'string') return this.renderer.badRequest();
    if (typeof input.lgtm_id !== 'string') return this.renderer.badRequest();
    if (input.text.length > 1000) return this.renderer.badRequest();
    if (!Object.values(ReportType).includes(input.type)) return this.renderer.badRequest();
    if (!uuid.validate(input.lgtm_id)) return this.renderer.badRequest();

    const report = await this.reportsRepository.create({ type: input.type, text: input.text, lgtmId: input.lgtm_id });
    return this.renderer.created({ body: JSON.stringify(report), contentType: 'application/json' });
  }
}

export const createReport: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ReportsControllerFactory().create().create(event) as APIGatewayProxyResultV2;
};
