import { DynamoDB } from 'aws-sdk';

export class DynamoDBDocumentClientFactory {
  public create(): DynamoDB.DocumentClient {
    const isDebug = process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true';
    return new DynamoDB.DocumentClient({
      region:   isDebug ? 'localhost'            : undefined,
      endpoint: isDebug ? 'http://dynamodb:8000' : undefined,
    });
  }
}
