import departments from '../../data/departments';
import cdls from '../../data/cdl';
import cdl500 from '../../data/cdl-500';
import dottorandi from '../../data/dottorandi';
import { entities, entitiesPath } from '../../data/entities';
import years from '../../data/years';
import ersuYears from '../../data/ersu-years';
import SearchLimits from './SearchLimits';
import { CandidateInfo, CdlInfo, ListInfo } from './SearchInfo';

interface SearchResult {
  departments: string[];
  cdls: CdlInfo[];
  lists: ListInfo[];
  candidates: CandidateInfo[];
}

/*
  Need refactoring and doing it on backend
  There is so much code here...
*/
class SearchCandidate {
  isNameValid(fullName: string, keywords: string): boolean {
    fullName = fullName.toUpperCase();
    keywords = keywords.toUpperCase();
    const fullNameParts = fullName.split(' ');
    const keywordsParts = keywords.split(' ');
    for (const word of keywordsParts) {
      let isPresent = false;
      for (const namePart of fullNameParts) {
        if (namePart.startsWith(word)) {
          isPresent = true;
        }
      }
      if (!isPresent) {
        return false;
      }
    }
    return true;
  }

  searchOther(str: string, data: any, limits: SearchLimits): CandidateInfo[] {
    const results: CandidateInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const entity of entities) {
        const electedList = (data[year][entity].eletti as any[]).concat(data[year][entity].non_eletti);
        for (const candidate of electedList) {
          if (limits.isFull()) {
            return results;
          }
          if (this.isNameValid(candidate.nominativo, str)) {
            results.push({
              name: candidate.nominativo,
              listName: candidate.lista,
              year: year,
              entity: entity,
              path: entitiesPath[entity]
            });
            limits.increaseResults();
          }
        }
      }
    }
    return results;
  }

  searchListDep(str: string, data: any, limits: SearchLimits): CandidateInfo[] {
    const results: CandidateInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const dep of departments) {
        const electedList = (data[year].departments[dep].eletti as any[]).concat(data[year].departments[dep].non_eletti);
        for (const candidate of electedList) {
          if (limits.isFull()) {
            return results;
          }
          if (this.isNameValid(candidate.nominativo, str)) {
            results.push({
              name: candidate.nominativo,
              listName: candidate.lista,
              year: year,
              department: dep,
              path: '#/dipartimento/' + dep
            });
            limits.increaseResults();
          }
        }
      }
    }
    return results;
  }

  searchListCdl(str: string, data: any, limits: SearchLimits): CandidateInfo[] {
    const results: CandidateInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const cdl of (cdls as any)[year]) {
        const electedList = (data[year].cdl[cdl].eletti as any[]).concat(data[year].cdl[cdl].non_eletti);
        for (const candidate of electedList) {
          if (limits.isFull()) {
            return results;
          }
          if (this.isNameValid(candidate.nominativo, str)) {
            results.push({
              name: candidate.nominativo,
              listName: candidate.lista,
              year: year,
              department: cdl,
              path: '#/cdl/' + cdl
            });
            limits.increaseResults();
          }
        }
      }
    }
    return results;
  }

  searchListCdl500(str: string, data: any, limits: SearchLimits): CandidateInfo[] {
    const results: CandidateInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const cdl of (cdl500 as any)[year]) {
        const electedList = (data[year].cdl500[cdl].eletti as any[]).concat(data[year].cdl500[cdl].non_eletti);
        for (const candidate of electedList) {
          if (limits.isFull()) {
            return results;
          }
          if (this.isNameValid(candidate.nome_candidato, str)) {
            results.push({
              name: candidate.nome_candidato,
              listName: candidate.lista,
              year: year,
              department: cdl,
              path: '#/single-results/cdl-500/' + year + '/' + cdl
            });
            limits.increaseResults();
          }
        }
      }
    }
    return results;
  }

  searchListPhD(str: string, data: any, limits: SearchLimits): CandidateInfo[] {
    const results: CandidateInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const phdDep of (dottorandi as any)[year]) {
        const electedList = (data[year].phdDep[phdDep].eletti as any[]).concat(data[year].phdDep[phdDep].non_eletti);
        for (const candidate of electedList) {
          if (limits.isFull()) {
            return results;
          }
          if (candidate.lista) {
            if (this.isNameValid(candidate.nominativo, str)) {
              results.push({
                name: candidate.nominativo,
                listName: candidate.lista,
                year: year,
                department: phdDep,
                path: '#/dipartimenti-dottorandi'
              });
              limits.increaseResults();
            }
          } else {
            if (this.isNameValid(candidate.nome_candidato, str)) {
              results.push({
                name: candidate.nome_candidato,
                listName: candidate.lista,
                year: year,
                department: phdDep,
                path: '#/single-results/dottorandi/' + year + '/' + phdDep
              });
              limits.increaseResults();
            }
          }
        }
      }
    }
    return results;
  }

  searchListMedicina(str: string, data: any, limits: SearchLimits): CandidateInfo[] {
    const results: CandidateInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      const electedList = (data[year].medicina.eletti as any[]).concat(data[year].medicina.non_eletti);
      for (const candidate of electedList) {
        if (limits.isFull()) {
          return results;
        }
        if (this.isNameValid(candidate.nominativo, str)) {
          results.push({
            name: candidate.nominativo,
            listName: candidate.lista,
            year: year,
            department: 'Coordinamento Facoltà di Medicina',
            path: '#/facolta_medicina'
          });
          limits.increaseResults();
        }
      }
    }
    return results;
  }

  searchListERSU(str: string, data: any, limits: SearchLimits): CandidateInfo[] {
    const results: CandidateInfo[] = [];
    str = str.toUpperCase();
    for (const year of ersuYears) {
      const electedList = (data[year].ersu.eletti as any[]).concat(data[year].ersu.non_eletti);
      for (const candidate of electedList) {
        if (limits.isFull()) {
          return results;
        }
        if (this.isNameValid(candidate.nominativo, str)) {
          results.push({
            name: candidate.nominativo,
            listName: candidate.lista,
            year: year,
            department: 'ERSU',
            path: '#/ersu'
          });
          limits.increaseResults();
        }
      }
    }
    return results;
  }

  search(str: string, data: any, limits: SearchLimits): CandidateInfo[] {
    return [
      ...this.searchListDep(str, data, limits),
      ...this.searchOther(str, data, limits),
      ...this.searchListCdl(str, data, limits),
      ...this.searchListCdl500(str, data, limits),
      ...this.searchListPhD(str, data, limits),
      ...this.searchListMedicina(str, data, limits),
      ...this.searchListERSU(str, data, limits)
    ];
  }
}

class SearchList {
  searchListDep(str: string, data: any, limits: SearchLimits): ListInfo[] {
    const results: ListInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const dep of departments) {
        const depData = data[year].departments[dep].liste;
        for (const list of depData) {
          if (limits.isFull()) {
            return results;
          }
          if (list.nome && (list.nome as string).toUpperCase().indexOf(str) !== -1) {
            results.push({
              name: list.nome,
              year: year,
              department: dep,
              path: '#/dipartimento/' + dep
            });
            limits.increaseResults();
          }
        }
      }
    }
    return results;
  }

  searchOther(str: string, data: any, limits: SearchLimits): ListInfo[] {
    const results: ListInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const entity of entities) {
        const lists = data[year][entity].liste;
        for (const list of lists) {
          if (limits.isFull()) {
            return results;
          }
          if (list.nome && (list.nome as string).toUpperCase().indexOf(str) !== -1) {
            results.push({
              name: list.nome,
              year: year,
              entity: entity,
              path: entitiesPath[entity]
            });
            limits.increaseResults();
          }
        }
      }
    }
    return results;
  }

  search(str: string, data: any, limits: SearchLimits): ListInfo[] {
    return [...this.searchListDep(str, data, limits), ...this.searchOther(str, data, limits)];
  }
}

class SearchDepartment {
  search(str: string, limits: SearchLimits): string[] {
    const results: string[] = [];
    str = str.replace(' ', '_').toUpperCase();
    for (const depart of departments) {
      if (limits.isFull()) {
        return results;
      }
      if (depart.toUpperCase().indexOf(str) !== -1) {
        results.push(depart);
        limits.increaseResults();
      }
    }
    return results;
  }
}

class SearchCdl {
  search(str: string, limits: SearchLimits): CdlInfo[] {
    const results: CdlInfo[] = [];
    str = str.replace(' ', '_').toUpperCase();
    for (const year of years) {
      for (const cdl of (cdls as any)[year]) {
        if (limits.isFull()) {
          return results;
        }
        if (cdl.toUpperCase().indexOf(str) !== -1) {
          results.push({
            name: cdl,
            year: year,
            isUnder500: false
          });
          limits.increaseResults();
        }
      }

      for (const cdl of (cdl500 as any)[year]) {
        if (limits.isFull()) {
          return results;
        }
        if (cdl.toUpperCase().indexOf(str) !== -1) {
          results.push({
            name: cdl,
            year: year,
            isUnder500: true
          });
          limits.increaseResults();
        }
      }
    }
    return results;
  }
}

class SearchEngine {
  private searchDep = new SearchDepartment();
  private searchList = new SearchList();
  private searchCandidate = new SearchCandidate();
  private searchCdl = new SearchCdl();
  private data: any;
  private static instance: SearchEngine;
  private limits = new SearchLimits();

  private constructor() {
    this.data = [];

    // Load all data
    for (const year of years) {
      this.data[year] = [];
      for (const entity of entities) {
        this.data[year][entity] = require(`../../data/${year}/${entity}.json`);
      }
      this.data[year].departments = [];
      for (const depart of departments) {
        this.data[year].departments[depart] = require(`../../data/${year}/dipartimenti/${depart}.json`);
      }
      this.data[year].cdl = [];
      for (const cdl of (cdls as any)[year]) {
        this.data[year].cdl[cdl] = require(`../../data/${year}/cdl/${cdl}.json`);
      }
      this.data[year].cdl500 = [];
      for (const cdl of (cdl500 as any)[year]) {
        this.data[year].cdl500[cdl] = require(`../../data/${year}/cdl-500/${cdl}.json`);
      }
      this.data[year].phdDep = [];
      for (const phdDep of (dottorandi as any)[year]) {
        this.data[year].phdDep[phdDep] = require(`../../data/${year}/dottorandi/${phdDep}.json`);
      }
      this.data[year].medicina = [];
      this.data[year].medicina = require(`../../data/${year}/Coordinamento_medicina.json`);
    }
    for (const year of ersuYears) {
      this.data[year] = [];
      this.data[year].ersu = [];
      this.data[year].ersu = require(`../../data/${year}/ERSU.json`);
    }
  }

  static getInstance(): SearchEngine {
    if (!SearchEngine.instance) {
      SearchEngine.instance = new SearchEngine();
    }
    return SearchEngine.instance;
  }

  search(str: string, limit?: number): SearchResult {
    this.limits.setLimit(limit);
    return {
      departments: this.searchDep.search(str, this.limits),
      lists: this.searchList.search(str, this.data, this.limits),
      candidates: this.searchCandidate.search(str, this.data, this.limits),
      cdls: this.searchCdl.search(str, this.limits)
    };
  }
}

export default SearchEngine;
