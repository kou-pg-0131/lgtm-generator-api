import { Image } from '../domain';

export interface IImagesRepository {
  search(params: { q: string; }): Promise<Image[]>;
}
