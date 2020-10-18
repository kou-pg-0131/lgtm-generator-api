import { IImagesController, ImagesController } from '.';
import { IImagesSearcher } from '../gateways';
import { ImagesSearcher } from '../../infrastructures';

export class ImagesControllerFactory {
  public create(): IImagesController {
    return new ImagesController({
      imagesSearcher: this.createImagesSearcher(),
    });
  }

  private createImagesSearcher(): IImagesSearcher {
    return new ImagesSearcher({ apiKey: process.env.GOOGLE_API_KEY });
  }
}
