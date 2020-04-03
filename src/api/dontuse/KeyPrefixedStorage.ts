/**
 * I don't know what to call this
 */
export default class KeyPrefixedStorage implements Storage {
  #storage: Storage;
  #keyPrefix: string;

  constructor(storage: Storage, keyPrefix: string) {
    this.#storage = storage;
    this.#keyPrefix = keyPrefix;
  }

  clear(): void {
    const keys: string[] = [];
    const n = this.#storage.length;

    for (let i = 0; i < n; i += 1) {
      const key = this.#storage.key(i);

      if (key === null) continue;

      if (key.startsWith(this.#keyPrefix)) {
        keys.push(key);
      }
    }

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      this.#storage.removeItem(key);
    }
  }

  get length() {
    let len = 0;
    const n = this.#storage.length;
    for (let i = 0; i < n; i += 1) {
      const key = this.#storage.key(i);

      if (key === null) continue;

      if (key.startsWith(this.#keyPrefix)) {
        len += 1;
      }
    }

    return len;
  }

  getItem(key: string): string | null {
    return this.#storage.getItem(`${this.#keyPrefix}${key}`);
  }

  key(index: number): string | null {
    // This code is awfully slow, but this is only intended for testing /
    // debugging purposes.
    //   Maybe in the future I'll come up with a faster implementation.

    let idx = 0;

    const n = this.#storage.length;

    for (let i = 0; i < n; i += 1) {
      const key = this.#storage.key(i);

      if (key === null) continue;

      if (key.startsWith(this.#keyPrefix)) {

        if (idx === index) {
          return key.substring(this.#keyPrefix.length);
        }

        idx += 1;
      }
    }

    return null;
  }

  removeItem(key: string): void {
    this.#storage.removeItem(`${this.#keyPrefix}${key}`);
  }

  setItem(key: string, value: string): void {
    this.#storage.setItem(`${this.#keyPrefix}${key}`, value);
  }
}
