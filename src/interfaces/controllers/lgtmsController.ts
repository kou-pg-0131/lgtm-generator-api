import { IImageLoader } from '../gateways';

export interface ILgtmsController {
  create(params: { base64: string; }): Promise<string>;
}

export class LgtmsController implements ILgtmsController {
  private imageLoader: IImageLoader;

  constructor(
    config: {
      imageLoader: IImageLoader;
    },
  ) {
    this.imageLoader = config.imageLoader;
  }

  public async create(params: { base64: string; }): Promise<string> {
    const buf = Buffer.from(params.base64, 'base64');
    const image = await this.imageLoader.load(buf);
    console.log(image.height);
    console.log(image.width);

    return params.base64;
  }
}
