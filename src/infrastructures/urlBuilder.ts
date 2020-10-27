import urlJoin from 'url-join';
import * as qs from 'query-string';

export interface IUrlBuilder {
  build(url: string, params?: any): string;
  join(...path: string[]): string;
}

export class UrlBuilder implements IUrlBuilder {
  public build(url: string, params?: any): string {
    return `${url}${params ? `?${qs.stringify(params)}` : ''}`;
  }

  public join(...paths: string[]): string {
    return urlJoin(...paths);
  }
}
