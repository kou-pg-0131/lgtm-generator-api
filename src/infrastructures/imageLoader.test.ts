import { loadImage } from 'canvas';
import { ImageLoader } from '.';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('ImageLoader', () => {
  const imageLoader = new ImageLoader();
  describe('load()', () => {
    it('call loadImage() with correct arg.', async () => {
      (loadImage as any) = jest.fn().mockResolvedValueOnce('IMAGE');
      const image = await imageLoader.load(Buffer.from('DATA'));
      expect(loadImage).toHaveBeenCalledWith(Buffer.from('DATA'));
      expect(image).toEqual('IMAGE');
    });
  });
});
