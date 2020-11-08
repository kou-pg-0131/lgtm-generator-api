import axios from 'axios';

type ResponseType = 'json' | 'arraybuffer';

export interface IHttpClient {
  get<T>(url: string, responseType?: ResponseType): Promise<T>;
}

export class HttpClient implements IHttpClient {
  public async get<T>(url: string, responseType: ResponseType = 'json'): Promise<T> {
    return (await axios.get(url, { responseType })).data;
  }
}
