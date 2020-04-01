import Dictionary from "./dictionary";
import { ExportTerm, ExportObject, ExportSubdictionary, Legacy1ExportObject, ImportObject } from "./types";
import { escapeRegExp, assert } from "./lib";


// TODO: need a much more robust name to define dictionary names.

// TODO: maybe I don't want to put terms in lowercase anymore, just have a simple
// key-value database (string)

const DEFAULT_NAMESPACE = 'default';

/**
 * The purpose of this class is to be able to probe multiple dictionaries, and
 * keep track of which dictionary is in use, etc.
 */
export default class Library {

  private dictionaries: Map<string, Dictionary>
  private localStorageNamespace: string;

  constructor(localStorageNamespace: string) {
    this.dictionaries = new Map();
    this.localStorageNamespace = localStorageNamespace;

    //////////////////////////////
    // Load in all dictionaries //
    //////////////////////////////

    {
      const lsprefix = `${localStorageNamespace}:`;

      const namespacesSet = new Set<string>();

      Object.keys(localStorage)
        .filter(lskey => lskey.startsWith(lsprefix))
        .forEach(lskey => {
          const namespacedKey = lskey.substr(lsprefix.length);
          const colonIdx = namespacedKey.indexOf(':');
          const namespace = namespacedKey.substring(0, colonIdx);
          namespacesSet.add(namespace);
        });

      namespacesSet.forEach((namespace) => {
        const dictionary = new Dictionary(localStorageNamespace, namespace);
        this.dictionaries.set(namespace, dictionary);
      });
    }
  }

  /**
   * 
   * @param namespace 
   */
  public hasDictionary(namespace: string): boolean {
    return this.dictionaries.has(namespace);
  }

  /**
   * Creates a dictionary with the name `namespace`.  If a dictionary with the
   * same name exists then it throws an error.
   * 
   * @param namespace 
   * 
   * @throws
   */
  public createDictionary(namespace: string): void {
    assert(!this.hasDictionary(namespace));

    const dictionary = new Dictionary(this.localStorageNamespace, namespace);

    this.dictionaries.set(namespace, dictionary);
  }

  /**
   * Removes as dictionary.  Nothing happens if the dictionary doesn't exist.
   * 
   * @param namespace 
   */
  public removeDictionary(namespace: string) {
    const dictionary = this.dictionaries.get(namespace);

    if (!dictionary) return;

    dictionary.clear();
    this.dictionaries.delete(namespace);
  }

  /**
   * Removes every single dictionary.
   */
  public removeEverything() {
    // TODO: is this the most robust way to remove everything?
    const dictionaryNamespaces: string[] = [];

    for (const [dictionaryNamespace, _] of this.dictionaries.entries()) {
      dictionaryNamespaces.push(dictionaryNamespace);
    }

    for (const dictionaryNamespace of dictionaryNamespaces) {
      this.removeDictionary(dictionaryNamespace);
    }
  }

  /**
   * Search termsn and descriptions
   * 
   * @param paramQuery 
   * @param paramNamespace 
   */
  public legacy_searchTermsAndDescriptions(paramQuery: string, paramNamespace: string) {
    // TODO: this function needs to be completely reworked!

    const namespace = paramNamespace.trim().toLowerCase();
    const isFullsearch = namespace === '*';
    const query = paramQuery.trim().toLowerCase();
    const lsprefix = `${this.localStorageNamespace}:`;
    let namespaceExists = false;
    const namespacesSet = new Set<string>();

    ///////////////////////
    // Pick up all terms //
    ///////////////////////

    const allTerms = Object.keys(localStorage)
      .filter(lskey => lskey.startsWith(lsprefix))
      .map(lskey => {
        const namespacedKey = lskey.substr(lsprefix.length);

        const colonIdx = namespacedKey.indexOf(':');

        const lspnamespace = namespacedKey.substring(0, colonIdx);
        const lspkey = namespacedKey.substring(colonIdx + 1, namespacedKey.length);

        if (namespace === lspnamespace) namespaceExists = true;

        namespacesSet.add(lspnamespace);

        return {
          namespace: lspnamespace,
          key: lspkey
        }
      }).filter(namespacedKey => {
        if (namespaceExists) {
          return namespacedKey.namespace === namespace;
        } else {
          // Let everything through
          return true;
        }
      });

    ////////////////////
    // Filter terms ? //
    ////////////////////

    const namespaceList = Array.from(namespacesSet).sort();

    // If the query starts with `s` and we have multiple terms that start
    // with `s` then those terms should be on the top.

    const escapedQuery = escapeRegExp(query);

    allTerms.sort((a, b) => a.key.localeCompare(b.key));

    if (escapedQuery.length === 0) {
      const returnObject = {
        terms: allTerms,
        namespaceExists,
        namespaces: namespaceList,
      };

      return returnObject;
    }

    const startsWithRegex = new RegExp(`^${escapedQuery}.*`);
    const notStartsHasRegex = new RegExp(`.+${escapedQuery}.*`);
    const hasRegex = new RegExp(`.*${escapedQuery}.*`);

    // Terms that we encounter we "mark" them so that if they're encounted again
    // they are ignored.
    const markedTerms = new Set<string>();

    // TODO: does this result in duplicate results?

    // Terms which start with the query string
    const termsStartingWithQuery = allTerms.filter(namespacedKey => {
      const fullkey = `${namespacedKey.namespace}:${namespacedKey.key}`

      if (markedTerms.has(fullkey)) return false;

      if (namespacedKey.key.match(startsWithRegex) !== null) {
        markedTerms.add(fullkey);
        return true;
      }

      return false;
    }).sort((a, b) => a.key.length - b.key.length);

    // Later, we want to sort terms by similarity.

    const termsWithMatchingTerms = allTerms.filter(namespacedKey => {
      const fullkey = `${namespacedKey.namespace}:${namespacedKey.key}`

      if (markedTerms.has(fullkey)) return false;

      if (namespacedKey.key.match(notStartsHasRegex) !== null) {
        markedTerms.add(fullkey);
        return true;
      }

      return false;
    }).sort((a, b) => a.key.length - b.key.length);

    const termsWithMatchingDescription = allTerms.filter(namespacedKey => {
      const fullkey = `${namespacedKey.namespace}:${namespacedKey.key}`

      if (markedTerms.has(fullkey)) return false;

      const { key, namespace } = namespacedKey;
      const v = this.legacy_get(key, namespace);

      if (typeof v !== 'undefined' && v.match(hasRegex) !== null) {
        markedTerms.add(fullkey);
        return true;
      }

      return false;
    })

    let termsAdditionalInFullsearch: { namespace: string, key: string }[] = [];

    if (isFullsearch) {
      termsAdditionalInFullsearch = allTerms.filter(namespacedKey => {

        const fullkey = `${namespacedKey.namespace}:${namespacedKey.key}`

        if (markedTerms.has(fullkey)) return false;
        if (namespacedKey.namespace.startsWith(query)) {
          markedTerms.add(fullkey);
          return true;
        }

        return false;
      });
    }

    // TODO: this is probably slow...

    // TODO: am I duplicating terms here?

    const returnObject = {
      terms: [
        ...termsStartingWithQuery,
        ...termsWithMatchingTerms,
        ...termsWithMatchingDescription,
        ...termsAdditionalInFullsearch,
      ],
      namespaceExists,
      namespaces: namespaceList,
    };

    return returnObject;
  }

  /**
   * Removes JSON value from local storage with key `key` and namespace
   * `namespace`.
   * 
   * @param key 
   * @param namespace 
   */
  public legacy_remove(term: string, namespace: string) {
    if (!this.hasDictionary(namespace)) return;
    const dictionary = this.dictionaries.get(namespace);
    assert(typeof dictionary !== "undefined");
    dictionary.remove(term);
  }

  /**
   * Sets JSON value in local storage with key `key` and namespace `namespace`.
   * 
   * @param key 
   * @param value 
   * @param namespace 
   */
  public legacy_set(key: string, value: string, namespace: string) {
    const dictionary = this.dictionaries.get(namespace);

    if (!dictionary) {
      // Create a new dictionary
      this.createDictionary(namespace);

      // Set value
      this.legacy_set(key, value, namespace);
    } else {
      // Set value
      dictionary.set(key, value);
    }
  }

  /**
   * Fetches JSON value from local storage with key `key` and namespace
   * `namespace`.
   * 
   * @param key 
   * @param namespace 
   */
  public legacy_get(key: string, namespace: string) {
    const dictionary = this.dictionaries.get(namespace);

    if (!dictionary) return;

    return dictionary.get(key);
  }

  /**
   * Export dictionars to JSOn.
   */
  public legacy_doExport() {
    const LOCAL_STORAGE_NAMESPACE = this.localStorageNamespace;

    const lsprefix = `${LOCAL_STORAGE_NAMESPACE}:`;

    const dictionaries: { [key: string]: ExportTerm[] } = {};

    Object.keys(localStorage).filter(lskey => lskey.startsWith(lsprefix)).forEach(lskey => {
      const namespacedKey = lskey.substr(lsprefix.length);

      const colonIdx = namespacedKey.indexOf(':');

      const namespace = namespacedKey.substring(0, colonIdx);
      const key = namespacedKey.substring(colonIdx + 1, namespacedKey.length);

      const value = this.legacy_get(key, namespace);

      const term = key;
      const description = value;

      assert(typeof description !== "undefined");

      if (!dictionaries.hasOwnProperty(namespace)) {
        dictionaries[namespace] = [];
      }

      const exportTerm: ExportTerm = { term, description };

      dictionaries[namespace].push(exportTerm);
    });

    const exportObject: ExportObject = {
      dictionaries: []
    };

    Object.keys(dictionaries).forEach((namespace) => {
      const terms = dictionaries[namespace];
      const subdictionary: ExportSubdictionary = {
        namespace,
        terms,
      }
      exportObject.dictionaries.push(subdictionary);
    });

    return exportObject as ExportObject;
  }

  /**
   * Imports dictionaries from JSON.
   * 
   * @param importObject 
   */
  public legacy_doImport(importObject: ImportObject) {
    if (importObject.hasOwnProperty('dictionaries')) {
      const obj = importObject as ExportObject;
      const { dictionaries } = obj;

      dictionaries.forEach((dictionary) => {
        const { namespace, terms } = dictionary;

        terms.forEach((termObject) => {
          const { term, description } = termObject;

          const key = term;
          const value = description;

          // WHY IS THIS UNDEFINED?
          this.legacy_set(key, value, namespace);
        });
      });
    } else {
      const obj = importObject as Legacy1ExportObject;

      const { terms } = obj;
      const namespace = DEFAULT_NAMESPACE;

      terms.forEach((termObject) => {
        const { term, description } = termObject;

        const key = term;
        const value = description;

        this.legacy_set(key, value, namespace);
      });
    }
  }

  /**
   * Returns a set of all the available namespaces.
   */
  public legacy_getAllNamespaces() {
    const namespacesSet = new Set<string>();

    for (const [dictionaryNamespace, _] of this.dictionaries.entries()) {
      namespacesSet.add(dictionaryNamespace);
    }

    return namespacesSet;
  }

}
