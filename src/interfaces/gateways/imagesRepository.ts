import { Image } from '../../domain';
import { IImagesRepository } from '../../usecases';
import { IImagesSearcher } from '.';

export class ImagesRepository implements IImagesRepository {
  private imagesSearcher: IImagesSearcher;

  constructor(config: { imagesSearcher: IImagesSearcher; }) {
    this.imagesSearcher = config.imagesSearcher;
  }

  public async search(params: { q: string; }): Promise<Image[]> {
    return this.imagesSearcher.search(params);
  }
}
