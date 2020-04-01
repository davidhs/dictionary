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
 * Synchronous frontend for the vault.
 */
interface VaultFrontend<T> {
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
}

/**
 * Vault with synchronous frontend and ***synchronous*** backend.
 */
export interface VaultSync<T> extends VaultFrontend<T> {}

/**
 * Vault with synchronous frontend and ***asynchronous*** backend.
 */
export interface VaultAsync<T> extends VaultFrontend<T> {

  /**
   * Once processing the backend is done then the returned promise should 
   * resolve.
   * 
   * Resolves to `true` if successful, otherwise `false`
   */
  ready: () => Promise<boolean>;
}

/**
 * A vault with either a synchronous or asynchronous backend.
 */
export type Vault<T> = VaultSync<T> | VaultAsync<T>;
