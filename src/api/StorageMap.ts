/**
 * WARNING: Still under development!
 */
export default class StorageMap implements Map<string, string> {
  /**
   * @private
   */
  #storage: Storage;

  /**
   * Defaults 
   */
  constructor(storage: Storage) {
    this.#storage = storage;
  }

  /**
   * 
   * @param key 
   */
  get(key: string): string | undefined {
    const item = this.#storage.getItem(key);
    return item === null ? undefined : item;
  }

  /**
   * 
   * @param key 
   * @param value 
   */
  set(key: string, value: string): this {
    this.#storage.setItem(key, value);

    return this;
  }

  /**
   * 
   * @param key 
   */
  has(key: string): boolean {
    const item = this.#storage.getItem(key);

    return item !== null;
  }

  /**
   * 
   * @param key 
   */
  delete(key: string): boolean {
    const item = this.#storage.getItem(key);

    if (item === null) return false;

    this.#storage.removeItem(key);

    return true;
  }

  /**
   * 
   */
  clear(): void {
    this.#storage.clear();
  }

  /**
   * 
   */
  * entries(): IterableIterator<[string, string]> {
    const n = this.#storage.length;

    for (let i = 0; i < n; i += 1) {
      const key = this.#storage.key(i);

      if (!key) continue;

      const value = this.#storage.getItem(key);

      if (value === null) throw new Error();

      yield [key, value];
    }

    return {
      value: undefined,
      done: true
    };
  }

  /**
   * 
   * @param callbackfn 
   * @param thisArg 
   */
  forEach(callbackfn: (value: string, key: string, map: Map<string, string>) => void, thisArg?: any): void {
    if (thisArg) callbackfn.bind(thisArg);

    for (const [key, value] of this.entries()) {
      callbackfn(value, key, this);
    }
  }

  /**
   * 
   */
  * keys(): IterableIterator<string> {
    const n = this.#storage.length;

    for (let i = 0; i < n; i += 1) {
      const key = this.#storage.key(i);
      if (!key) continue;
      yield key;
    }

    return {
      value: undefined,
      done: true
    };
  }

  /**
   * 
   */
  * values(): IterableIterator<string> {
    const n = this.#storage.length;

    for (let i = 0; i < n; i += 1) {
      const key = this.#storage.key(i);
      
      if (!key) continue;

      const value = this.#storage.getItem(key);

      if (value === null) throw new Error();

      yield value;
    }

    return {
      value: undefined,
      done: true
    };
  }

  /**
   * TODO: is this the correct way to implement this?
   */
  get [Symbol.toStringTag]() {
    return 'StorageMap';
  }

  /**
   * TODO: what is this supposed to do?
   */
  *[Symbol.iterator](): IterableIterator<[string, string]> {
    const n = this.#storage.length;

    for (let i = 0; i < n; i += 1) {
      const key = this.#storage.key(i);

      if (!key) continue;

      const value = this.#storage.getItem(key);

      if (value === null) throw new Error();

      yield [key, value];
    }

    return {
      value: undefined,
      done: true
    };
  }

  /**
   * 
   */
  get size() {
    return this.#storage.length;
  }
}
