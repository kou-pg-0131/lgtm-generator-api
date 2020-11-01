import { IRenderer, IResponse, IHeaders } from '../interfaces/controllers';

export class Renderer implements IRenderer {
  public ok(params: { body: string; contentType: string; }): IResponse {
    return { statusCode: 200, body: params.body, headers: this.buildHeaders(params.contentType) };
  }

  public created(params: { body: string; contentType: string; }): IResponse {
    return { statusCode: 201, body: params.body, headers: this.buildHeaders(params.contentType) };
  }

  public badRequest(): IResponse {
    return { statusCode: 400, body: this.buildMessageBody('Bad Request'), headers: this.buildHeaders() };
  }

  private buildMessageBody(message: string): string {
    return JSON.stringify({ message });
  }

  private buildHeaders(contentType?: string): IHeaders {
    const accessControlAllowOrigin =
      process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true' ?
        '*' :
        process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*' ;

    return {
      'Content-Type': contentType || 'application/json',
      'Access-Control-Allow-Origin': accessControlAllowOrigin,
    };
  }
}
