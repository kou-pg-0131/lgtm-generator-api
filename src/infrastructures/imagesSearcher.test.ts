import { ImagesSearcher, IUrlBuilder, IHttpClient } from '.';

describe('ImagesSearcher', () => {
  describe('search()', () => {
    it('should call httpClient.get() with correct args', async () => {
      const urlBuilder: IUrlBuilder = { build: jest.fn().mockReturnValue('https://example.com'), join: jest.fn() };
      const httpClient: IHttpClient = { get: jest.fn().mockResolvedValue({ data:{ items:[{ title: 'TITLE', link: 'LINK' }] } }) };
      const imagesSearcher = new ImagesSearcher({
        apiKey: 'API_KEY',
        searchEngineId: 'SEARCH_ENGINE_ID',
        urlBuilder,
        httpClient,
      });

      const images = await imagesSearcher.search({ q: 'QUERY' });
      expect(images).toEqual([{ title: 'TITLE', url: 'LINK' }]);
      expect(urlBuilder.build).toHaveBeenCalledWith('https://customsearch.googleapis.com/customsearch/v1', {
        key: 'API_KEY', q: 'QUERY', cx: 'SEARCH_ENGINE_ID', num: 10, searchType: 'image', safe: 'active', fileType: 'jpeg',
      });
      expect(httpClient.get).toHaveBeenCalledWith('https://example.com');
    });
  });
});