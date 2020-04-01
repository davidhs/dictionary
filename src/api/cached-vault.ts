export default class CachedVault<T> {
  private keyPrefix: string;
  private cache: Map<string, T>;

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

  public get(key: string): T | undefined {
    return this.cache.get(key);
  }

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

  public remove(key: string): void {
    const lskey = `${this.keyPrefix}${key}`;
    localStorage.removeItem(lskey);
  }

  public clear(): void { }
}