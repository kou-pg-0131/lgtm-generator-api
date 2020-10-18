import { Image } from 'canvas';

export interface ILgtmWriter {
  write(image: Image): Promise<Buffer>;
}
