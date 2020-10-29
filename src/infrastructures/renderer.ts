import { IRenderer, IResponse } from '../interfaces/controllers';

export class Renderer implements IRenderer {
  public ok(params: { body: string; contentType: string; }): IResponse {
    return {
      statusCode: 200,
      body: params.body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': params.contentType,
      },
    };
  }

  public created(params: { body: string; contentType: string; }): IResponse {
    return {
      statusCode: 201,
      body: params.body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': params.contentType,
      },
    };
  }

  public badRequest(): IResponse {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  }
}
