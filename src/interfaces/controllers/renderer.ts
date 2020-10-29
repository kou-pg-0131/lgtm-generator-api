import { IResponse } from '.';

export interface IRenderer {
  ok(params: { body: string; contentType: string; }): IResponse;
  created(params: { body: string; contentType: string; }): IResponse;
  badRequest(): IResponse;
}
