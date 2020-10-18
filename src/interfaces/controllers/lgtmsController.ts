import { IImageLoader, ILgtmWriter } from '../gateways';

export interface ILgtmsController {
  create(params: { base64: string; }): Promise<string>;
}

export class LgtmsController implements ILgtmsController {
  private imageLoader: IImageLoader;
  private lgtmWriter: ILgtmWriter;

  constructor(
    config: {
      imageLoader: IImageLoader;
      lgtmWriter: ILgtmWriter;
    },
  ) {
    this.imageLoader = config.imageLoader;
    this.lgtmWriter = config.lgtmWriter;
  }

  public async create(params: { base64: string; }): Promise<string> {
    const buf = Buffer.from(params.base64, 'base64');
    const image = await this.imageLoader.load(buf);
    const lgtmImageBuf = await this.lgtmWriter.write(image);

    return `data:image/png;base64,${lgtmImageBuf.toString('base64')}`;
  }
}
