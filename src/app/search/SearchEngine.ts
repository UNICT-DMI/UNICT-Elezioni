import departments from '../../data/departments';
import entities, { entitiesPath } from '../../data/entities';
import years from '../../data/years';

export interface ListInfo {
  name: string;
  year: string;
  department?: string;
  entity?: string;
  path: string;
}

export interface CandidateInfo {
  name: string;
  year: string;
  listName: string;
  department?: string;
  entity?: string;
  path: string;
}

interface SearchResult {
  departments: string[];
  lists: ListInfo[];
  candidates: CandidateInfo[];
}

class SearchCandidate {
  search(str: string, data: any): CandidateInfo[] {
    const results: CandidateInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const dep of departments) {
        const electedList = (data[year].departments[dep].eletti as any[]).concat(data[year].departments[dep].non_eletti);
        for (const candidate of electedList) {
          if ((candidate.nominativo as string).toUpperCase().indexOf(str) !== -1) {
            results.push({
              name: candidate.nominativo,
              listName: candidate.nominativo,
              year: year,
              department: dep,
              path: '#/dipartimento/' + dep
            });
          }
        }
      }
    }
    return results;
  }
}

class SearchList {
  searchListDep(str: string, data: any): ListInfo[] {
    const results: ListInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const dep of departments) {
        const depData = data[year].departments[dep].liste;
        for (const list of depData) {
          if (list.nome && (list.nome as string).toUpperCase().indexOf(str) !== -1) {
            results.push({
              name: list.nome,
              year: year,
              department: dep,
              path: '#/dipartimento/' + dep
            });
          }
        }
      }
    }
    return results;
  }

  searchOther(str: string, data: any): ListInfo[] {
    const results: ListInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const entity of entities) {
        const lists = data[year][entity].liste;
        for (const list of lists) {
          if (list.nome && (list.nome as string).toUpperCase().indexOf(str) !== -1) {
            results.push({
              name: list.nome,
              year: year,
              entity: entity,
              path: entitiesPath[entity]
            });
          }
        }
      }
    }
    return results;
  }

  search(str: string, data: any): ListInfo[] {
    return [...this.searchListDep(str, data), ...this.searchOther(str, data)];
  }
}

class SearchDepartment {
  search(str: string): string[] {
    const results: string[] = [];
    str = str.replace(' ', '_').toUpperCase();
    for (const depart of departments) {
      if (depart.toUpperCase().indexOf(str) !== -1) {
        results.push(depart);
      }
    }
    return results;
  }
}

class SearchEngine {
  private searchDep = new SearchDepartment()
  private searchList = new SearchList()
  private searchCandidate = new SearchCandidate()

  private data: any;
  private static instance: SearchEngine;

  private constructor() {
    this.data = [];
    for (const year of years) {
      this.data[year] = [];
      for (const entity of entities) {
        this.data[year][entity] = require(`../../data/${year}/${entity}.json`);
      }
      this.data[year].departments = [];
      for (const depart of departments) {
        this.data[year].departments[depart] = require(`../../data/${year}/dipartimenti/${depart}.json`);
      }
    }
  }

  static getInstance(): SearchEngine {
    if (!SearchEngine.instance) {
      SearchEngine.instance = new SearchEngine();
    }
    return SearchEngine.instance;
  }

  search(str: string): SearchResult {
    return {
      departments: this.searchDep.search(str),
      lists: this.searchList.search(str, this.data),
      candidates: this.searchCandidate.search(str, this.data)
    };
  }
}

export default SearchEngine;
