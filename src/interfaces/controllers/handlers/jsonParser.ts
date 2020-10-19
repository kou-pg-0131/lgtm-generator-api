export class JsonParser {
  public parse(str: string): [any, boolean] { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      return [JSON.parse(str), true];
    } catch {
      return [undefined, false];
    }
  }
}
