


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


  const escapedQuery = escapeRegExp(query.trim());


  const regexString = `.*${escapedQuery}.*`;

  const regex = new RegExp(regexString);

  const keys = Object.keys(localStorage).filter(x => x.startsWith(prefix)).map(x => x.substr(prefix.length));

  const rks = new Set<string>();

  keys.forEach((key) => {
    if (key.match(regex) !== null) {
      rks.add(key);
    }
  });

  keys.forEach((key) => {
    const v = get(key);

    if (typeof v !== 'undefined' && v.match(regex) !== null) {
      rks.add(key);
    }
  });

  const rk: string[] = [];

  rks.forEach(key => rk.push(key));

  return rk.sort();
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

  const lskey = `${NAMESPACE}:${key}`;

  const rawItem = localStorage.getItem(lskey);
  if (rawItem === null) {
    return undefined;
  } else {
    return JSON.parse(rawItem).value;
  }
}

export function doExport() {
  console.info('Exporting...');

  
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
  console.info('Importing...');
  console.info(exportObject);

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
