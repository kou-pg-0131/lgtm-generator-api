import * as gm from 'gm';
import { ILgtmWriter } from '../interfaces/gateways';

export class LgtmWriter implements ILgtmWriter {
  public async write(src: string | Buffer): Promise<Buffer> {
    const image = gm.subClass({ imageMagick: true })(src as Buffer);
    const [distWidth, distHeight] = await new Promise((resolve, reject) => {
      image.size((err, size) => {
        if (err) return reject(err);

        resolve(((): [number, number] => {
          const sideLength = 400;
          if (size.width > size.height) {
            return [sideLength, sideLength / size.width * size.height];
          } else {
            return [sideLength / size.height * size.width, sideLength];
          }
        })());
      });
    });
    const headerFontSize = Math.min(distHeight / 2, distWidth / 6);
    const textFontSize = Math.min(distHeight / 11, distWidth / 34);

    const buffer: Buffer = await new Promise((resolve, reject) => {
      image
        .coalesce()
        .geometry(400, 400)
        .font('src/fonts/Archivo_Black/ArchivoBlack-Regular.ttf')
        .fill('white')
        .fontSize(headerFontSize)
        .drawText(0, 0, 'L G T M', 'Center')
        .fontSize(textFontSize)
        .drawText(0, headerFontSize / 1.5, 'L o o k s   G o o d   T o   M e', 'Center')
        .toBuffer((err, buf) => {
          if (err) return reject(err);
          resolve(buf);
        });
    });

    return buffer;
  }

  // private getColor(data: Uint8ClampedArray): { r: number; g: number; b: number; } {
  //   const color = { r: 0, g: 0, b: 0 };
  //
  //   let count = 0;
  //   for (let i = 0; i < data.length; i += 4) {
  //     if (data[i + 3] === 0) continue;
  //     count++;
  //     color.r += data[i];
  //     color.g += data[i + 1];
  //     color.b += data[i + 2];
  //   }
  //
  //   color.r = Math.floor(color.r / count);
  //   color.g = Math.floor(color.g / count);
  //   color.b = Math.floor(color.b / count);
  //
  //   return color;
  // }

  // private getTextColorHex(data: Uint8ClampedArray): string {
  //   const color = this.getColor(data);
  //
  //   // See: https://www.w3.org/TR/AERT/#color-contrast
  //   const brightness = ((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000;
  //   return brightness < 180 ? 'ffffff' : '000000' ;
  // }
}
