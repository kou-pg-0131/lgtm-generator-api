import { Image } from '../domain';
import { IImagesRepository } from '.';

export interface IImagesUsecase {
  search(params: { q: string; }): Promise<Image[]>;
}

export class ImagesUsecase implements IImagesUsecase {
  private imagesRepository: IImagesRepository;

  constructor(config: { imagesRepository: IImagesRepository; }) {
    this.imagesRepository = config.imagesRepository;
  }

  public async search(params: { q: string; }): Promise<Image[]> {
    return await this.imagesRepository.search(params);
  }
}
