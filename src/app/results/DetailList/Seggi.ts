interface ISeggi {
  getSeggi(): string[];
  getVotes(): number[];
}

class DepartmentSeggi implements ISeggi {

  private _candidateList: any;

  constructor(candidateList: string[]) {
    this._candidateList = candidateList;
  }

  getSeggi(): string[] {
    return Object.keys(this._candidateList.voti).filter(v => v.startsWith('seggio_n_'));
  }

  getVotes(): number[] {
    const seggi: string[] = this.getSeggi();
    const votes: number[] = [];
    for (const seggio of seggi) {
      votes.push(this._candidateList.voti[seggio])
    }
    return votes;
  }
}

class OtherSeggi implements ISeggi {
  private _candidateList: any;
  private _seggi: any;
  constructor(candidateList: any, seggi: any) {
    this._candidateList = candidateList;
    this._seggi = seggi;
  }

  getSeggi(): string[] {
    return this._seggi;
  }

  getVotes(): number[] {
    const seggi: string[] = this.getSeggi();
    const votes: number[] = [];
    for (const seggio of seggi) {
      votes.push(this._candidateList.voti["seggio_n_" + seggio])
    }
    return votes;
  }
}

export class Seggi {
  seggiState: ISeggi | undefined;

  constructor(candidateList: any, seggi: any) {
    this.seggiState = seggi ? new OtherSeggi(candidateList, seggi) : new DepartmentSeggi(candidateList);
  }

  getSeggi(): string[] {
    return this.seggiState!.getSeggi();
  }

  getVotes(): number[] {
    return this.seggiState!.getVotes();
  }

}

export default Seggi;
