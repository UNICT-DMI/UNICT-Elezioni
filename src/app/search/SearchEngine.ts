import { datareader } from '../../data/DataReader';
import fixName from '../utils/FixName';

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

class SearchEngine {
  isValid(fullName: string, keywords: string): boolean {
    fullName = fixName(fullName).toUpperCase();
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

  searchEntity(str: string): EntityInfo[] {
    let resEntities: EntityInfo[] = [];
    const years = datareader.getYears();
    for (const year of years) {
      const entities = datareader.getEntities(year);
      for (const entity of entities) {
        const subEntities: EntityInfo[] = datareader.getSubEntities(year, entity)
          .filter((subEntity: string): boolean => this.isValid(subEntity, str))
          .map((subEntity: string): EntityInfo => {
            return {
              name: subEntity,
              path: entity + '/' + subEntity,
              years: year
            };
          });
        resEntities = [...resEntities, ...subEntities];
      }
    }
    return resEntities;
  }

  searchList(str: string): ListInfo[] {
    let resLists: ListInfo[] = [];
    const years = datareader.getYears();
    for (const year of years) {
      const entities = datareader.getEntities(year);
      for (const entity of entities) {
        const subEntities = datareader.getSubEntities(year, entity);
        for (const subEntity of subEntities) {
          let lists = datareader.getLists(year, entity, subEntity);
          if (!lists) {
            continue;
          }
          lists = lists.filter((list: any): boolean => {
            return this.isValid(list.nome, str);
          });
          const listsInfo: ListInfo[] = lists.map((list: any): ListInfo => {
            return {
              name: list.nome,
              year: year,
              entity: entity,
              subEntity: subEntity,
              path: entity + '/' + subEntity
            };
          });
          resLists = [...resLists, ...listsInfo];
        }
      }
    }
    return resLists;
  }

  searchCandidate(str: string): CandidateInfo[] {
    let resCandidates: CandidateInfo[] = [];
    const years = datareader.getYears();
    for (const year of years) {
      const entities = datareader.getEntities(year);
      for (const entity of entities) {
        const subEntities = datareader.getSubEntities(year, entity);
        for (const subEntity of subEntities) {
          const candidates: any = datareader.getAllCandidates(year, entity, subEntity);
          const lists = Object.keys(candidates);
          for (const list of lists) {
            if (!candidates[list]) {
              continue;
            }
            const candidatesInfo: CandidateInfo[] = candidates[list]
              .filter((candidate: any): boolean => this.isValid(candidate.nominativo ? candidate.nominativo : candidate.nome_candidato, str))
              .map((candidate: any): CandidateInfo => {
                let path: string = entity + '/' + subEntity;
                if (list === 'UNINOMINAL' && !subEntity.includes('medicina')) {
                  path = 'single-results/' + entity + '/' + year + '/' + subEntity;
                }
                return {
                  name: candidate.nominativo ? candidate.nominativo : candidate.nome_candidato,
                  listName: list,
                  year: year,
                  path: path,
                  entity: subEntity
                };
              });
            resCandidates = [...resCandidates, ...candidatesInfo];
          }
        }
      }
    }
    return resCandidates;
  }

  search(str: string): SearchResult {
    return {
      entities: this.searchEntity(str),
      lists: this.searchList(str),
      candidates: this.searchCandidate(str)
    };
  }
}

export const searchEngine: SearchEngine = new SearchEngine();
