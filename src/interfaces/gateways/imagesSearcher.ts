import { Image } from '../../domain/image';

export interface IImagesSearcher {
  search(params: { q: string; }): Promise<Image[]>;
}
