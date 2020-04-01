import CachedVault from "./CachedVault";

export default class Dictionary {
  private cachedVault: CachedVault<string>;
  
  constructor(localStorageNamespace: string, dictionaryNamespace: string) {
    this.cachedVault = new CachedVault(localStorageNamespace, dictionaryNamespace);
  }

  /**
   * Retrieves the description for the term, or `undefined`.
   * 
   * @param term 
   */
  public get(term: string) {
    return this.cachedVault.get(term);
  }

  /**
   * Sets the term with the description
   * 
   * @param term 
   * @param description 
   */
  public set(term: string, description: string): void {
    this.cachedVault.set(term, description);
  }

  /**
   * Removes the term if exists or not.
   * 
   * @param term 
   */
  public remove(term: string): void {
    this.cachedVault.remove(term);
  }

  /**
   * Removes all terms.
   */
  public clear(): void {
    this.cachedVault.clear();
  }
}
