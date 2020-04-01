import { VaultSync } from "./types";

export default class CachedVault<T> implements VaultSync<T> {
  private keyPrefix: string;
  private cache: Map<string, T>;

  /**
   * TODO: remove `dictionaryNamespace`, and replace `localStorageNamespace`
   * with `localStorageKeyPrefix`.
   * 
   * @param localStorageNamespace 
   * @param dictionaryNamespace 
   */
  constructor(localStorageNamespace: string, dictionaryNamespace: string) {
    this.keyPrefix = `${localStorageNamespace}:${dictionaryNamespace}:`;

    // A mapping from terms to descriptions (or anything really)
    this.cache = new Map();

    ////////////////////////////////
    // Read everything into cache //
    ////////////////////////////////

    Object.keys(localStorage).filter(key => key.startsWith(this.keyPrefix)).map(key => key.substring(this.keyPrefix.length, key.length)).forEach((key) => {
      const lskey = `${this.keyPrefix}${key}`;
      const rawItem = localStorage.getItem(lskey);

      if (rawItem !== null) {
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

    localStorage.setItem(lskey, lsvalue);
  }

  /**
   * Remove key
   * 
   * @param key 
   */
  public remove(key: string): void {
    const lskey = `${this.keyPrefix}${key}`;
    localStorage.removeItem(lskey);
  }

  /**
   * Removes all entries.
   */
  public clear(): void {
    Object.keys(localStorage).filter(x => x.startsWith(this.keyPrefix)).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}