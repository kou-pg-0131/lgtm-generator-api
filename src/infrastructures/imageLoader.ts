import { Image, loadImage } from 'canvas';
import { IImageLoader } from '../interfaces/gateways';

export class ImageLoader implements IImageLoader {
  public async load(buf: Buffer): Promise<Image> {
    return await loadImage(buf);
  }
}
