import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { Lgtm } from '../../domain';

export interface ILgtmsRepository {
  getAll(): Promise<Lgtm[]>;
  create(buf: Buffer): Promise<Lgtm>;
}

export class LgtmsRepository implements ILgtmsRepository {
  private dynamodbClient = new DynamoDB.DocumentClient({
    region:   (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'localhost' : undefined,
    endpoint: (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'http://dynamodb:8000' : undefined,
  });

  public async getAll(): Promise<Lgtm[]> {
    const response = await this.dynamodbClient.query({
      KeyConditionExpression: '#s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'ok' },
      TableName: 'lgtms',
      IndexName: 'index_by_status',
      ScanIndexForward: false,
      Limit: 20,
    }).promise();

    return response.Items as Lgtm[];
  }

  public async create(_buf: Buffer): Promise<Lgtm> {
    const id = uuid.v4();
    const created_at = new Date().toISOString();

    const lgtm: Lgtm = {
      id,
      status: 'pending',
      created_at,
    };

    await this.dynamodbClient.put({
      TableName: 'lgtms',
      Item: lgtm,
    }).promise();

    await this.dynamodbClient.update({
      TableName: 'lgtms',
      Key: { id, created_at },
      UpdateExpression: 'set #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'ok' },
    }).promise();

    return { ...lgtm, status: 'ok' };
  }
}
