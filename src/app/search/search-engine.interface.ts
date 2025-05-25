export interface ListInfo {
  name: string;
  year: string;
  entity: string;
  subEntity: string;
  path: string;
}

export interface CandidateInfo {
  name: string;
  year: string;
  listName: string;
  entity: string;
  path: string;
}

export interface CdlInfo {
  name: string;
  year: string;
  isUnder500: boolean;
}

export interface EntityInfo {
  name: string;
  path: string;
  years: string;
}

export interface SearchResult {
  entities: EntityInfo[];
  lists: ListInfo[];
  candidates: CandidateInfo[];
}
