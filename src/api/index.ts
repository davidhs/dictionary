import Library from "./Library";

const LOCAL_STORAGE_NAMESPACE = 'tu8rbgh8';

const library = new Library(LOCAL_STORAGE_NAMESPACE);

// @ts-ignore
window.library = library;

export default {
  getLibrary: () => {
    return library;
  }
};
