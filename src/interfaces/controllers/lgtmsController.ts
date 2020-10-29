import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import { ILgtmsUsecase } from '../../usecases';
import { LgtmsControllerFactory, IRenderer, IResponse } from '.';
import 'source-map-support/register';

export interface ILgtmsController {
  getAll(event: APIGatewayProxyEventV2): Promise<IResponse>;
  create(event: APIGatewayProxyEventV2): Promise<IResponse>;
}

export class LgtmsController implements ILgtmsController {
  private renderer: IRenderer;
  private lgtmsUsecase: ILgtmsUsecase;

  constructor(config: { lgtmsUsecase: ILgtmsUsecase; renderer: IRenderer; }) {
    this.lgtmsUsecase = config.lgtmsUsecase;
    this.renderer = config.renderer;
  }

  public async getAll(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const { lgtms, evaluatedId } = await this.lgtmsUsecase.getAll({ evaluatedId: event.queryStringParameters?.evaluated_id });
    return this.renderer.ok({ body: JSON.stringify({ lgtms, evaluated_id: evaluatedId }), contentType: 'application/json' });
  }

  public async create(event: APIGatewayProxyEventV2): Promise<IResponse> {
    // FIXME: use jsonparser
    const input = JSON.parse(event.body);
    const lgtm = await this.lgtmsUsecase.create(input);
    return this.renderer.created({ body: JSON.stringify(lgtm), contentType: 'application/json' });
  }
}

export const getAllLgtms: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new LgtmsControllerFactory().create().getAll(event);
};

export const createLgtm: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new LgtmsControllerFactory().create().create(event);
};
