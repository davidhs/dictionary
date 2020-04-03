import JSONStorageMap from "./JSONStorageMap";
import { JSONValue } from "./types";


/**
 * Caches everything in a map that is not backed up by Storage.
 * 
 * WE NEED LONGER NAMES, NOW!
 * 
 * WARNING: Still under development!
 */
export default class KeyPrefixedCachedJSONStorageMap implements Map<string, JSONValue> {
  /**
   * @private
   */
  #backend: Map<string, JSONValue>;
  #cache: Map<string, JSONValue>;
  #keyPrefix: string;

  /**
   * Defaults 
   */
  constructor(keyPrefix: string, storage: Storage) {
    this.#backend = new JSONStorageMap(storage);
    this.#cache = new Map();
    this.#keyPrefix = keyPrefix;

    /////////////////////////////////////////////////////////////////////
    // Read everything with the correct prefix from backend into cache //
    /////////////////////////////////////////////////////////////////////

    for (const [key, value] of this.#backend.entries()) {
      if (!key.startsWith(this.#keyPrefix)) continue;

      const unprefixedKey = key.substring(this.#keyPrefix.length);

      this.#cache.set(unprefixedKey, value);
    }
  }

  /**
   * 
   * @param key 
   */
  get(key: string): JSONValue | undefined {
    const prefixedKey = `${this.#keyPrefix}${key}`;

    return this.#cache.get(prefixedKey);
  }

  /**
   * 
   * @param key 
   * @param value 
   */
  set(key: string, value: JSONValue): this {
    const prefixedKey = `${this.#keyPrefix}${key}`;

    this.#backend.set(prefixedKey, value);
    this.#cache.set(prefixedKey, value);

    return this;
  }

  /**
   * 
   * @param key 
   */
  has(key: string): boolean {
    const prefixedKey = `${this.#keyPrefix}${key}`;

    return this.#cache.has(prefixedKey);
  }

  /**
   * 
   * @param key 
   */
  delete(key: string): boolean {
    const prefixedKey = `${this.#keyPrefix}${key}`;

    const result = this.#backend.delete(prefixedKey);

    this.#cache.delete(prefixedKey);

    return result;
  }

  /**
   * 
   */
  clear(): void {
    this.#cache.clear();

    // TODO: maybe there's a better way to do this?

    const keysToDelete = [];

    for (const key in this.#backend.keys()) {
      if (key.startsWith(this.#keyPrefix)) {
        keysToDelete.push(key);
      }
    }

    for (let i = 0; i < keysToDelete.length; i += 1) {
      const keyToDelete = keysToDelete[i];
      this.#backend.delete(keyToDelete);
    }
  }

  /**
   * 
   */
  * entries(): IterableIterator<[string, JSONValue]> {
    for (const [prefixedKey, value] of this.#cache.entries()) {
      const unprefixedKey = prefixedKey.substring(this.#keyPrefix.length);

      yield [unprefixedKey, value];
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
  forEach(callbackfn: (value: JSONValue, key: string, map: Map<string, JSONValue>) => void, thisArg?: any): void {
    if (thisArg) callbackfn.bind(thisArg);

    for (const [key, value] of this.entries()) {
      callbackfn(value, key, this);
    }
  }

  /**
   * 
   */
  * keys(): IterableIterator<string> {
    for (const [key, ] of this.#cache.entries()) {
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
  * values(): IterableIterator<JSONValue> {
    for (const [, value] of this.#cache.entries()) {
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
    return 'StorageJSONMap';
  }

  /**
   * TODO: what is this supposed to do?
   */
  *[Symbol.iterator](): IterableIterator<[string, JSONValue]> {
    for (const [key, value] of this.#cache.entries()) {
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
    return this.#cache.size;
  }
}
