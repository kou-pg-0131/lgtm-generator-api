import { Image } from '../../domain';
import { IImagesSearcher } from '.';

export interface IImagesRepository {
  search(params: { q: string; }): Promise<Image[]>;
}

export class ImagesRepository implements IImagesRepository {
  constructor(private config: { imagesSearcher: IImagesSearcher; }) {}

  public async search(params: { q: string; }): Promise<Image[]> {
    return this.config.imagesSearcher.search(params);
  }
}
