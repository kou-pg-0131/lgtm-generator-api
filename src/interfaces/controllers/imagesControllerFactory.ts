import { IImagesController, ImagesController } from '.';
import { IImagesUsecase, ImagesUsecase, IImagesRepository } from '../../usecases';
import { ImagesRepository } from '../gateways';
import { ImagesSearcher, HttpClient, Renderer, UrlBuilder } from '../../infrastructures';

export class ImagesControllerFactory {
  public create(): IImagesController {
    return new ImagesController({
      imagesUsecase: this.createImagesUsecase(),
      renderer: new Renderer(),
    });
  }

  private createImagesUsecase(): IImagesUsecase {
    return new ImagesUsecase({
      imagesRepository: this.createImagesRepository(),
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
