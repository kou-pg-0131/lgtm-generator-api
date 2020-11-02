export interface IFileStorage {
  save(params: { path: string; contentType: string; data: Buffer; }): Promise<void>;
  delete(params: { path: string; }): Promise<void>;
}
