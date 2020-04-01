// TODO: put the dictionary into memory, and keep a copy in local storage.


const LOCAL_STORAGE_NAMESPACE = 'tu8rbgh8';

// const ALL_PREFIX = `${LOCAL_STORAGE_NAMESPACE}::`;

const DEFAULT_NAMESPACE = 'default';


interface ExportTerm {
  term: string;
  description: string;
}

interface Legacy1ExportObject {
  terms: ExportTerm[];
}

interface ExportSubdictionary {
  namespace: string;
  terms: ExportTerm[];
}

interface ExportObject {
  dictionaries: ExportSubdictionary[];
}


type ImportObject = ExportObject | Legacy1ExportObject;


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

/**
 * Search termsn and descriptions
 * 
 * @param paramQuery 
 * @param paramNamespace 
 */
export function searchTermsAndDescriptions(paramQuery: string, paramNamespace: string) {
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

/**
 * Removes JSON value from local storage with key `key` and namespace
 * `namespace`.
 * 
 * @param key 
 * @param namespace 
 */
export function remove(key: string, namespace: string) {
  const lskey = `${LOCAL_STORAGE_NAMESPACE}:${namespace}:${key}`;
  localStorage.removeItem(lskey);
}

/**
 * Sets JSON value in local storage with key `key` and namespace `namespace`.
 * 
 * @param key 
 * @param value 
 * @param namespace 
 */
export function set(key: string, value: any, namespace: string) {
  namespace = namespace.toLowerCase().trim();

  if (namespace.length === 0) {
    namespace = 'default';
  }

  const lskey = `${LOCAL_STORAGE_NAMESPACE}:${namespace}:${key}`;
  const lsvalue = JSON.stringify({ value });

  localStorage.setItem(lskey, lsvalue);
}

/**
 * Fetches JSON value from local storage with key `key` and namespace
 * `namespace`.
 * 
 * @param key 
 * @param namespace 
 */
export function get(key: string, namespace: string) {
  const transformedKey = key.trim().toLowerCase();
  const lskey = `${LOCAL_STORAGE_NAMESPACE}:${namespace}:${transformedKey}`;
  const rawItem = localStorage.getItem(lskey);

  if (rawItem === null) {
    return undefined;
  } else {
    return JSON.parse(rawItem).value;
  }
}

/**
 * Export dictionars to JSOn.
 */
export function doExport() {
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

/**
 * Imports dictionaries from JSON.
 * 
 * @param importObject 
 */
export function doImport(importObject: ImportObject) {
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

/**
 * Checkes whether a given namespace exists.
 * 
 * @param namespace 
 */
export function doesNamespaceExist(namespace: string) {
  const allNamespaces = getAllNamespaces();

  return allNamespaces.has(namespace);
}

/**
 * Returns a set of all the available namespaces.
 */
export function getAllNamespaces() {
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

/**
 * Removes all entries in the local storage whose key (a string) starts with
 * the value in `LOCAL_STORAGE_NAMESPACE`, i.e. removes all entries from the
 * local storage that are related to this application.
 */
export function clear() {
  const prefix = `${LOCAL_STORAGE_NAMESPACE}`;
  Object.keys(localStorage).filter(x => x.startsWith(prefix)).forEach((key) => {
    localStorage.removeItem(key);
  });
}

export default {
  set,
  get,
  remove,
  searchTermsAndDescriptions,
  doExport,
  doImport,
  clear,
  doesNamespaceExist,
  getAllNamespaces,
};
