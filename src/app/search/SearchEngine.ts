import departments from '../../data/departments';
import years from '../../data/years';

export interface ListInfo {
  name: string;
  year: string;
  department: string;
}

export interface SearchResult {
  departments: string[];
  lists: ListInfo[];
}

class SearchList {
  search(str: string): ListInfo[] {
    const results: ListInfo[] = [];
    str = str.toUpperCase();
    for (const year of years) {
      for (const dep of departments) {
        const depData = require(`../../data/${year}/dipartimenti/${dep}.json`);
        for (const list of depData.liste) {
          if (list.nome && (list.nome as string).toUpperCase().indexOf(str) !== -1) {
            results.push({
              name: list.nome,
              year: year,
              department: dep
            });
          }
        }
      }
    }
    return results;
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

  search(str: string): SearchResult {
    return {
      departments: this.searchDep.search(str),
      lists: this.searchList.search(str)
    };
  }
}

export default SearchEngine;
