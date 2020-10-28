import { Image } from '../domain';
import { IImagesSearcher } from '../interfaces/gateways';
import { IHttpClient, IUrlBuilder } from '.';

export class ImagesSearcher implements IImagesSearcher {
  private apiKey: string;
  private httpClient: IHttpClient;
  private urlBuilder: IUrlBuilder;

  constructor(
    config: {
      apiKey: string;
      urlBuilder: IUrlBuilder,
      httpClient: IHttpClient,
    },
  ) {
    this.apiKey = config.apiKey;
    this.httpClient = config.httpClient;
    this.urlBuilder = config.urlBuilder;
  }

  public async search(q: string): Promise<Image[]> {
    const endpoint = this.urlBuilder.build(
      'https://customsearch.googleapis.com/customsearch/v1',
      {
        key: this.apiKey,
        q,
        cx: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
        num: 10,
        searchType: 'image',
        safe: 'active',
        fileType: 'jpeg',
      },
    );
    const response = await this.httpClient.get(endpoint);

    return response.data.items.map(item => ({
      title: item.title,
      url: item.link,
    }));
  }
}
