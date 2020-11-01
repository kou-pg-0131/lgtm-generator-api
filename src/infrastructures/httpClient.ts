import axios from 'axios';

export interface IHttpClient {
  get<T>(url: string): Promise<HttpResponse<T>>;
}

export type HttpResponse<T> = {
  status: number;
  data: T;
};

export class HttpClient implements IHttpClient {
  public async get<T>(url: string): Promise<HttpResponse<T>> {
    const response = await axios.get(url);
    return { data: response.data, status: response.status };
  }
}
