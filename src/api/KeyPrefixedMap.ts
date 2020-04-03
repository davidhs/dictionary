/**
 * Assumption: this key-prefixed map is the sole owner of the key prefix and
 * nothing else in the program is messing with that key prefix.
 */
export default class KeyPrefixedMap<V> implements Map<string, V> {
  #backend: Map<string, V>;
  #cache: Map<string, V>;
  #keyPrefix: string;

  constructor(map: Map<string, V>, keyPrefix: string) {
    this.#backend = map;
    this.#keyPrefix = keyPrefix;
    this.#cache = new Map();

    for (const [key, value] of this.#backend) {
      if (!key.startsWith(this.#keyPrefix)) continue;

      const unprefixedKey = key.substring(this.#keyPrefix.length);

      this.#cache.set(unprefixedKey, value);
    }
  }

  get(key: string): V | undefined {
    return this.#cache.get(key);
  }

  set(key: string, value: V): this {
    this.#cache.set(key, value);

    const prefixedKey = `${this.#keyPrefix}${key}`;

    this.#backend.set(prefixedKey, value);

    return this;
  }

  has(key: string): boolean {
    return this.#cache.has(key);
  }


  delete(key: string): boolean {
    if (!this.#cache.has(key)) return false;

    this.#cache.delete(key);

    const prefixedKey = `${this.#keyPrefix}${key}`;

    this.#backend.delete(prefixedKey);

    return true;
  }

  clear(): void {
    for (const key of this.#cache.keys()) {
      this.#cache.delete(key);

      const prefixedKey = `${this.#keyPrefix}${key}`;

      this.#backend.delete(prefixedKey);
    }
  }

  * entries(): IterableIterator<[string, V]> {
    for (const pair of this.#cache.entries()) {
      yield pair;
    }

    return {
      value: undefined,
      done: true
    };
  }

  forEach(callbackfn: (value: V, key: string, map: Map<string, V>) => void, thisArg?: any): void {
    if (thisArg) callbackfn.bind(thisArg);

    for (const [key, value] of this.entries()) {
      callbackfn(value, key, this);
    }
  }

  * keys(): IterableIterator<string> {
    for (const key of this.#cache.keys()) {
      yield key;
    }

    return {
      value: undefined,
      done: true
    };
  }

  * values(): IterableIterator<V> {
    for (const value of this.#cache.values()) {
      yield value;
    }

    return {
      value: undefined,
      done: true
    };
  }

  *[Symbol.iterator](): IterableIterator<[string, V]> {
    for (const pair of this.#cache.entries()) {
      yield pair;
    }

    return {
      value: undefined,
      done: true
    };
  }

  get [Symbol.toStringTag]() {
    return 'KeyPrefixedMap';
  }

  get size() {
    return this.#cache.size;
  }
}