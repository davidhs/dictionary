import JSONStorageMap from "./JSONStorageMap";
import { JSONValue } from "../types";


/**
 * Caches everything in a map that is not backed up by Storage.
 * 
 * WARNING: Still under development!
 */
export default class CachedJSONStorageMap implements Map<string, JSONValue> {
  /**
   * @private
   */
  #backend: Map<string, JSONValue>;
  #cache: Map<string, JSONValue>;

  /**
   * Defaults 
   */
  constructor(storage: Storage) {
    this.#backend = new JSONStorageMap(storage);
    this.#cache = new Map();

    /////////////////////////////////////////////
    // Read everything from backend into cache //
    /////////////////////////////////////////////

    for (const [key, value] of this.#backend.entries()) {
      this.#cache.set(key, value);
    }
  }

  /**
   * 
   * @param key 
   */
  get(key: string): JSONValue | undefined {
    return this.#cache.get(key);
  }

  /**
   * 
   * @param key 
   * @param value 
   */
  set(key: string, value: JSONValue): this {
    this.#backend.set(key, value);
    this.#cache.set(key, value);

    return this;
  }

  /**
   * 
   * @param key 
   */
  has(key: string): boolean {
    return this.#cache.has(key);
  }

  /**
   * 
   * @param key 
   */
  delete(key: string): boolean {
    const result = this.#backend.delete(key);

    this.#cache.delete(key);

    return result;
  }

  /**
   * 
   */
  clear(): void {
    this.#backend.clear();
    this.#cache.clear();
  }

  /**
   * 
   */
  * entries(): IterableIterator<[string, JSONValue]> {
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
