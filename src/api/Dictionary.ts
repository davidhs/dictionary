import CachedVault from "./CachedVault";
import { Vault } from "./types";

/**
 * TODO: a dictionary should not concern itself with local storage or name-
 * spaces (ideally).
 */
export default class Dictionary {
  private cachedVault: Vault<string>;
  
  /**
   * TODO: supply `Dictionary` with some sort of storage object so that it
   * doesn't have to deal with local storage or anything else per se.
   * 
   * @param localStorageNamespace 
   * @param dictionaryNamespace 
   */
  constructor(localStorageNamespace: string, dictionaryNamespace: string) {
    this.cachedVault = new CachedVault(localStorageNamespace, dictionaryNamespace);
  }

  /**
   * Retrieves the description for the term, or `undefined` if the term is not
   * defined.
   * 
   * @param term 
   */
  public get(term: string) {
    return this.cachedVault.get(term);
  }

  /**
   * Sets the term with the description.
   * 
   * @param term 
   * @param description 
   */
  public set(term: string, description: string): void {
    this.cachedVault.set(term, description);
  }

  /**
   * Removes the term if exists.  If it doesn't exist then nothing happens.
   * 
   * @param term 
   */
  public remove(term: string): void {
    this.cachedVault.remove(term);
  }

  /**
   * Removes all terms and descriptions from this dictionary.
   */
  public clear(): void {
    this.cachedVault.clear();
  }
}
