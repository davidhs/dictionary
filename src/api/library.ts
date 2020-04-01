import Dictionary from "./dictionary";
import { ExportTerm, ExportObject, ExportSubdictionary, Legacy1ExportObject, ImportObject } from "./types";

/**
 * A function to escape characters in a string so they won't be treated as
 * meta-characters in the construction of a regular expresion.
 * 
 * @param string 
 */
function escapeRegExp(string: string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

  public hasDictionary(namespace: string): boolean {
    return this.dictionaries.has(namespace);
  }

  /**
   * Returns `true` if dictionary was successfully removed.
   * 
   * @param namespace 
   */
  public removeDictionary(namespace: string): boolean {
    const dictionary = this.dictionaries.get(namespace);

    if (dictionary) {
      dictionary.clear();
      return this.dictionaries.delete(namespace);
    }

    return false;
  }

  public removeEverything(confirmation = false) {
    if (!confirmation) {
      return;
    }


  }

  /**
   * Implementation of a legacy function.
   * 
   * @deprecated
   * 
   * @param paramQuery 
   * @param paramNamespace 
   */
  public legacy_searchTermsAndDescriptions(paramQuery: string, paramNamespace: string) {
    const LOCAL_STORAGE_NAMESPACE = this.localStorageNamespace;

    const get = this.legacy_get;

    const namespace = paramNamespace.trim().toLowerCase();
    const isFullsearch = namespace === '*';
    const query = paramQuery.trim().toLowerCase();
    const lsprefix = `${LOCAL_STORAGE_NAMESPACE}:`;
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
  
    if (escapedQuery.length === 0) {
      const returnObject = {
        terms: allTerms.sort(),
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
  
    // Terms which start with the query string
    const termsStartingWithQuery = allTerms.filter(namespacedKey => {
      const fullkey = `${namespacedKey.namespace}:${namespacedKey.key}`
  
      if (markedTerms.has(fullkey)) {
        return false;
      }
  
      if (namespacedKey.key.match(startsWithRegex) !== null) {
        markedTerms.add(fullkey);
        return true;
      }
  
      return false;
    }).sort((a, b) => {
      return a.key.length - b.key.length;
    });
  
    // Later, we want to sort terms by similarity.
  
    const termsWithMatchingTerms = allTerms.filter(namespacedKey => {
      const fullkey = `${namespacedKey.namespace}:${namespacedKey.key}`
  
      if (markedTerms.has(fullkey)) {
        return false;
      }
  
      if (namespacedKey.key.match(notStartsHasRegex) !== null) {
        markedTerms.add(fullkey);
        return true;
      }
  
      return false;
    }).sort((a, b) => {
      return a.key.length - b.key.length;
    });
  
    const termsWithMatchingDescription = allTerms.filter(namespacedKey => {
      const fullkey = `${namespacedKey.namespace}:${namespacedKey.key}`
  
      if (markedTerms.has(fullkey)) {
        return false;
      }
  
      const { key, namespace } = namespacedKey;
      const v = get(key, namespace);
  
      if (typeof v !== 'undefined' && v.match(hasRegex) !== null) {
        markedTerms.add(fullkey);
        return true;
      }
  
      return false;
    }).sort();
  
    let termsAdditionalInFullsearch: { namespace: string, key: string }[] = [];
  
    if (isFullsearch) {
      termsAdditionalInFullsearch = allTerms.filter(namespacedKey => {
  
        const fullkey = `${namespacedKey.namespace}:${namespacedKey.key}`
  
        if (markedTerms.has(fullkey)) {
          return false;
        }
  
        if (namespacedKey.namespace.startsWith(query)) {
          markedTerms.add(fullkey);
          return true;
        }
  
        return false;
      });
    }
  
    // TODO: this is probably slow...
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

  public legacy_remove(key: string, namespace: string) {
    const LOCAL_STORAGE_NAMESPACE = this.localStorageNamespace;

    const lskey = `${LOCAL_STORAGE_NAMESPACE}:${namespace}:${key}`;

    localStorage.removeItem(lskey);
  }

  public legacy_set(key: string, value: any, namespace: string) {
    const LOCAL_STORAGE_NAMESPACE = this.localStorageNamespace;

    namespace = namespace.toLowerCase().trim();

    if (namespace.length === 0) {
      namespace = 'default';
    }
  
    const lskey = `${LOCAL_STORAGE_NAMESPACE}:${namespace}:${key}`;
    const lsvalue = JSON.stringify({ value });
  
    localStorage.setItem(lskey, lsvalue);
  }

  public legacy_get(key: string, namespace: string) {
    const LOCAL_STORAGE_NAMESPACE = this.localStorageNamespace;

    const transformedKey = key.trim().toLowerCase();
    const lskey = `${LOCAL_STORAGE_NAMESPACE}:${namespace}:${transformedKey}`;
    const rawItem = localStorage.getItem(lskey);
  
    if (rawItem === null) {
      return undefined;
    } else {
      return JSON.parse(rawItem).value;
    }
  }

  public legacy_doExport() {
    const LOCAL_STORAGE_NAMESPACE = this.localStorageNamespace;
    const get = this.legacy_get;

    const lsprefix = `${LOCAL_STORAGE_NAMESPACE}:`;

    const dictionaries: { [key: string]: ExportTerm[] } = {};
  
    Object.keys(localStorage).filter(lskey => lskey.startsWith(lsprefix)).forEach(lskey => {
      const namespacedKey = lskey.substr(lsprefix.length);
  
      const colonIdx = namespacedKey.indexOf(':');
  
      const namespace = namespacedKey.substring(0, colonIdx);
      const key = namespacedKey.substring(colonIdx + 1, namespacedKey.length);
  
      const value = get(key, namespace);
  
      const term = key;
      const description = value;
  
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

  public legacy_doImport(importObject: ImportObject) {
    const set = this.legacy_set;

    console.info('Import object:', importObject);

    if (importObject.hasOwnProperty('dictionaries')) {
      const obj = importObject as ExportObject;
  
      const { dictionaries } = obj;
  
      console.info('Dictionaries:', dictionaries);
  
      dictionaries.forEach((dictionary) => {
  
        console.info('dictionary: ', dictionary);
  
        const { namespace, terms } = dictionary;
  
        terms.forEach((termObject) => {
          const { term, description } = termObject;
  
          const key = term;
          const value = description;
  
          set(key, value, namespace);
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
  
        set(key, value, namespace);
      });
    }
  }

  public legacy_doesNamespaceExist(namespace: string) {
    const getAllNamespaces = this.legacy_getAllNamespaces;

    const allNamespaces = getAllNamespaces();

    return allNamespaces.has(namespace);
  }

  public legacy_getAllNamespaces() {
    const LOCAL_STORAGE_NAMESPACE = this.localStorageNamespace;

    const lsprefix = `${LOCAL_STORAGE_NAMESPACE}:`;

    const namespacesSet = new Set<string>();
  
    Object.keys(localStorage)
      .filter(lskey => lskey.startsWith(lsprefix))
      .forEach(lskey => {
        const namespacedKey = lskey.substr(lsprefix.length);
        const colonIdx = namespacedKey.indexOf(':');
        const namespace = namespacedKey.substring(0, colonIdx);
        namespacesSet.add(namespace);
      });
  
    return namespacesSet;
  }

  public legacy_clear() {
    const LOCAL_STORAGE_NAMESPACE = this.localStorageNamespace;

    const prefix = `${LOCAL_STORAGE_NAMESPACE}`;
    Object.keys(localStorage).filter(x => x.startsWith(prefix)).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
