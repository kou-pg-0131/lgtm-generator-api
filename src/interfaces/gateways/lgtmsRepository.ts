import * as uuid from 'uuid';
import { Lgtm } from '../../domain';
import { DynamoDBDocumentClientFactory, IFileStorage, IImageLoader, ILgtmWriter } from '.';

export interface ILgtmsRepository {
  getAll(params: { evaluatedId?: string }): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }>;
  create(params: { imageSrc: string | Buffer; }): Promise<Lgtm>;
}

export class LgtmsRepository implements ILgtmsRepository {
  private dynamodbDocumentClient = new DynamoDBDocumentClientFactory().create();
  private fileStorage: IFileStorage;
  private tableName: string;
  private imageLoader: IImageLoader;
  private lgtmWriter: ILgtmWriter;

  constructor(
    config: {
      fileStorage: IFileStorage;
      tableName: string;
      imageLoader: IImageLoader;
      lgtmWriter: ILgtmWriter;
    },
  ) {
    this.fileStorage = config.fileStorage;
    this.tableName = config.tableName;
    this.imageLoader = config.imageLoader;
    this.lgtmWriter = config.lgtmWriter;
  }

  public async getAll(params: { evaluatedId?: string; }): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }> {
    const evaluatedKey: Lgtm | undefined = params.evaluatedId ? await this.get(params.evaluatedId) : undefined;

    const response = await this.dynamodbDocumentClient.query({
      ExclusiveStartKey: evaluatedKey,
      KeyConditionExpression: '#s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'ok' },
      TableName: this.tableName,
      IndexName: 'index_by_status',
      ScanIndexForward: false,
      Limit: 20,
    }).promise();

    return { lgtms: response.Items as Lgtm[], evaluatedId: response.LastEvaluatedKey?.id };
  }

  public async create(params: { imageSrc: string | Buffer; }): Promise<Lgtm> {
    const image = await this.imageLoader.load(params.imageSrc);
    const lgtmBuf = await this.lgtmWriter.write(image);
    const lgtm: Lgtm = { id: uuid.v4(), status: 'pending', created_at: new Date().toISOString() };

    await this.dynamodbDocumentClient.put({ TableName: this.tableName, Item: lgtm }).promise();
    await this.fileStorage.save({ path: lgtm.id, data: lgtmBuf, contentType: 'image/png' });
    await this.dynamodbDocumentClient.update({
      TableName: this.tableName,
      Key: { id: lgtm.id, created_at: lgtm.created_at },
      UpdateExpression: 'set #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'ok' },
    }).promise();

    return { ...lgtm, status: 'ok' };
  }

  private async get(id: string): Promise<Lgtm> {
    return (await this.dynamodbDocumentClient.query({
      TableName: this.tableName,
      KeyConditionExpression: '#i = :i',
      ExpressionAttributeNames: { '#i': 'id' },
      ExpressionAttributeValues: { ':i': id },
      Limit: 1,
    }).promise()).Items[0] as Lgtm;
  }
}
