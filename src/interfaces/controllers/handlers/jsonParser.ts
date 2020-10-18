export class JsonParser {
  public parse(str: string): [any, boolean] {
    try {
      return [JSON.parse(str), true];
    } catch {
      return [undefined, false];
    }
  }
}
