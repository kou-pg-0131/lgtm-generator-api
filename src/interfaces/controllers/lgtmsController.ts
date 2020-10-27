import { Lgtm } from '../../domain';
import { IImageLoader, ILgtmsRepository, ILgtmWriter } from '../gateways';

export interface ILgtmsController {
  getAll(params: { evaluatedId?: string; }): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }>;
  create(params: { base64?: string; url?: string; }): Promise<Lgtm>;
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

  public async getAll(params: { evaluatedId?: string; }): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }> {
    return await this.lgtmsRepository.getAll(params.evaluatedId);
  }

  public async create(params: { base64?: string; url?: string; }): Promise<Lgtm> {
    const bufOrUrl = (() => {
      if (params.base64) {
        return Buffer.from(params.base64, 'base64');
      } else if (params.url) {
        return params.url;
      } else {
        throw new Error('Bad Request');
      }
    })();
    const image = await this.imageLoader.load(bufOrUrl);
    const lgtmImageBuf = await this.lgtmWriter.write(image);

    const lgtm = await this.lgtmsRepository.create(lgtmImageBuf);

    return lgtm;
  }
}
