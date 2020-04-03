export default class StorageMap implements Map<string, string> {
  #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
  }

  get(key: string): string | undefined {
    const item = this.#storage.getItem(key);
    
    return item === null ? undefined : item;
  }

  set(key: string, value: string): this {
    this.#storage.setItem(key, value);

    return this;
  }

  has(key: string): boolean {
    const item = this.#storage.getItem(key);

    return item !== null;
  }

  delete(key: string): boolean {
    const item = this.#storage.getItem(key);

    if (item === null) return false;

    this.#storage.removeItem(key);

    return true;
  }

  clear(): void {
    this.#storage.clear();
  }

  * entries(): IterableIterator<[string, string]> {
    for (let i = 0; i < this.#storage.length; i += 1) {
      const key = this.#storage.key(i);

      if (key === null) continue;

      const value = this.#storage.getItem(key);

      if (value === null) continue;

      yield [key, value];
    }

    return {
      value: undefined,
      done: true
    };
  }

  forEach(callbackfn: (value: string, key: string, map: Map<string, string>) => void, thisArg?: any): void {
    if (thisArg) callbackfn.bind(thisArg);

    for (let i = 0; i < this.#storage.length; i += 1) {
      const key = this.#storage.key(i);

      if (key === null) continue;

      const value = this.#storage.getItem(key);

      if (value === null) continue;

      callbackfn(value, key, this);
    }
  }

  * keys(): IterableIterator<string> {
    for (let i = 0; i < this.#storage.length; i += 1) {
      const key = this.#storage.key(i);
      
      if (key === null) continue;

      yield key;
    }

    return {
      value: undefined,
      done: true
    };
  }

  * values(): IterableIterator<string> {
    for (let i = 0; i < this.#storage.length; i += 1) {
      const key = this.#storage.key(i);
      
      if (key === null) continue;

      const value = this.#storage.getItem(key);

      if (value === null) continue;

      yield value;
    }

    return {
      value: undefined,
      done: true
    };
  }

  get [Symbol.toStringTag]() {
    return 'StorageMap';
  }

  *[Symbol.iterator](): IterableIterator<[string, string]> {
    for (let i = 0; i < this.#storage.length; i += 1) {
      const key = this.#storage.key(i);

      if (key === null) continue;

      const value = this.#storage.getItem(key);

      if (value === null) continue;

      yield [key, value];
    }

    return {
      value: undefined,
      done: true
    };
  }

  get size() {
    return this.#storage.length;
  }
}
