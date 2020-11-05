export interface ILgtmWriter {
  write(src: string | Buffer): Promise<Buffer>;
}
