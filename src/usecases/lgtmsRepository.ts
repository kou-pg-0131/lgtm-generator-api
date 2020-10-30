import { Lgtm } from '../domain';

export interface ILgtmsRepository {
  getAll(evaluatedId?: string): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }>;
  create(params: { imageSrc: string | Buffer; }): Promise<Lgtm>;
}
