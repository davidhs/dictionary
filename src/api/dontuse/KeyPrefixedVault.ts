import { Vault } from "../types";

/**
 * Wrapper Key-prefixed vault.
 */
export default class KeyPrefixedVault<T> implements Vault<T> {
  #backendVault: Vault<T>;
  #keyPrefix: string;

  constructor(backendVault: Vault<T>, keyPrefix: string) {
    this.#backendVault = backendVault;
    this.#keyPrefix = keyPrefix;
  }

  public get(key: string) {
    const prefixedKey = `${this.#keyPrefix}${key}`;

    return this.#backendVault.get(prefixedKey);
  }

  size() {
    return this.#backendVault.size();
  }

  has(key: string) {
    const prefixedKey = `${this.#keyPrefix}${key}`;

    return this.#backendVault.has(prefixedKey);
  }

  keys() {
    // TODO: I don't know if this is correctly implemented.
    const keys: string[] = [];

    this.#backendVault.keys()
      .filter(x => x.startsWith(this.#keyPrefix))
      .forEach((key) => {
        const unprefixedKey = key.substring(this.#keyPrefix.length);
        keys.push(unprefixedKey);
      });

    return keys;
  }

  set(key: string, value: T) {
    const prefixedKey = `${this.#keyPrefix}${key}`;

    this.#backendVault.set(prefixedKey, value);
  }

  remove(key: string) {
    const prefixedKey = `${this.#keyPrefix}${key}`;

    this.#backendVault.remove(prefixedKey);
  }

  /**
   * 
   */
  clear() {
    // NOTE: we must ONLY delete entries whose key is correctly prefixed!
    this.#backendVault.keys()
      .filter(x => x.startsWith(this.#keyPrefix))
      .forEach((key) => {
        this.#backendVault.remove(key);
      });
  }
}