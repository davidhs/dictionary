


const NAMESPACE = 'fish';


interface ExportTerm {
  term: string;
  description: string;
}

interface ExportObject {
  terms: ExportTerm[];
}


function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


export function searchTerms(query: string) {
  const prefix = `${NAMESPACE}:`;


  const escapedQuery = escapeRegExp(query.trim());


  const regexString = `.*${escapedQuery}.*`;

  const regex = new RegExp(regexString);

  const keys = Object.keys(localStorage).filter(x => x.startsWith(prefix)).map(x => x.substr(prefix.length)).filter(x => x.match(regex) !== null).sort();

  return keys;
}



export function searchTermsAndDescriptions(query: string) {
  const prefix = `${NAMESPACE}:`;

  // If the query starts with `s` and we have multiple terms that start
  // with `s` then those terms should be on the top.

  const escapedQuery = escapeRegExp(query.trim().toLowerCase());

  // All terms under consideration (i.e. belong to the corrent namespace)
  const allTerms = Object.keys(localStorage).filter(x => x.startsWith(prefix)).map(x => x.substr(prefix.length));

  if (escapedQuery.length === 0) {
    return allTerms.sort();
  }

  const startsWithRegex = new RegExp(`^${escapedQuery}.*`);
  const notStartsHasRegex = new RegExp(`.+${escapedQuery}.*`);
  const hasRegex = new RegExp(`.*${escapedQuery}.*`);



  // Terms that we encounter we "mark" them so that if they're encounted again
  // they are ignored.
  const markedTerms = new Set<string>();

  // Terms which start with the query string
  const termsStartingWithQuery = allTerms.filter(term => {
    if (markedTerms.has(term)) {
      return false;
    }

    if (term.match(startsWithRegex) !== null) {
      markedTerms.add(term);
      return true;
    }

    return false;
  }).sort((a, b) => {
    return a.length - b.length;
  });

  // Later, we want to sort terms by similarity.

  const termsWithMatchingTerms = allTerms.filter(term => {
    if (markedTerms.has(term)) {
      return false;
    }

    if (term.match(notStartsHasRegex) !== null) {
      markedTerms.add(term);
      return true;
    } 
    return false;
  }).sort((a, b) => {
    return a.length - b.length;
  });

  const termsWithMatchingDescription = allTerms.filter(term => {

    if (markedTerms.has(term)) {
      return false;
    }

    const v = get(term);

    if (typeof v !== 'undefined' && v.match(hasRegex) !== null) {
      markedTerms.add(term);
      return true;
    }
    return false;
  }).sort();

  const termsResult = [
    ...termsStartingWithQuery,
    ...termsWithMatchingTerms,
    ...termsWithMatchingDescription,
  ];

  return termsResult;
}

export function remove(key: string) {
  const lskey = `${NAMESPACE}:${key}`;
  localStorage.removeItem(lskey);
}

export function set(key: string, value: any) {
  const lskey = `${NAMESPACE}:${key}`;
  const lsvalue = JSON.stringify({ value });

  localStorage.setItem(lskey, lsvalue);
}

export function get(key: string) {

  const transformedKey = key.trim().toLowerCase();

  const lskey = `${NAMESPACE}:${transformedKey}`;

  const rawItem = localStorage.getItem(lskey);
  if (rawItem === null) {
    return undefined;
  } else {
    return JSON.parse(rawItem).value;
  }
}

export function doExport() {
  const prefix = `${NAMESPACE}:`;


  const terms = Object.keys(localStorage).filter(x => x.startsWith(prefix)).map(x => {

    const key = x.substr(prefix.length);
    const value = get(key);

    const term = key;
    const description = value;

    const exportTerm: ExportTerm = { term, description };
    
    return exportTerm;
  });

  const exportObject: ExportObject = {
    terms
  };

  return exportObject;
}

export function doImport(exportObject: ExportObject) {
  exportObject.terms.forEach((exportTerm) => {
    
    // Replace or merge?

    const { term, description } = exportTerm;

    const key = term;
    const value = description;

    set(key, value);
  });

  return {};
}

export function clear() {
  const prefix = `${NAMESPACE}:`;
  Object.keys(localStorage).filter(x => x.startsWith(prefix)).forEach((key) => {
    localStorage.removeItem(key);
  });
}

export default {
  set,
  get,
  remove,
  searchTerms,
  searchTermsAndDescriptions,
  doExport,
  doImport,
  clear,
};
