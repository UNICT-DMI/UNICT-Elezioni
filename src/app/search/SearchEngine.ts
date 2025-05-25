import { datareader } from '../../data/DataReader';
import fixName from '../utils/FixName';
import { EntityInfo, SearchResult } from './search-engine.interface';
import { ListInfo, CandidateInfo } from './SearchInfo';

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
        const subEntities: EntityInfo[] = datareader
          .getSubEntities(year, entity)
          .filter((subEntity: string): boolean => this.isValid(subEntity, str))
          .map(
            (subEntity: string): EntityInfo => ({
              name: subEntity,
              path:
                entity === 'organi superiori'
                  ? subEntity
                  : 'single/' + entity + '/' + subEntity,
              years: year,
            }),
          );

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

          lists = lists.filter((list: any): boolean =>
            this.isValid(list.nome, str),
          );

          const listsInfo: ListInfo[] = lists.map(
            (list: any): ListInfo => ({
              name: list.nome,
              year,
              entity,
              subEntity,
              path:
                entity === 'organi superiori'
                  ? subEntity
                  : 'single/' + entity + '/' + subEntity,
            }),
          );

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
          const candidates: any = datareader.getAllCandidates(
            year,
            entity,
            subEntity,
          );
          const lists = Object.keys(candidates);
          for (const list of lists) {
            if (!candidates[list]) {
              continue;
            }
            const candidatesInfo: CandidateInfo[] = candidates[list]
              .filter((candidate: any): boolean =>
                this.isValid(
                  candidate.nominativo
                    ? candidate.nominativo
                    : candidate.nome_candidato,
                  str,
                ),
              )
              .map((candidate: any): CandidateInfo => {
                return {
                  name: candidate.nominativo
                    ? candidate.nominativo
                    : candidate.nome_candidato,
                  listName: list,
                  year: year,
                  path:
                    entity === 'organi superiori'
                      ? subEntity
                      : 'single/' + entity + '/' + subEntity,
                  entity: subEntity,
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
      candidates: this.searchCandidate(str),
    };
  }
}

export const searchEngine: SearchEngine = new SearchEngine();
