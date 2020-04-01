export interface ExportTerm {
  term: string;
  description: string;
}

export interface Legacy1ExportObject {
  terms: ExportTerm[];
}

export interface ExportSubdictionary {
  namespace: string;
  terms: ExportTerm[];
}

export interface ExportObject {
  dictionaries: ExportSubdictionary[];
}

export type ImportObject = ExportObject | Legacy1ExportObject;
