import CachedVault from "./cached-vault";

export default class Dictionary {
  private cachedVault: CachedVault<string>;
  
  constructor(localStorageNamespace: string, dictionaryNamespace: string) {
    this.cachedVault = new CachedVault(localStorageNamespace, dictionaryNamespace);
  }

  public get(key: string) {
    return this.cachedVault.get(key);
  }

  public set(key: string, value: string): void {
    this.cachedVault.set(key, value);
  }

  public remove(key: string): void {
    this.cachedVault.remove(key);
  }

  /**
   * 
   * @param confirmation 
   */
  public clear(confirmation = false): void {
    if (!confirmation) {
      return;
    }

    this.cachedVault.clear();
  }
}
