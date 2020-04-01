export default class RemoteVault {

  constructor() {}

  /**
   * Returns the "ready" promise.  This promise resolves to `true` once this 
   * vault is ready.  If it resolves to `false`, then an error has occured.
   */
  public getReadyPromise(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}