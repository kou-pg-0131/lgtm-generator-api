import { Image } from '../domain';
import { IImagesSearcher } from '../interfaces/gateways';
import { IHttpClient, IUrlBuilder } from '.';

interface ISearchResult {
  items: {
    title: string;
    link: string;
  }[];
}

export class ImagesSearcher implements IImagesSearcher {
  constructor(
    private config: {
      apiKey: string;
      searchEngineId: string;
      urlBuilder: IUrlBuilder;
      httpClient: IHttpClient;
    },
  ) {}

  public async search(params: { q: string; }): Promise<Image[]> {
    const endpoint = this.config.urlBuilder.build(
      'https://customsearch.googleapis.com/customsearch/v1',
      {
        key: this.config.apiKey,
        q: params.q,
        cx: this.config.searchEngineId,
        num: 10,
        searchType: 'image',
        safe: 'active',
        fileType: 'jpeg',
      },
    );

    const response = await this.config.httpClient.get<ISearchResult>(endpoint);
    return response.data.items.map(item => ({ title: item.title, url: item.link }));
  }
}
