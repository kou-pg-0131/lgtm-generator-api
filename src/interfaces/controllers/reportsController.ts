import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ReportType } from '../../domain';
import { IReportsRepository } from '../gateways';
import { ReportsControllerFactory, IRenderer, IResponse } from '.';
import 'source-map-support/register';

export interface IReportsController {
  create(event: APIGatewayProxyEventV2): Promise<IResponse>;
}

type CreateInput = {
  type: ReportType;
  text: string;
  lgtm_id: string;
};

export class ReportsController implements IReportsController {
  constructor(private config: { reportsRepository: IReportsRepository; renderer: IRenderer; }) {}

  public async create(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const input = JSON.parse(event.body) as CreateInput;
    if (!Object.values(ReportType).includes(input.type)) return this.config.renderer.badRequest();

    const report = await this.config.reportsRepository.create({ type: input.type, text: input.text, lgtmId: input.lgtm_id });
    return this.config.renderer.created(JSON.stringify(report));
  }
}

export const createReport: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ReportsControllerFactory().create().create(event) as APIGatewayProxyResultV2;
};
