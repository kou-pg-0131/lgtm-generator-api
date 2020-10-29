import { Lgtm } from '../domain';

export interface ILgtmsRepository {
  getAll(evaluatedId?: string): Promise<{ lgtms: Lgtm[]; evaluatedId: string; }>;
  create(params: { base64?: string; url?: string; }): Promise<Lgtm>;
}
