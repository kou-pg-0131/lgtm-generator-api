import { Image } from '../domain';
import { IHttpClient, IImagesSearcher } from '../interfaces/gateways';
import { IUrlBuilder } from '.';

interface ISearchResult {
  items?: {
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
      },
    );

    const response = await this.config.httpClient.get<ISearchResult>(endpoint);
    return response.items?.filter(item => item.link.startsWith('https://')).map(item => ({ title: item.title, url: item.link })) || [];
  }
}
