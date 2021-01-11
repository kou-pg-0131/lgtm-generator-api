import { Image } from '../domain';
import { IHttpClient, IImagesSearcher } from '../interfaces/gateways';
import { IUrlBuilder, UrlBuilder, HttpClient } from '.';

interface ISearchResult {
  items?: {
    title: string;
    link: string;
  }[];
}

export class ImagesSearcher implements IImagesSearcher {
  constructor(
    private apiKey: string,
    private searchEngineId: string,
    private urlBuilder: IUrlBuilder = new UrlBuilder(),
    private httpClient: IHttpClient = new HttpClient(),
  ) {}

  public async search(params: { q: string; }): Promise<Image[]> {
    const endpoint = this.urlBuilder.build(
      'https://customsearch.googleapis.com/customsearch/v1',
      {
        key: this.apiKey,
        q: params.q,
        cx: this.searchEngineId,
        num: 10,
        searchType: 'image',
        safe: 'active',
      },
    );

    const response = await this.httpClient.get<ISearchResult>(endpoint);
    return response.items?.filter(item => item.link.startsWith('https://')).map(item => ({ title: item.title, url: item.link })) || [];
  }
}
