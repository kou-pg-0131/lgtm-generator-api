export interface IResponse {
  statusCode: number;
  body: string;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
  };
}
