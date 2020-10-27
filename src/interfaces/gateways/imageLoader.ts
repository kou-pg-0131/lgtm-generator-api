import { Image } from 'canvas';

export interface IImageLoader {
  load(bufOrUrl: Buffer | string): Promise<Image>;
}
