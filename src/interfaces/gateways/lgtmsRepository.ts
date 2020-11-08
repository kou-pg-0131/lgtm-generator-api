import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { Lgtm } from '../../domain';
import { IFileStorage, ILgtmWriter, IHttpClient } from '.';

export interface ILgtmsRepository {
  getAll(params: { evaluatedId?: string }): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }>;
  create(params: { url?: string; base64?: string; }): Promise<Lgtm>;
  delete(params: { id: string; }): Promise<void>;
}

export class LgtmsRepository implements ILgtmsRepository {
  constructor(
    private config: {
      fileStorage: IFileStorage;
      tableName: string;
      lgtmWriter: ILgtmWriter;
      dynamodbDocumentClient: DynamoDB.DocumentClient;
      httpClient: IHttpClient;
    },
  ) {}

  public async getAll(params: { evaluatedId?: string; }): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }> {
    const evaluatedKey: Lgtm | undefined = params.evaluatedId ? await this.get(params.evaluatedId) : undefined;

    const response = await this.config.dynamodbDocumentClient.query({
      ExclusiveStartKey: evaluatedKey,
      KeyConditionExpression: '#s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'ok' },
      TableName: this.config.tableName,
      IndexName: 'index_by_status',
      ScanIndexForward: false,
      Limit: 20,
    }).promise();

    return { lgtms: response.Items as Lgtm[], evaluatedId: response.LastEvaluatedKey?.id };
  }

  public async create(params: { url?: string; base64?: string; }): Promise<Lgtm> {
    const src = params.url ? (await this.config.httpClient.get<Buffer>(params.url, 'arraybuffer')) : Buffer.from(params.base64, 'base64');

    const lgtmBuf = await this.config.lgtmWriter.write(src);
    const lgtm: Lgtm = { id: uuid.v4(), status: 'pending', created_at: new Date().toISOString() };

    await this.config.dynamodbDocumentClient.put({ TableName: this.config.tableName, Item: lgtm }).promise();
    await this.config.fileStorage.save({ path: lgtm.id, data: lgtmBuf, contentType: 'image/png' });
    await this.config.dynamodbDocumentClient.update({
      TableName: this.config.tableName,
      Key: { id: lgtm.id, created_at: lgtm.created_at },
      UpdateExpression: 'set #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'ok' },
    }).promise();

    return { ...lgtm, status: 'ok' };
  }

  public async delete(params: { id: string; }): Promise<void> {
    const lgtm = await this.get(params.id);

    if (lgtm) {
      await this.config.dynamodbDocumentClient.delete({
        TableName: this.config.tableName,
        Key: { id: lgtm.id, created_at: lgtm.created_at },
      }).promise();
    }
    await this.config.fileStorage.delete({ path: params.id });
  }

  private async get(id: string): Promise<Lgtm | undefined> {
    return (await this.config.dynamodbDocumentClient.query({
      TableName: this.config.tableName,
      KeyConditionExpression: '#i = :i',
      ExpressionAttributeNames: { '#i': 'id' },
      ExpressionAttributeValues: { ':i': id },
      Limit: 1,
    }).promise()).Items[0] as Lgtm;
  }
}
