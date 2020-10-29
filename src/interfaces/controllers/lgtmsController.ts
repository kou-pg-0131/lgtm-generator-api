import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ILgtmsUsecase } from '../../usecases';
import { LgtmsControllerFactory } from '.';
import 'source-map-support/register';

export interface ILgtmsController {
  getAll(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2>;
  create(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2>;
}

export class LgtmsController implements ILgtmsController {
  private lgtmsUsecase: ILgtmsUsecase;

  constructor(config: { lgtmsUsecase: ILgtmsUsecase; }) {
    this.lgtmsUsecase = config.lgtmsUsecase;
  }

  public async getAll(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const { lgtms, evaluatedId } = await this.lgtmsUsecase.getAll({ evaluatedId: event.queryStringParameters?.evaluated_id });

    return {
      statusCode: 200,
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify({ lgtms, evaluated_id: evaluatedId }),
    };
  }

  public async create(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    // FIXME: use jsonparser
    const input = JSON.parse(event.body);
    const lgtm = await this.lgtmsUsecase.create(input);

    return {
      statusCode: 201,
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(lgtm),
    };
  }
}

export const getAllLgtms: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new LgtmsControllerFactory().create().getAll(event);
};

export const createLgtm: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new LgtmsControllerFactory().create().create(event);
};
