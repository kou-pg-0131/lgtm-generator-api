import * as uuid from 'uuid';
import { Lgtm } from '../../domain';
import { ILgtmsRepository } from '../../usecases';
import { DynamoDBDocumentClientFactory, IFileStorage, IImageLoader, ILgtmWriter } from '.';

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

  public async getAll(evaluatedId?: string): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }> {
    const evaluatedKey: Lgtm | undefined = evaluatedId ? await this.get(evaluatedId) : undefined;

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

  public async create(params: { base64?: string; url?: string; }): Promise<Lgtm> {
    const bufOrUrl = (() => {
      if (params.base64) {
        return Buffer.from(params.base64, 'base64');
      } else if (params.url) {
        return params.url;
      } else {
        throw new Error('Bad Request'); // FIXME: custom error
      }
    })();
    const image = await this.imageLoader.load(bufOrUrl);
    const buf = await this.lgtmWriter.write(image);
    const id = uuid.v4();
    const created_at = new Date().toISOString();

    const lgtm: Lgtm = {
      id,
      status: 'pending',
      created_at,
    };

    await this.dynamodbDocumentClient.put({
      TableName: this.tableName,
      Item: lgtm,
    }).promise();

    await this.fileStorage.save({
      path: id,
      data: buf,
      contentType: 'image/png',
    });

    await this.dynamodbDocumentClient.update({
      TableName: this.tableName,
      Key: { id, created_at },
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
