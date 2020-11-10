import { IRenderer, IResponse } from '../interfaces/controllers';

export class Renderer implements IRenderer {
  public ok(body: string): IResponse {
    return this.buildResponse(200, body);
  }

  public created(body: string): IResponse {
    return this.buildResponse(201, body);
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
