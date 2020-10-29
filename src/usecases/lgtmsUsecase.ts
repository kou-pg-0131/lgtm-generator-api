import { Lgtm } from '../domain';
import { ILgtmsRepository } from '.';

export interface ILgtmsUsecase {
  getAll(params: { evaluatedId?: string; }): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }>;
  create(params: { base64?: string; url?: string; }): Promise<Lgtm>;
}

export class LgtmsUsecase implements ILgtmsUsecase {
  private lgtmsRepository: ILgtmsRepository;

  constructor(
    config: {
      lgtmsRepository: ILgtmsRepository;
    },
  ) {
    this.lgtmsRepository = config.lgtmsRepository;
  }

  public async getAll(params: { evaluatedId?: string; }): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }> {
    return await this.lgtmsRepository.getAll(params.evaluatedId);
  }

  public async create(params: { base64?: string; url?: string; }): Promise<Lgtm> {
    return await this.lgtmsRepository.create(params);
  }
}
