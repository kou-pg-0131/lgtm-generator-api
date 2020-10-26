import { Image } from '../../domain/image';

export interface IImagesSearcher {
  search(q: string): Promise<Image[]>;
}
