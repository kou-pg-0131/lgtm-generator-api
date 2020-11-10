import { IRenderer, IResponse } from '../interfaces/controllers';

export class Renderer implements IRenderer {
  public ok(params: { body: string; }): IResponse {
    return this.buildResponse(200, params.body);
  }

  public created(params: { body: string; }): IResponse {
    return this.buildResponse(201, params.body);
  }

  public badRequest(): IResponse {
    return this.buildResponse(400, this.buildMessageBody('Bad Request'));
  }

  private buildResponse(statusCode: number, body: string): IResponse {
    const accessControlAllowOrigin = process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*' ;

    return {
      statusCode,
      body,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': accessControlAllowOrigin,
      },
    };
  }

  private buildMessageBody(message: string): string {
    return JSON.stringify({ message });
  }
}
