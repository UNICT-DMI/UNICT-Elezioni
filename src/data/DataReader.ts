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
    this.fix20212023();
    // console.log(this.getCandidates('2018-2020', 'Dipartimento', 'Matematica_e_informatica', 'DMI INSIDER'));
  }

  fix20212023(): void {
    const year = '2021-2023';
    const entities = this.getEntities(year);
    for (const entity of entities) {
      const subEntities = this.getSubEntities(year, entity);
      for (const subEntity of subEntities) {
        if (this.isUninominal(year, entity, subEntity)) {
          continue;
        }
        const lists = this.getLists(year, entity, subEntity);
        for (const list of lists) {
          const candidates = this.getCandidates(year, entity, subEntity, list.nome);
          for (const candidate of candidates) {
            if (lists.findIndex((list: any) => list.nome === candidate.nominativo) !== -1) {
              console.log(`FIXED ${entity}-${subEntity}-${list.nome} candidato:${candidate.nominativo}`);
              this.removeCandidate(year, entity, subEntity, candidate.nominativo);
            }
          }
        }
      }
    }
  }

  removeCandidate(years: string, entity: string, subEntity: string, candidateName: string): void {
    this.data[years][entity][subEntity].eletti = (this.data[years][entity][subEntity].eletti as any[]).filter((candidate: any) => !((candidate.nominativo as string).includes(candidateName)));
    this.data[years][entity][subEntity].non_eletti = (this.data[years][entity][subEntity].non_eletti as any[]).filter((candidate: any) => !((candidate.nominativo as string).includes(candidateName)));
  }

  getYears(): string[] {
    return Object.keys(this.data).sort().reverse();
  }

  getEntities(years: string | null = null): string[] {
    if (!years) {
      let entities: string[] = [];
      const yearsList = this.getYears();
      for (const year of yearsList) {
        entities = [...entities, ...Object.keys(this.data[year]).filter((entity: string) => entity !== 'seggi')];
      }
      return [...new Set(entities)];
    }
    return Object.keys(this.data[years]);
  }

  getSubEntities(years: string, entity: string): string[] {
    if (!this.data[years][entity]) {
      return [];
    }
    return Object.keys(this.data[years][entity]);
  }

  getAllSubEntities(entity: string): string[] {
    let subEntities: string[] = [];
    const yearsList = this.getYears();
    for (const year of yearsList) {
      if (this.data[year][entity]) {
        subEntities = [...subEntities, ...Object.keys(this.data[year][entity])];
      }
    }
    return [...new Set(subEntities)].sort();
  }

  getHigherPolitics(years: string): string[] {
    if (this.data[years]['organi superiori']) {
      return Object.keys(this.data[years]['organi superiori']);
    }

    return [];
  }

  getAllHigherPolitics(): string[] {
    let entities: string[] = [];
    const yearsList = this.getYears();
    for (const year of yearsList) {
      entities = [...entities, ...this.getHigherPolitics(year)];
    }
    return [...new Set(entities)];
  }

  // generic method for all entities
  getEntity(years: string, entity: string): string[] | null {
    return this.data[years][entity] ? Object.keys(this.data[years][entity]) : null;
  }

  getSubEntity(years: string, entity: string, subEntity: string): any | null {
    return this.data[years][entity] ? this.data[years][entity][subEntity] : null;
  }

  getYearsOfSubEntity(entity: string, subEntity: string): string[] {
    return this.getYears().filter((year: string): boolean => this.data[year][entity] && this.data[year][entity][subEntity]);
  }

  isUninominal(years: string, entity: string, subEntity: string): boolean {
    return this.data[years][entity][subEntity].liste === undefined;
  }

  // ('2018-2020', 'dipartimenti', 'Matematica e Informatica')
  getLists(years: string, entity: string, subEntity: string): any[] {
    if (!this.data[years][entity] || this.isUninominal(years, entity, subEntity)) {
      return [];
    }
    return (this.data[years][entity][subEntity].liste as []).filter((list: any): any => list.nome !== undefined);
  }

  getCandidates(years: string, entity: string, subEntity: string, list: string): any[] {
    const candidatesInfo = this.data[years][entity][subEntity];
    const elected: any[] = candidatesInfo.eletti ? (candidatesInfo.eletti as []).filter((candidate: any): boolean => candidate.lista === list) : [];
    const notElected: any[] = candidatesInfo.non_eletti ? (candidatesInfo.non_eletti as []).filter((candidate: any): boolean => candidate.lista === list) : [];
    const onlyCandidate: any[] = candidatesInfo.candidati ? (candidatesInfo.candidati as []).filter((candidate: any): boolean => candidate.lista === list) : [];

    return [
      ...elected.map((candidate: any): any => {
        candidate.eletto = true;
        return candidate;
      }),
      ...notElected.map((candidate: any): any => {
        candidate.eletto = false;
        return candidate;
      }),
      ...onlyCandidate
    ];
  }

  getCandidatesUninominal(years: string, entity: string, subEntity: string): any {
    const elected: any[] = (this.data[years][entity][subEntity].eletti as []);
    const notElected: any[] = (this.data[years][entity][subEntity].non_eletti as []);
    if (!elected) {
      return null;
    }
    return [
      ...elected.map((candidate: any): any => {
        candidate.eletto = true;
        return candidate;
      }),
      ...notElected.map((candidate: any): any => {
        candidate.eletto = false;
        return candidate;
      })
    ];
  }

  getAllCandidates(years: string, entity: string, subEntity: string): any {
    const lists: any[] = this.getLists(years, entity, subEntity);
    const allCandidates: any = [];
    if (lists.length > 0) {
      lists.forEach((list: any): any => {
        allCandidates[list.nome] = this.getCandidates(years, entity, subEntity, list.nome);
      });
      return allCandidates;
    }
    allCandidates.UNINOMINAL = this.getCandidatesUninominal(years, entity, subEntity);
    return allCandidates;
  }

  getSeatsId(year: string, entity: string): any {
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

  hasPassedQuorum(years: string, entity: string, subEntity: string): boolean {
    return this.data[years][entity][subEntity].quorum_raggiunto !== false;
  }
}

export const datareader: DataReader = DataReader.getInstance();
