export class ObjMap<K, V> {
  private readonly map: Map<string, V>;

  constructor(items: [K, V][]) {
    this.map = new Map<string, V>();

    items.forEach(([key, val]) => {
      this.map.set(JSON.stringify(key), val);
    });
  }

  public get(key: K): V | undefined {
    return this.map.get(JSON.stringify(key));
  }

  public set(key: K, val: V): void {
    this.map.set(JSON.stringify(key), val);
  }
}
