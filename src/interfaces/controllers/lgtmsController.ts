import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ILgtmsRepository } from '../gateways';
import { LgtmsControllerFactory, IRenderer, IResponse, JsonParser } from '.';
import 'source-map-support/register';

export interface ILgtmsController {
  getAll(event: APIGatewayProxyEventV2): Promise<IResponse>;
  create(event: APIGatewayProxyEventV2): Promise<IResponse>;
}

type CreateInput = {
  base64?: string;
  url?: string;
};

export class LgtmsController implements ILgtmsController {
  private renderer: IRenderer;
  private lgtmsRepository: ILgtmsRepository;

  constructor(config: { lgtmsRepository: ILgtmsRepository; renderer: IRenderer; }) {
    this.lgtmsRepository = config.lgtmsRepository;
    this.renderer = config.renderer;
  }

  public async getAll(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const { lgtms, evaluatedId } = await this.lgtmsRepository.getAll({ evaluatedId: event.queryStringParameters?.evaluated_id });
    return this.renderer.ok({ body: JSON.stringify({ lgtms, evaluated_id: evaluatedId }), contentType: 'application/json' });
  }

  public async create(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const input = new JsonParser().parse<CreateInput>(event.body);
    if (!input) return this.renderer.badRequest();
    if (input.base64 != undefined && input.url != undefined) return this.renderer.badRequest();
    if (input.base64 == undefined && input.url == undefined) return this.renderer.badRequest();
    if (typeof (input.base64 || input.url) !== 'string') return this.renderer.badRequest();

    const lgtm = await this.lgtmsRepository.create({ imageSrc: input.url || Buffer.from(input.base64, 'base64') });
    return this.renderer.created({ body: JSON.stringify(lgtm), contentType: 'application/json' });
  }
}

export const getAllLgtms: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new LgtmsControllerFactory().create().getAll(event) as APIGatewayProxyResultV2;
};

export const createLgtm: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new LgtmsControllerFactory().create().create(event) as APIGatewayProxyResultV2;
};
