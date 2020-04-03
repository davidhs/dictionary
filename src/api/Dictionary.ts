/**
 * TODO: a dictionary should not concern itself with local storage or name-
 * spaces (ideally).
 */
export default class Dictionary {
  #map: Map<string, string>;
  
  /**
   * The vault **must** be ready before constructing a dictionary.
   * 
   * @param vault
   */
  constructor(map: Map<string, string>) {
    this.#map = map;
  }

  /**
   * Retrieves the description for the term, or `undefined` if the term is not
   * defined.
   * 
   * @param term 
   */
  public get(term: string): string | undefined {
    return this.#map.get(term);
  }

  /**
   * Sets the term with the description.
   * 
   * @param term 
   * @param description 
   */
  public set(term: string, description: string): void {
    this.#map.set(term, description);
  }

  /**
   * Removes the term if exists.  If it doesn't exist then nothing happens.
   * 
   * @param term 
   */
  public remove(term: string): void {
    this.#map.delete(term);
  }

  /**
   * Removes all terms and descriptions from this dictionary.
   */
  public clear(): void {
    this.#map.clear();
  }
}
