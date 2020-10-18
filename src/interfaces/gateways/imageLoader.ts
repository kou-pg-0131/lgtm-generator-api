import { Image } from 'canvas';

export interface IImageLoader {
  load(buf: Buffer): Promise<Image>;
}
