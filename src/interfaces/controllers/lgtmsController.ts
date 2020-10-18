export interface ILgtmsController {
  create(params: { base64: string; }): Promise<string>;
}

export class LgtmsController implements ILgtmsController {
  public async create(params: { base64: string; }): Promise<string> {
    return params.base64;
  }
}
