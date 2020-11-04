import axios from 'axios';

export interface IHttpClient {
  get<T>(url: string): Promise<T>;
}

export class HttpClient implements IHttpClient {
  public async get<T>(url: string): Promise<T> {
    return (await axios.get(url)).data;
  }
}
