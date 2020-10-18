import * as google from 'googleapis';
import { IImagesSearcher } from '../interfaces/gateways';

export class ImagesSearcher implements IImagesSearcher {
  private customSearchClient: google.customsearch_v1.Customsearch;

  constructor(
    config: {
      apiKey: string;
    }
  ) {
  this.customSearchClient = new google.customsearch_v1.Customsearch({ auth: config.apiKey });
  }

  public async searchLinks(q: string): Promise<string[]> {
    const response = await this.customSearchClient.cse.list({
      q,
      cx: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
      num: 10,
      searchType: 'image',
      safe: 'active',
    });

    return response.data.items.map(item => item.link);
  }
}
