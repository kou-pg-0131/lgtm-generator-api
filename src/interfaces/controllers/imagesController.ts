import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import 'source-map-support/register';
import { IImagesRepository } from '../gateways';
import { ImagesControllerFactory, IRenderer, IResponse } from '.';

export interface IImagesController {
  search(event: APIGatewayProxyEventV2): Promise<IResponse>;
}

export class ImagesController implements IImagesController {
  constructor(private config: { imagesRepository: IImagesRepository; renderer: IRenderer; }) {}

  public async search(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const q = event.queryStringParameters?.q;
    if (!q) return this.config.renderer.badRequest();

    const images = await this.config.imagesRepository.search({ q });
    return this.config.renderer.ok(JSON.stringify(images));
  }
}

export const searchImages: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ImagesControllerFactory().create().search(event) as APIGatewayProxyResultV2;
};
