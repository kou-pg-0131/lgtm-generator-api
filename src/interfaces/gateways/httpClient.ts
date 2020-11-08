export type ResponseType = 'json' | 'arraybuffer';

export interface IHttpClient {
  get<T>(url: string, responseType?: ResponseType): Promise<T>;
}

