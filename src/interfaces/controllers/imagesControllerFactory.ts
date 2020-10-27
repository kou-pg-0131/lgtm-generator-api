import { IImagesController, ImagesController } from '.';
import { IImagesSearcher } from '../gateways';
import { ImagesSearcher, HttpClient, UrlBuilder } from '../../infrastructures';

export class ImagesControllerFactory {
  public create(): IImagesController {
    return new ImagesController({
      imagesSearcher: this.createImagesSearcher(),
    });
  }

  private createImagesSearcher(): IImagesSearcher {
    return new ImagesSearcher({
      apiKey: process.env.GOOGLE_API_KEY,
      httpClient: new HttpClient(),
      urlBuilder: new UrlBuilder(),
    });
  }
}
