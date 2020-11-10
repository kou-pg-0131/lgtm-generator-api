import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ILgtmsRepository } from '../gateways';
import { LgtmsControllerFactory, IRenderer, IResponse } from '.';
import 'source-map-support/register';

export interface ILgtmsController {
  getAll(event: APIGatewayProxyEventV2): Promise<IResponse>;
  create(event: APIGatewayProxyEventV2): Promise<IResponse>;
  delete(event?: { lgtmId?: string; }): Promise<void>;
}

type CreateInput = {
  base64?: string;
  url?: string;
};

type DeleteInput = {
  lgtmId?: string;
};

export class LgtmsController implements ILgtmsController {
  constructor(private config: { lgtmsRepository: ILgtmsRepository; renderer: IRenderer; }) {}

  public async getAll(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const { lgtms, evaluatedId } = await this.config.lgtmsRepository.getAll({ evaluatedId: event.queryStringParameters?.evaluated_id });
    return this.config.renderer.ok(JSON.stringify({ lgtms, evaluated_id: evaluatedId }));
  }

  public async create(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const input = JSON.parse(event.body) as CreateInput;
    if (!input) return this.config.renderer.badRequest();

    const lgtm = await this.config.lgtmsRepository.create(input);
    return this.config.renderer.created(JSON.stringify(lgtm));
  }

  public async delete(event?: DeleteInput): Promise<void> {
    if (!event) throw new Error('event is empty');
    if (!event.lgtmId) throw new Error('lgtmId is empty');

    await this.config.lgtmsRepository.delete({ id: event.lgtmId });
  }
}

export const getAllLgtms: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new LgtmsControllerFactory().create().getAll(event) as APIGatewayProxyResultV2;
};

export const createLgtm: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new LgtmsControllerFactory().create().create(event) as APIGatewayProxyResultV2;
};

export const deleteLgtm = async (event?: DeleteInput): Promise<void> => {
  return new LgtmsControllerFactory().create().delete(event);
};
