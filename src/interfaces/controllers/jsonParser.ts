export class JsonParser {
  public parse<T>(str: string): T | undefined {
    try {
      return JSON.parse(str);
    } catch {
      return undefined;
    }
  }
}
