import axios from 'axios';
import { IHttpClient, ResponseType } from '../interfaces/gateways';

export class HttpClient implements IHttpClient {
  public async get<T>(url: string, responseType: ResponseType = 'json'): Promise<T> {
    return (await axios.get(url, { responseType })).data;
  }
}
