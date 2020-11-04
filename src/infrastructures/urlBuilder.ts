import urlJoin from 'url-join';
import * as qs from 'query-string';

export type QueryStringParameters = {
  [key:string]: string | number | boolean | undefined;
};

export interface IUrlBuilder {
  build(url: string, params?: QueryStringParameters): string;
  join(...path: string[]): string;
}

export class UrlBuilder implements IUrlBuilder {
  public build(url: string, params?: QueryStringParameters): string {
    return `${url}${params ? `?${qs.stringify(params)}` : ''}`;
  }

  public join(...paths: string[]): string {
    return urlJoin(...paths);
  }
}
