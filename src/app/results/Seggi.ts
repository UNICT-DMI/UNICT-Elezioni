interface ISeggi {
  seggi?: any;
  candidateList: any;
  getSeggi(): string[];
  getVotes(): number[];
}

export class DepartmentSeggi implements ISeggi {

  candidateList: any;

  constructor(candidateList: any) {
    this.candidateList = candidateList;
  }

  getSeggi(): string[] {
    return Object.keys(this.candidateList.voti).filter(v => v.startsWith('seggio_n_'));
  }

  getVotes(): number[] {
    let seggi: string[] = this.getSeggi();
    let votes: number[] = [];
    for (let seggio of seggi) {
      votes.push(this.candidateList.voti[seggio])
    }
    return votes;
  }
}

export class OtherSeggi implements ISeggi {
  candidateList: any;
  seggi: any;
  constructor(candidateList: any, seggi: any) {
    this.candidateList = candidateList;
    this.seggi = seggi;
  }

  getSeggi(): string[] {
    return this.seggi;
  }

  getVotes(): number[] {
    let seggi: string[] = this.getSeggi();
    let votes: number[] = [];
    for (let seggio of seggi) {
      votes.push(this.candidateList.voti["seggio_n_" + seggio])
    }
    return votes;
  }
}

export class Seggi {
  seggiState: ISeggi | undefined;

  constructor(candidateList: any, seggi: any) {
    if (seggi) {
      this.seggiState = new OtherSeggi(candidateList, seggi)
    } else {
      this.seggiState = new DepartmentSeggi(candidateList)
    }
  }

  getSeggi(): string[] | undefined {
    return this.seggiState?.getSeggi();
  }

  getVotes(): number[] | undefined {
    return this.seggiState?.getVotes();
  }

}

export default Seggi;
