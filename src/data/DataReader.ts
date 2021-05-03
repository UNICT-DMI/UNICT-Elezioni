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
    // console.log(this.getAllCandidates('2018-2020', 'dipartimenti', 'Matematica_e_informatica'));
  }

  getYears(): string[] {
    return Object.keys(this.data);
  }

  getEntities(years: string): string[] {
    return Object.keys(this.data[years]);
  }

  getDepartments(years: string): string[] {
    const departments = this.data[years].dipartimenti;
    return departments ? Object.keys(departments) : [];
  }

  getAllDepartments(): string[] {
    let depsPerYear: string[] = [];
    this.getYears().forEach((year: any) => {
      depsPerYear = depsPerYear.concat(this.getDepartments(year));
    });
    return [...new Set(depsPerYear)];
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
  getEntity(years: string, entity: string): string[] | null {
    if (this.data[years][entity]) {
      return Object.keys(this.data[years][entity]);
    }
    return null; // not found
  }

  getSubEntity(years: string, entity: string, subEntity: string): any | null {
    return this.data[years][entity] ? this.data[years][entity][subEntity] : null;
  }

  // ('2018-2020', 'dipartimenti', 'Matematica e Informatica')
  getLists(years: string, entity: string, subEntity: string): any[] {
    if (!this.data[years][entity]) {
      return [];
    }
    return (this.data[years][entity][subEntity].liste as []).filter((list: any): any => {
      return list.nome !== undefined;
    });
  }

  getCandidates(years: string, entity: string, subEntity: string, list: string): any[] {
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

  getAllCandidates(years: string, entity: string, subEntity: string): any {
    const lists: any[] = this.getLists(years, entity, subEntity);
    const allCandidates: any[] = [];
    lists.forEach((list: any): any => {
      allCandidates[list.nome] = this.getCandidates(years, entity, subEntity, list.nome);
    });
    return allCandidates;
  }

  getSeatsId(year: string, entity: string): any[] | null {
    const seats: any = this.data[year].seggi;
    return seats ? Object.keys(seats).filter((seat: any): boolean => {
      return seats[seat].includes(entity);
    }) : null;
  }

  // return departement that share same seat
  getMultiDepSeats(year: string, entity: string): string[] {
    const seatsData: any = this.data[year].seggi;
    if (!seatsData) {
      return [];
    }
    const seats = Object.keys(seatsData).filter((seat: any): boolean => {
      return seatsData[seat].includes(entity);
    });
    const multiDeps: string[] = [];
    seats.forEach((seat: string) => {
      if (seatsData[seat].length > 1) {
        seatsData[seat].forEach((dep: string) => multiDeps.push(dep));
      }
    });
    return multiDeps;
  }
}

export const datareader: DataReader = DataReader.getInstance();
