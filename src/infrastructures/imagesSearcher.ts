import * as google from 'googleapis';
import { Image } from '../domain';
import { IImagesSearcher } from '../interfaces/gateways';

export class ImagesSearcher implements IImagesSearcher {
  private customSearchClient: google.customsearch_v1.Customsearch;

  constructor(
    config: {
      apiKey: string;
    },
  ) {
    this.customSearchClient = new google.customsearch_v1.Customsearch({ auth: config.apiKey });
  }

  public async search(q: string): Promise<Image[]> {
    const response = await this.customSearchClient.cse.list({
      q,
      cx: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
      num: 10,
      searchType: 'image',
      safe: 'active',
    });

    return response.data.items.map(item => ({
      title: item.title,
      url: item.link,
    }));
  }
}
