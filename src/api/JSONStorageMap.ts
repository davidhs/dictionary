import StorageMap from "./StorageMap";
import { JSONValue } from "./types";


/**
 * WARNING: Still under development!
 */
export default class JSONStorageMap implements Map<string, JSONValue> {
  /**
   * @private
   */
  #map: Map<string, string>;

  /**
   * Defaults 
   */
  constructor(storage: Storage) {
    this.#map = new StorageMap(storage);
  }

  /**
   * 
   * @param key 
   */
  get(key: string): JSONValue | undefined {
    const value = this.#map.get(key);

    if (typeof value === "undefined") return undefined;

    const jsonValue: JSONValue = JSON.parse(value);

    return jsonValue;
  }

  /**
   * 
   * @param key 
   * @param value 
   */
  set(key: string, value: JSONValue): this {
    const jsonString: string = JSON.stringify(value);

    this.#map.set(key, jsonString);

    return this;
  }

  /**
   * 
   * @param key 
   */
  has(key: string): boolean {
    return this.#map.has(key);
  }

  /**
   * 
   * @param key 
   */
  delete(key: string): boolean {
    return this.#map.delete(key);
  }

  /**
   * 
   */
  clear(): void {
    this.#map.clear();
  }

  /**
   * 
   */
  * entries(): IterableIterator<[string, JSONValue]> {
    for (const [key, value] of this.#map.entries()) {
      const jsonValue: JSONValue = JSON.parse(value);
      yield [key, jsonValue];
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
    for (const [key, ] of this.#map.entries()) {
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
    for (const [_, value] of this.#map.entries()) {
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
    for (const [key, value] of this.#map.entries()) {
      yield [key, JSON.parse(value)];
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
    return this.#map.size;
  }
}
