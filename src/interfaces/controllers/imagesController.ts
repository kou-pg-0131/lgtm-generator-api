import { Image } from '../../domain';
import { IImagesSearcher } from '../gateways';

export interface IImagesController {
  search(q: string): Promise<Image[]>;
}

export class ImagesController implements IImagesController {
  private imagesSearcher: IImagesSearcher;

  constructor(
    config: {
      imagesSearcher: IImagesSearcher;
    },
  ) {
    this.imagesSearcher = config.imagesSearcher;
  }

  public async search(q: string): Promise<Image[]> {
    return await this.imagesSearcher.search(q);
  }
}
