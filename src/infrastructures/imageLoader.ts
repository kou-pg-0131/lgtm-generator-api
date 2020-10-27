import { Image, loadImage } from 'canvas';
import { IImageLoader } from '../interfaces/gateways';

export class ImageLoader implements IImageLoader {
  public async load(bufOrUrl: Buffer | string): Promise<Image> {
    return await loadImage(bufOrUrl);
  }
}
