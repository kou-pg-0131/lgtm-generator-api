import axios, { AxiosRequestConfig } from 'axios';

export interface IHttpClient {
  get(url: string): Promise<HttpResponse>;
}

export type HttpResponse = {
  status: number;
  data: any;
};

export class HttpClient implements IHttpClient {
  public async get(url: string): Promise<HttpResponse> {
    const response = await axios.get(url, this.buildAxiosRequestConfig());
    return {
      data: response.data,
      status: response.status,
    };
  }

  private buildAxiosRequestConfig(): AxiosRequestConfig {
    return { validateStatus: () => true };
  }
}
