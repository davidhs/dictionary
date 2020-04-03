export interface ExportTerm {
  term: string;
  description: string;
}

export interface Legacy1ExportObject {
  terms: ExportTerm[];
}

export interface ExportSubdictionary {
  namespace: string;
  terms: ExportTerm[];
}

export interface ExportObject {
  dictionaries: ExportSubdictionary[];
}

export type ImportObject = ExportObject | Legacy1ExportObject;

/**
 * A vault is a storage with a synchronous frontend.
 * 
 * The backend should always be ready!
 * 
 * The backend of a vault can be synchronous or asynchronous, it really
 * shouldn't matter.
 */
export interface Vault<T> {
  /**
   * Returns value of entry with key `key` if exists, otherwise returns
   * `undefined`.
   */
  get: (key: string) => T | undefined;

  /**
   * Sets entry with key `key` and value `value`.
   */
  set: (key: string, value: T) => void;

  /**
   * Removes an entry with key `key` if it exists.
   */
  remove: (key: string) => void;

  /**
   * Removes all entries.
   */
  clear: () => void;

  /**
   * Checks if vault has item with given key.
   */
  has: (key: string) => boolean;

  /**
   * Returns how many entries this vault has.
   */
  size: () => number;

  /**
   * Returns a list of all the keys.
   */
  keys: () => string[];
}

export type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue };
