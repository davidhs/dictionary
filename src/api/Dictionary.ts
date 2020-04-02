import { Vault } from "./types";

/**
 * TODO: a dictionary should not concern itself with local storage or name-
 * spaces (ideally).
 */
export default class Dictionary {
  #vault: Vault<string>;
  
  /**
   * The vault **must** be ready before constructing a dictionary.
   * 
   * @param vault
   */
  constructor(vault: Vault<string>) {
    this.#vault = vault;
  }

  /**
   * Retrieves the description for the term, or `undefined` if the term is not
   * defined.
   * 
   * @param term 
   */
  public get(term: string): string | undefined {
    return this.#vault.get(term);
  }

  /**
   * Sets the term with the description.
   * 
   * @param term 
   * @param description 
   */
  public set(term: string, description: string): void {
    this.#vault.set(term, description);
  }

  /**
   * Removes the term if exists.  If it doesn't exist then nothing happens.
   * 
   * @param term 
   */
  public remove(term: string): void {
    this.#vault.remove(term);
  }

  /**
   * Removes all terms and descriptions from this dictionary.
   */
  public clear(): void {
    this.#vault.clear();
  }
}
