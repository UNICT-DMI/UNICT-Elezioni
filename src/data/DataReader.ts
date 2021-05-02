class DataReader {
  private static instance: DataReader;
  private data: any = [];

  constructor() {
    this.loadData();
  }

  static getInstance(): DataReader {
    if (!DataReader.instance) {
      DataReader.instance = new DataReader();
    }
    return DataReader.instance;
  }

  private _insert(currentPath: string[], currentNode: any, dataNode: any): void {
    const path = currentPath[0];
    if (path === undefined) {
      return;
    }
    if (currentNode[path] === undefined) {
      currentNode[path] = [];
    }
    if (currentPath.length === 1) {
      currentNode[path] = dataNode;
    }
    this._insert(currentPath.slice(1, currentPath.length), currentNode[path], dataNode);
  }

  insert(pathStr: string, dataNode: any): void {
    const path = pathStr.split('/');
    this._insert(path, this.data, dataNode);
  }

  loadData(): void {
    const context = require.context('./', true, / *.json$/);
    context.keys().forEach((key: string) => {
      const fileName = key.replace('./', '');
      const resource = require(`./${fileName}`);
      const namespace = fileName.replace('.json', '');
      this.insert(namespace, JSON.parse(JSON.stringify(resource)));
    });
    // console.log(this.getCandidates('2018-2020', 'dipartimenti', 'Matematica_e_informatica', 'DMI INSIDER'));
  }

  getYears(): string[] {
    return Object.keys(this.data);
  }

  getEntities(years: string): string[] {
    return Object.keys(this.data[years]);
  }

  getDepartments(years: string): string[] {
    return Object.keys(this.data[years].dipartimenti);
  }

  getDegreeCourse(years: string): string[] {
    return Object.keys(this.data[years].cdl);
  }

  getDegreeCourseUnder500(years: string): string[] {
    return Object.keys(this.data[years].cdl);
  }

  getPhD(years: string): string[] {
    return Object.keys(this.data[years].dottorandi);
  }

  getHigherPolitics(years: string): string[] {
    return Object.keys(this.data[years]['organi superiori']);
  }

  // generic method for all entities
  getEntity(years: string, entity: string): string[] {
    return Object.keys(this.data[years][entity]);
  }

  // ('2018-2020', 'dipartimenti', 'Matematica e Informatica')
  getLists(years: string, entity: string, subEntity: string): any {
    return this.data[years][entity][subEntity].liste;
  }

  getCandidates(years: string, entity: string, subEntity: string, list: string): any {
    let elected: any[] = (this.data[years][entity][subEntity].eletti as []).filter((candidate: any): boolean => { return (candidate.lista === list); });
    elected = elected.map((candidate: any): any => {
      candidate.eletto = true;
      return candidate;
    });
    let notElected: any[] = (this.data[years][entity][subEntity].non_eletti as []).filter((candidate: any): boolean => { return (candidate.lista === list); });
    notElected = notElected.map((candidate: any): any => {
      candidate.eletto = false;
      return candidate;
    });

    return [...elected, ...notElected];
  }
}

export const datareader: DataReader = DataReader.getInstance();
