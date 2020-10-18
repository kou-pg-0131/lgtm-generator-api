import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { Lgtm } from '../../domain';

export interface ILgtmsRepository {
  getAll(evaluatedId?: string): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }>;
  create(buf: Buffer): Promise<Lgtm>;
}

export class LgtmsRepository implements ILgtmsRepository {
  private dynamodbClient = new DynamoDB.DocumentClient({
    region:   (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'localhost' : undefined,
    endpoint: (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'http://dynamodb:8000' : undefined,
  });

  public async getAll(evaluatedId?: string): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }> {
    const evaluatedKey: Lgtm | undefined = evaluatedId ? await this.get(evaluatedId) : undefined;

    const response = await this.dynamodbClient.query({
      ExclusiveStartKey: evaluatedKey,
      KeyConditionExpression: '#s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'ok' },
      TableName: 'lgtms',
      IndexName: 'index_by_status',
      ScanIndexForward: false,
      Limit: 2,
    }).promise();

    return { lgtms: response.Items as Lgtm[], evaluatedId: response.LastEvaluatedKey?.id };
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

  private async get(id: string): Promise<Lgtm> {
    return (await this.dynamodbClient.query({
      TableName: 'lgtms',
      KeyConditionExpression: '#i = :i',
      ExpressionAttributeNames: { '#i': 'id' },
      ExpressionAttributeValues: { ':i': id },
      Limit: 1,
    }).promise()).Items[0] as Lgtm;
  }
}
