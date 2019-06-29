export class StringProvider {
  Replace(value: string, search: string, replacement: string): string {
    return value.split(search).join(replacement);
  }
}
