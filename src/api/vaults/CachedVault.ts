import { Vault } from "../types";
import LocalStorageVault from "./LocalStorageVault";

/**
 * Vault which caches has a "front" cache.
 */
export default class CachedVault<T> implements Vault<T> {
  private backendVault: LocalStorageVault;
  private keyPrefix: string;
  private cache: Map<string, T>;

  /**
   * @param keyPrefix 
   */
  constructor(keyPrefix: string) {
    // TODO: be able to choose another backend?
    this.keyPrefix = keyPrefix;

    this.backendVault = new LocalStorageVault();

    // A mapping from terms to descriptions (or anything really)
    this.cache = new Map();

    ////////////////////////////////
    // Read everything into cache //
    ////////////////////////////////

    Object.keys(this.backendVault).filter(key => key.startsWith(this.keyPrefix)).map(key => key.substring(this.keyPrefix.length, key.length)).forEach((key) => {
      const lskey = `${this.keyPrefix}${key}`;
      const rawItem = this.backendVault.get(lskey);

      if (rawItem) {
        this.cache.set(key, JSON.parse(rawItem).value);
      }
    });
  }

  /**
   * WARNING: BE VERY CAREFUL!
   */
  public getCache() {
    return this.cache;
  }

  /**
   * Retrieves the value for key `key`.
   * 
   * @param key 
   */
  public get(key: string): T | undefined {
    return this.cache.get(key);
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

    this.cache.set(key, value);

    ///////////////////////
    // Set local storage //
    ///////////////////////

    const lskey = `${this.keyPrefix}${key}`;
    const lsvalue = JSON.stringify({ value });

    this.backendVault.set(lskey, lsvalue);
  }

  /**
   * Remove key
   * 
   * @param key 
   */
  public remove(key: string): void {
    const lskey = `${this.keyPrefix}${key}`;
    this.backendVault.remove(lskey);
  }

  /**
   * Removes all entries.
   */
  public clear(): void {
    Object.keys(this.backendVault).filter(x => x.startsWith(this.keyPrefix)).forEach((key) => {
      this.backendVault.remove(key);
    });
  }
}