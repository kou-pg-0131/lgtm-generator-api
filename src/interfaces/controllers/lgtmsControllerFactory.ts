import { S3 } from 'aws-sdk';
import { ILgtmsController, LgtmsController } from '.';
import { DynamoDBDocumentClientFactory, LgtmsRepository, ILgtmsRepository } from '../gateways';
import { LgtmWriter, S3FileStorage, Renderer } from '../../infrastructures';

export class LgtmsControllerFactory {
  public create(): ILgtmsController {
    return new LgtmsController({
      lgtmsRepository: this.createLgtmsRepository(),
      renderer: new Renderer(),
    });
  }

  private createLgtmsRepository(): ILgtmsRepository {
    return new LgtmsRepository({
      fileStorage: new S3FileStorage({ bucket: process.env.S3_BUCKET_LGTMS, s3Client: new S3() }),
      tableName: process.env.DYNAMODB_TABLE_LGTMS,
      lgtmWriter: new LgtmWriter(),
      dynamodbDocumentClient: new DynamoDBDocumentClientFactory().create(),
    });
  }
}
