import departments from '../../data/departments';

class SearchDepartment {
  search (str: string): string[] {
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
  private _data: any;
  private searchDep = new SearchDepartment()
  constructor (data: any) {
    this._data = data;
  }

  search (str: string): string[] {
    return this.searchDep.search(str);
  }
}

export default SearchEngine;
