import { ILgtmsController, LgtmsController } from '.';
import { IImageLoader, ILgtmsRepository, ILgtmWriter, LgtmsRepository } from '../gateways';
import { ImageLoader, LgtmWriter } from '../../infrastructures';

export class LgtmsControllerFactory {
  public create(): ILgtmsController {
    return new LgtmsController({
      imageLoader: this.createImageLoader(),
      lgtmsRepository: this.createLgtmsRepository(),
      lgtmWriter: this.createLgtmWriter(),
    });
  }

  private createImageLoader(): IImageLoader {
    return new ImageLoader();
  }

  private createLgtmsRepository(): ILgtmsRepository {
    return new LgtmsRepository();
  }

  private createLgtmWriter(): ILgtmWriter {
    return new LgtmWriter();
  }
}
