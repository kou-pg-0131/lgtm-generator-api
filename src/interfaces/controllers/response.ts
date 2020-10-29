export interface IResponse {
  statusCode: number;
  body: string;
  headers: IHeaders;
}

export interface IHeaders {
  'Content-Type': string;
  'Access-Control-Allow-Origin': string;
}
