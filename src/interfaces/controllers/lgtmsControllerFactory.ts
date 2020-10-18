import { ILgtmsController, LgtmsController } from '.';
import { IImageLoader } from '../gateways';
import { ImageLoader } from '../../infrastructures';

export class LgtmsControllerFactory {
  public create(): ILgtmsController {
    return new LgtmsController({
      imageLoader: this.createImageLoader(),
    });
  }

  private createImageLoader(): IImageLoader {
    return new ImageLoader();
  }
}
