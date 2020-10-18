import { ILgtmsController, LgtmsController } from '.';
import { IImageLoader, ILgtmsRepository, ILgtmWriter, LgtmsRepository } from '../gateways';
import { ImageLoader, LgtmWriter, S3FileStorage } from '../../infrastructures';

export class LgtmsControllerFactory {
  public create(): ILgtmsController {
    return new LgtmsController({
      imageLoader: this.createImageLoader(),
      lgtmsRepository: this.createLgtmsRepository(),
      lgtmWriter: this.createLgtmWriter(),
    });
  }

  private createImageLoader(): IImageLoader {
    return new ImageLoader();
  }

  private createLgtmsRepository(): ILgtmsRepository {
    return new LgtmsRepository({
      fileStorage: new S3FileStorage({ bucket: process.env.S3_BUCKET_LGTMS }),
      tableName: process.env.DYNAMODB_TABLE_LGTMS,
    });
  }

  private createLgtmWriter(): ILgtmWriter {
    return new LgtmWriter();
  }
}
