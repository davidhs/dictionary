import { Vault, JSONValue } from "../types";


/**
 * Allows you to store JSON data in local storage.
 * 
 * NOTE: keys are prefixed before retrieving or inserting into local storage.
 * 
 * WARNING: keys can collide 
 */
export default class JSONVault implements Vault<JSONValue> {
  #backendVault: Vault<string>;

  /**
   * Construct new JSON local storage.
   * 
   * TODO: extend underlaying vault capabilities?
   */
  constructor(backendVault: Vault<string>) {
    this.#backendVault = backendVault;
  }

  /**
   * Fetches value by key
   * 
   * @param key 
   */
  public get(key: string): JSONValue | undefined {
    const result = this.#backendVault.get(key);

    if (result) {
      return JSON.parse(result) as JSONValue;
    } else {
      return undefined;
    }
  }

  has(key: string) {
    return this.#backendVault.has(key);
  }

  size() {
    return this.#backendVault.size();
  }

  keys() {
    return this.#backendVault.keys();
  }

  /**
   * Sets key-value
   * 
   * @param key 
   * @param value 
   */
  public set(key: string, value: JSONValue): void {
    this.#backendVault.set(key, JSON.stringify(value));
  }

  /**
   * Removes item with key `key`.  If no such item exists then nothing happens.
   * 
   * @param key 
   */
  public remove(key: string): void {
    this.#backendVault.remove(key);
  }

  /**
   * Removes all items.
   */
  public clear(): void {
    this.#backendVault.clear();
  }
}