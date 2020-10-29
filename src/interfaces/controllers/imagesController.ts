import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import 'source-map-support/register';
import { IImagesUsecase } from '../../usecases';
import { ImagesControllerFactory } from '.';

export interface IImagesController {
  search(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2>;
}

export class ImagesController implements IImagesController {
  private imagesUsecase: IImagesUsecase;

  constructor(config: { imagesUsecase: IImagesUsecase; }) {
    this.imagesUsecase = config.imagesUsecase;
  }

  public async search(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const q = event.queryStringParameters?.q;
    if (!q) return { statusCode: 400, body: JSON.stringify({ message: 'Query is empty.' }) };

    const images = await this.imagesUsecase.search({ q });

    return {
      statusCode: 200,
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(images),
    };
  }
}

export const searchImages: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ImagesControllerFactory().create().search(event);
};
