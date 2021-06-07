interface ISeggi {
  seggiList: string[];
  votesList: number[];
}

class DepartmentSeggi implements ISeggi {
  private _candidateList: any;

  constructor(candidateList: any) {
    this._candidateList = candidateList;
  }

  get seggiList(): string[] {
    return Object.keys(this._candidateList.voti).filter((v) => v.startsWith('seggio_n_'));
  }

  get votesList(): number[] {
    return this.seggiList.map(seggio => this._candidateList.voti[seggio]);
  }
}

class OtherSeggi implements ISeggi {
  private _candidateList: any;

  private _seggi: string[];

  constructor(candidateList: any, seggi: string[]) {
    this._candidateList = candidateList;
    this._seggi = seggi;
  }

  get seggiList(): string[] {
    return this._seggi;
  }

  get votesList(): number[] {
    return this.seggiList.map(seggio => this._candidateList.voti[`seggio_n_${seggio}`]);
  }
}

export class Seggi {
  seggiState: ISeggi;

  constructor(candidateList: any, seggi: string[] | null) {
    this.seggiState = seggi
      ? new OtherSeggi(candidateList, seggi)
      : new DepartmentSeggi(candidateList);
  }

  get seggiList(): string[] {
    return this.seggiState.seggiList;
  }

  get votesList(): number[] {
    return this.seggiState.votesList;
  }
}

export default Seggi;
