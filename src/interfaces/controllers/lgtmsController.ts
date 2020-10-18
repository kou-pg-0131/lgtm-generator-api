import { Lgtm } from '../../domain';
import { IImageLoader, ILgtmsRepository, ILgtmWriter } from '../gateways';

export interface ILgtmsController {
  getAll(): Promise<Lgtm[]>;
  create(params: { base64: string; }): Promise<Lgtm>;
}

export class LgtmsController implements ILgtmsController {
  private imageLoader: IImageLoader;
  private lgtmsRepository: ILgtmsRepository;
  private lgtmWriter: ILgtmWriter;

  constructor(
    config: {
      imageLoader: IImageLoader;
      lgtmsRepository: ILgtmsRepository;
      lgtmWriter: ILgtmWriter;
    },
  ) {
    this.imageLoader = config.imageLoader;
    this.lgtmsRepository = config.lgtmsRepository;
    this.lgtmWriter = config.lgtmWriter;
  }

  public async getAll(): Promise<Lgtm[]> {
    return await this.lgtmsRepository.getAll();
  }

  public async create(params: { base64: string; }): Promise<Lgtm> {
    const buf = Buffer.from(params.base64, 'base64');
    const image = await this.imageLoader.load(buf);
    const lgtmImageBuf = await this.lgtmWriter.write(image);

    const lgtm = await this.lgtmsRepository.create(lgtmImageBuf);

    return lgtm;
  }
}
