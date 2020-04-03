import { Vault } from "../types";

/**
 * Concrete implementation of a vault using Local Storage as its backend.
 * 
 * Only instantiate this once!
 */
class LocalStorageVault implements Vault<string> {

  constructor() {}

  public get(key: string) {
    const item = localStorage.getItem(key);

    return item !== null ? item : undefined;
  }

  keys() {
    return Object.keys(localStorage);
  }

  size() {
    return localStorage.length;
  }

  has(key: string) {
    return localStorage.getItem(key) !== null;
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}


const localStorageVault = new LocalStorageVault();

export default localStorageVault;

