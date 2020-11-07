import * as fs from 'fs';
import { S3 } from 'aws-sdk';
import { IFileStorage } from '../interfaces/gateways';

export class S3FileStorage implements IFileStorage {
  constructor(private config: { bucket: string; s3Client: S3; }) {}

  public async save(params: { path: string; data: Buffer; contentType: string; }): Promise<void> {
    if (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') {
      fs.writeFileSync(`tmp/lgtms/${params.path}`, params.data);
    } else {
      await this.config.s3Client.putObject({
        Bucket: this.config.bucket,
        Key: params.path,
        Body: params.data,
        ContentType: params.contentType,
      }).promise();
    }
  }

  public async delete(params: { path: string; }): Promise<void> {
    await this.config.s3Client.deleteObject({
      Bucket: this.config.bucket,
      Key: params.path,
    }).promise();
  }
}
