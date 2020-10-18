import { ILgtmsController, LgtmsController } from '.';
import { IImageLoader, ILgtmWriter } from '../gateways';
import { ImageLoader, LgtmWriter } from '../../infrastructures';

export class LgtmsControllerFactory {
  public create(): ILgtmsController {
    return new LgtmsController({
      imageLoader: this.createImageLoader(),
      lgtmWriter: this.createLgtmWriter(),
    });
  }

  private createImageLoader(): IImageLoader {
    return new ImageLoader();
  }

  private createLgtmWriter(): ILgtmWriter {
    return new LgtmWriter();
  }
}
