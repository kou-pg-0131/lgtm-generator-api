import { createCanvas, Image, registerFont } from 'canvas';
import { ILgtmWriter } from '../interfaces/gateways';

export class LgtmWriter implements ILgtmWriter {
  public async write(image: Image): Promise<Buffer> {
    // register font
    const fontFamily = 'ArchivoBlack';
    registerFont('src/fonts/Archivo_Black/ArchivoBlack-Regular.ttf', { family: fontFamily });

    // resize
    const sideLength = 500;
    const [distWidth, distHeight] = ((): [number, number] => {
      if (image.width > image.height) {
        return [sideLength, sideLength / image.width * image.height];
      } else {
        return [sideLength / image.height * image.width, sideLength];
      }
    })();
    const canvas = createCanvas(distWidth, distHeight);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, distWidth, distHeight);

    // write text
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const textColorHex = this.getTextColorHex(context.getImageData(0, 0, canvas.width, canvas.height).data);
    context.fillStyle = `#${textColorHex}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const { headerFontSize, textFontSize } = this.calcFontSize(canvas.width, canvas.height);
    context.font = `${headerFontSize}px ${fontFamily}`;
    context.fillText('L G T M', x, y, canvas.width);
    context.font = `${textFontSize}px ${fontFamily}`;
    context.fillText('L o o k s   G o o d   T o   M e', x, y + headerFontSize / 1.5, canvas.width);

    return canvas.toBuffer('image/png');
  }

  private calcFontSize(width: number, height: number): { headerFontSize: number; textFontSize: number; } {
    return {
      headerFontSize: Math.min(height / 2, width / 6),
      textFontSize: Math.min(height / 11, width / 34),
    };
  }

  private getColor(data: Uint8ClampedArray): { r: number; g: number; b: number; } {
    const color = { r: 0, g: 0, b: 0 };

    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      count++;
      color.r += data[i];
      color.g += data[i + 1];
      color.b += data[i + 2];
    }

    color.r = Math.floor(color.r / count);
    color.g = Math.floor(color.g / count);
    color.b = Math.floor(color.b / count);

    return color;
  }

  private getTextColorHex(data: Uint8ClampedArray): string {
    const color = this.getColor(data);

    // See: https://www.w3.org/TR/AERT/#color-contrast
    const brightness = ((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000;
    return brightness < 180 ? 'ffffff' : '000000' ;
  }
}
