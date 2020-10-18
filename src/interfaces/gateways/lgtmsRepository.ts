import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { Lgtm } from '../../domain';
import { IFileStorage } from '.';

export interface ILgtmsRepository {
  getAll(evaluatedId?: string): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }>;
  create(buf: Buffer): Promise<Lgtm>;
}

export class LgtmsRepository implements ILgtmsRepository {
  private dynamodbClient = new DynamoDB.DocumentClient({
    region:   (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'localhost' : undefined,
    endpoint: (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'http://dynamodb:8000' : undefined,
  });
  private fileStorage: IFileStorage;
  private tableName: string;

  constructor(
    config: {
      fileStorage: IFileStorage;
      tableName: string;
    }
  ) {
    this.fileStorage = config.fileStorage;
    this.tableName = config.tableName;
  }

  public async getAll(evaluatedId?: string): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }> {
    const evaluatedKey: Lgtm | undefined = evaluatedId ? await this.get(evaluatedId) : undefined;

    const response = await this.dynamodbClient.query({
      ExclusiveStartKey: evaluatedKey,
      KeyConditionExpression: '#s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'ok' },
      TableName: this.tableName,
      IndexName: 'index_by_status',
      ScanIndexForward: false,
      Limit: 2,
    }).promise();

    return { lgtms: response.Items as Lgtm[], evaluatedId: response.LastEvaluatedKey?.id };
  }

  public async create(buf: Buffer): Promise<Lgtm> {
    const id = uuid.v4();
    const created_at = new Date().toISOString();

    const lgtm: Lgtm = {
      id,
      status: 'pending',
      created_at,
    };

    await this.dynamodbClient.put({
      TableName: this.tableName,
      Item: lgtm,
    }).promise();

    await this.fileStorage.save({
      path: id,
      data: buf,
      contentType: 'image/png',
    });

    await this.dynamodbClient.update({
      TableName: this.tableName,
      Key: { id, created_at },
      UpdateExpression: 'set #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'ok' },
    }).promise();

    return { ...lgtm, status: 'ok' };
  }

  private async get(id: string): Promise<Lgtm> {
    return (await this.dynamodbClient.query({
      TableName: this.tableName,
      KeyConditionExpression: '#i = :i',
      ExpressionAttributeNames: { '#i': 'id' },
      ExpressionAttributeValues: { ':i': id },
      Limit: 1,
    }).promise()).Items[0] as Lgtm;
  }
}
