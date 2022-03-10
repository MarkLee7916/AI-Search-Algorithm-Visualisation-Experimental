import { assertDefined } from '../genericUtils';

export class UncheckedObjMap<K, V> {
  private readonly map: Map<string, V>;

  constructor(items: [K, V][]) {
    this.map = new Map<string, V>();

    items.forEach(([key, val]) => {
      this.map.set(JSON.stringify(key), val);
    });
  }

  public get(key: K): V {
    const result = this.map.get(JSON.stringify(key));

    return assertDefined(result);
  }

  public set(key: K, val: V): void {
    this.map.set(JSON.stringify(key), val);
  }

  public keys(): K[] {
    return Array.from(this.map.keys()).map((keyStr) => JSON.parse(keyStr));
  }
}
