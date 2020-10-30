import { IImagesController, ImagesController } from '.';
import { ImagesRepository, IImagesRepository } from '../gateways';
import { ImagesSearcher, HttpClient, Renderer, UrlBuilder } from '../../infrastructures';

export class ImagesControllerFactory {
  public create(): IImagesController {
    return new ImagesController({
      imagesRepository: this.createImagesRepository(),
      renderer: new Renderer(),
    });
  }

  private createImagesRepository(): IImagesRepository {
    return new ImagesRepository({
      imagesSearcher:  new ImagesSearcher({
        apiKey: process.env.GOOGLE_API_KEY,
        httpClient: new HttpClient(),
        urlBuilder: new UrlBuilder(),
      }),
    });
  }
}
