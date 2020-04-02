import { Vault } from "../types";

/**
 * Wrapper Key-prefixed vault.
 */
export default class KeyPrefixedVault<T> implements Vault<T> {
  private backendVault: Vault<T>;
  private keyPrefix: string;

  constructor(backendVault: Vault<T>, keyPrefix: string) {
    this.backendVault = backendVault;
    this.keyPrefix = keyPrefix;
  }

  public get(key: string) {
    const prefixedKey = `${this.keyPrefix}${key}`;

    const x = new Map();

    x.values

    return this.backendVault.get(prefixedKey);
  }

  set(key: string, value: T) {
    const prefixedKey = `${this.keyPrefix}${key}`;

    this.backendVault.set(prefixedKey, value);
  }

  remove(key: string) {
    const prefixedKey = `${this.keyPrefix}${key}`;

    this.backendVault.remove(prefixedKey);
  }

  /**
   * 
   */
  clear() {
    // NOTE: we must ONLY delete entries whose key is correctly prefixed!
    Object.keys(this.backendVault).filter(x => x.startsWith(this.keyPrefix)).forEach((key) => {
      this.backendVault.remove(key);
    });
  }
}