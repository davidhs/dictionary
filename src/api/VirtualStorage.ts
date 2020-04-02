/**
 * I don't know what to call this
 */
export default class VirtualStorage implements Storage {
  
  #map: Map<string, string>;

  constructor() {
    this.#map = new Map();
  }

  clear(): void {
    this.#map.clear();
  }

  get length() {
    return this.#map.size;
  }

  getItem(key: string): string | null {
    const value = this.#map.get(key);

    if (typeof value === "undefined") return null;

    return value;
  }

  key(index: number): string | null {
    // This code is awfully slow, but this is only intended for testing /
    // debugging purposes.
    //   Maybe in the future I'll come up with a faster implementation.

    let i = 0;
    for (const key of this.#map.keys()) {
      if (i === index) return key;
      i += 1;
    }

    return null;
  }

  removeItem(key: string): void {
    this.#map.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#map.set(key, value);
  }
}
