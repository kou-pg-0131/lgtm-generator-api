import { createCanvas, Image, registerFont } from 'canvas';
import { ILgtmWriter } from '../interfaces/gateways';

export class LgtmWriter implements ILgtmWriter {
  public async write(image: Image): Promise<Buffer> {
    const fontFamily = 'ArchivoBlack';
    registerFont('src/fonts/Archivo_Black/ArchivoBlack-Regular.ttf', { family: fontFamily });

    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const headerFontSize = canvas.width / 7;
    const textFontSize = canvas.width / 34;

    context.font = `${headerFontSize}px ${fontFamily}`;
    context.fillText('L G T M', x, y, canvas.width);

    context.font = `${textFontSize}px ${fontFamily}`;
    context.fillText('L o o k s   G o o d   T o   M e', x, y + headerFontSize / 1.5);

    return canvas.toBuffer('image/png');
  }
}
