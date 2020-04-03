import StorageMap from "./StorageMap";


class LocalStorageMap extends StorageMap {
  constructor() {
    super(localStorage);
  }

  get [Symbol.toStringTag]() {
    return 'LocalStorageMap';
  }
}


const localStorageMap = new LocalStorageMap();

export default localStorageMap;
