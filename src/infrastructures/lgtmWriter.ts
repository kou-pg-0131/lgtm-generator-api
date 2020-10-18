import { createCanvas, Image } from 'canvas';
import { ILgtmWriter } from '../interfaces/gateways';

export class LgtmWriter implements ILgtmWriter {
  public async write(image: Image): Promise<Buffer> {
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    return canvas.toBuffer();
  }
}
