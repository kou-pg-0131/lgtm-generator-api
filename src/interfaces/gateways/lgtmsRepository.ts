import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { Lgtm } from '../../domain';

export interface ILgtmsRepository {
  create(buf: Buffer): Promise<Lgtm>;
}

export class LgtmsRepository implements ILgtmsRepository {
  private dynamodbClient = new DynamoDB.DocumentClient({
    region:   (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'localhost' : undefined,
    endpoint: (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'http://dynamodb:8000' : undefined,
  });

  public async create(_buf: Buffer): Promise<Lgtm> {
    const id = uuid.v4();
    const created_at = new Date();

    const lgtm = {
      id,
      created_at,
    };

    const response = await this.dynamodbClient.put({
      TableName: 'lgtms',
      Item: { ...lgtm, created_at: lgtm.created_at.toISOString() },
    }).promise();

    console.log(response);

    return lgtm;
  }
}
