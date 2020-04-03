import { Vault } from "../types";
import StorageVault from "./StorageVault";

/**
 * Vault which caches has a "front" cache.
 */
export default class CachedVault<T> implements Vault<T> {
  #backendVault: StorageVault;
  #keyPrefix: string;
  #cache: Map<string, T>;

  /**
   * @param keyPrefix 
   */
  constructor(keyPrefix: string) {
    // TODO: be able to choose another backend?
    this.#keyPrefix = keyPrefix;

    this.#backendVault = new StorageVault();

    // A mapping from terms to descriptions (or anything really)
    this.#cache = new Map();

    ////////////////////////////////
    // Read everything into cache //
    ////////////////////////////////

    // NOTE: we want to store keys unprefixed in the cache and prefixed in the
    // backend vault.

    // Here we unprefix the string.
    Object.keys(this.#backendVault)
      .filter(key => key.startsWith(this.#keyPrefix))
      .map(key => key.substring(this.#keyPrefix.length))
      .forEach((key) => {
        const lskey = `${this.#keyPrefix}${key}`;
        const rawItem = this.#backendVault.get(lskey);

        if (typeof rawItem !== "undefined") {
          this.#cache.set(key, JSON.parse(rawItem));
        }
      });
  }

  /**
   * WARNING: BE VERY CAREFUL!
   */
  public getCache() {
    return this.#cache;
  }

  public keys() {
    const keys: string[] = [];

    for (const key of this.#cache.keys()) {
      keys.push(`${this.#keyPrefix}${key}`);
    }

    return keys;
  }

  has(key: string) {
    return this.#cache.has(key);
  }

  size() {
    return this.#cache.size;
  }


  /**
   * Retrieves the value for key `key`.
   * 
   * @param key 
   */
  public get(key: string): T | undefined {
    return this.#cache.get(key);
  }

  /**
   * Set key-value
   * 
   * @param key 
   * @param value 
   */
  public set(key: string, value: T): void {
    ///////////////
    // Set cache //
    ///////////////

    this.#cache.set(key, value);

    ///////////////////////
    // Set local storage //
    ///////////////////////

    const prefixedKey = `${this.#keyPrefix}${key}`;
    this.#backendVault.set(prefixedKey, JSON.stringify(value));
  }

  /**
   * Remove key
   * 
   * @param key 
   */
  public remove(key: string): void {
    this.#cache.delete(key);

    const prefixedKey = `${this.#keyPrefix}${key}`;
    this.#backendVault.remove(prefixedKey);
  }

  /**
   * Removes all entries.
   */
  public clear(): void {
    this.#cache.clear();

    this.#backendVault.keys()
      .filter(x => x.startsWith(this.#keyPrefix))
      .forEach(key => this.#backendVault.remove(key));
  }
}