import { IImagesSearcher } from '../gateways';

export interface IImagesController {
  searchLinks(q: string): Promise<string[]>;
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

  public async searchLinks(q: string): Promise<string[]> {
    return await this.imagesSearcher.searchLinks(q);
  }
}
