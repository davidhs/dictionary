import { Vault } from "../types";

/**
 * Concrete implementation of a vault using Local Storage as its backend.
 */
export default class StorageVault implements Vault<string> {
  #backend: Storage;
  #needsToUpdateCachedKeys: boolean;
  #cachedKeys: string[];

  /**
   * Defaults to using local storage.
   * 
   * @param storage 
   */
  constructor(storage: Storage = localStorage) {
    this.#backend = storage;
    this.#needsToUpdateCachedKeys = true;
    this.#cachedKeys = [];
  }

  public get(key: string) {
    const item = this.#backend.getItem(key);

    return item !== null ? item : undefined;
  }

  /**
   * DO NOT MODIFY THE KEYS!
   */
  keys() {
    if (this.#needsToUpdateCachedKeys) {
      this.#cachedKeys = Object.keys(this.#backend);
      this.#needsToUpdateCachedKeys = false;
    }

    return this.#cachedKeys;
  }

  size() {
    return this.#backend.length;
  }

  has(key: string) {
    return this.#backend.getItem(key) !== null;
  }

  set(key: string, value: string) {
    if (!this.has(key)) {
      this.#needsToUpdateCachedKeys = true;
    }

    this.#backend.setItem(key, value);
  }

  remove(key: string) {
    if (this.has(key)) {
      this.#needsToUpdateCachedKeys = true;
    }

    this.#backend.removeItem(key);
  }

  clear() {
    if (this.size() > 0) {
      this.#needsToUpdateCachedKeys = true;
    }
    
    this.#backend.clear();
  }
}


