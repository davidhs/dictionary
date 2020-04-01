/**
 * Allows you to store JSON data in local storage.
 * 
 * NOTE: keys are prefixed before retrieving or inserting into local storage.
 * 
 * WARNING: keys can collide 
 */
export default class JSONLocalStorage<T> {
  private keyPrefix: string;

  /**
   * Construct new JSON local storage.
   */
  constructor(keyPrefix: string) {
    this.keyPrefix = keyPrefix;
  }

  /**
   * Fetches value by key
   * 
   * @param key 
   */
  public get(key: string): T | undefined {
    const { keyPrefix } = this;

    const lskey = `${keyPrefix}${key}`;
    const rawItem = localStorage.getItem(lskey);

    if (rawItem !== null) {
      const result = JSON.parse(rawItem).value as T;

      return result;
    } else {
      return undefined;
    }
  }

  /**
   * Sets key-value
   * 
   * @param key 
   * @param value 
   */
  public set(key: string, value: T): void {
    const { keyPrefix } = this;

    const lskey = `${keyPrefix}${key}`;
    const lsvalue = JSON.stringify({ value });

    localStorage.setItem(lskey, lsvalue);
  }

  /**
   * Removes item with key `key`.  If no such item exists then nothing happens.
   * 
   * @param key 
   */
  public remove(key: string): void {
    const { keyPrefix } = this;

    const lskey = `${keyPrefix}${key}`;

    localStorage.removeItem(lskey);
  }

  /**
   * Removes all items.
   */
  public clear(): void {
    const { keyPrefix } = this;

    Object.keys(localStorage)
      .filter(x => x.startsWith(keyPrefix))
      .forEach((key) => {
        localStorage.removeItem(key);
      });
  }
}