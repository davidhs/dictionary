import { Vault } from "../types";

/**
 * Concrete implementation of a vault using Local Storage as its backend.
 */
export default class LocalStorageVault implements Vault<string> {
  private backend: Storage;

  constructor() {
    this.backend = localStorage;
  }

  public get(key: string) {
    const item = this.backend.getItem(key);

    if (item === null) {
      return undefined;
    } else {
      return item;
    }
  }

  set(key: string, value: string) {
    this.backend.setItem(key, value);
  }

  remove(key: string) {
    this.backend.removeItem(key);
  }

  clear() {
    this.backend.clear();
  }
}


