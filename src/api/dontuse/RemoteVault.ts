import { Vault } from "../types";

// TODO: maybe use a factory pattern or something?
export default class RemoteVault<T> /* implements Vault<T> */ {

  constructor() {}

  /**
   * Returns the "ready" promise.  This promise resolves to `true` once this 
   * vault is ready.  If it resolves to `false`, then an error has occured.
   */
  public onReady(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}