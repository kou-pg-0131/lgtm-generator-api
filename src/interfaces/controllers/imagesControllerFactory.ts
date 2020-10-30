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
        searchEngineId: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
        httpClient: new HttpClient(),
        urlBuilder: new UrlBuilder(),
      }),
    });
  }
}
