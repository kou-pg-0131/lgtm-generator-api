import * as gm from 'gm';
import { ILgtmWriter } from '../interfaces/gateways';

export class LgtmWriter implements ILgtmWriter {
  public async write(src: string | Buffer): Promise<Buffer> {
    const image = gm.subClass({ imageMagick: true })(src as Buffer);

    const maxSideLength = 400;
    const size = await this.calcSize(image, maxSideLength);
    const fontSize = this.calcFontSize(size.width, size.height);

    const buffer: Buffer = await new Promise((resolve, reject) => {
      image
        .coalesce()
        .geometry(maxSideLength, maxSideLength)
        .font('src/fonts/Archivo_Black/ArchivoBlack-Regular.ttf')
        .fill('white')
        .fontSize(fontSize.header)
        .drawText(0, 0, 'L G T M', 'Center')
        .fontSize(fontSize.text)
        .drawText(0, fontSize.header / 1.5, 'L o o k s   G o o d   T o   M e', 'Center')
        .toBuffer((err, buf) => {
          if (err) return reject(err);
          resolve(buf);
        });
    });

    return buffer;
  }

  private async calcSize(image: gm.State, maxSideLength: number): Promise<{ width: number; height: number; }> {
    const [distWidth, distHeight] = await new Promise((resolve, reject) => {
      image.size((err, size) => {
        if (err) return reject(err);

        resolve(((): [number, number] => {
          if (size.width > size.height) {
            return [maxSideLength, maxSideLength / size.width * size.height];
          } else {
            return [maxSideLength / size.height * size.width, maxSideLength];
          }
        })());
      });
    });
    return { width: distWidth, height: distHeight };
  }

  private calcFontSize(width: number, height: number): { header: number; text: number; } {
    return {
      header: Math.min(height / 2, width / 6),
      text: Math.min(height / 11, width / 34),
    };
  }
}
