export interface IImagesSearcher {
  searchLinks(q: string): Promise<string[]>;
}
