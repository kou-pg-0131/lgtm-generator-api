import { IResponse } from '.';

export interface IRenderer {
  ok(body: string): IResponse;
  created(body: string): IResponse;
  badRequest(): IResponse;
}
