const pdf2table = require('pdf2table');
import * as fs from 'fs';


const enum schede {
    BIANCHE = 'Schede Bianche',
    NULLE = 'Schede Nulle',
    CONTESTATE = 'Schede Contestate'
}

const enum candidati {
    ELETTO_DIP = 'ELETTO',
    LISTE_DIP = 'L I S T E ',
    ELETTO_ORG = 'Eletto',
    LISTE_ORG = 'LISTE',
    VOTI = 'TOTALE'
}

const enum seggi {
    DA_ASSEGNARE_DIP = 'n. di seggi da assegnare',
    DA_ASSEGNARE_ORG = 'numero seggi da assegnare',
    SCRUTINATI = 'N° SEGGI SCRUTINATI SU '
}

const enum elettori {
    TUTTI = 'TOTALE ELETTORI AVENTI DIRITTO',
    VOTANTI = 'VOTANTI'
}

const enum query {
    DIPARTIMENTO = 'DIPARTIMENTO',
    ORGANI = "IN SENO"
}

class Parser {
    private info: object;
    private doc: Target;
    private fileName: string;

    constructor(fileName: string, dip) {

        this.fileName = fileName;

        this.info = {
            schede: {},
            liste: [],
            eletti: []
        }

        if (dip === 0)
            this.doc = new Dipartimento();
        else
            this.doc = new Organo();


    }

    private write(): void {
        const data = JSON.stringify(this.info);
        fs.writeFile('json/' + this.fileName + '.json', data, (errW) => {
            if (errW) {
                throw errW;
            }
            console.log('JSON data is saved.');
        });
    }

    public scrape(): void {
        fs.readFile('document/' + this.fileName + '.pdf', (errR, buffer) => {

            if (errR)
                return console.log(errR);

            pdf2table.parse(buffer, (errP, data) => {
                if (errP)
                    return console.log(errP);

                this.doc.scrapeLists(this.info, data);
                let idxList = -1;

                data.forEach(el => {
                    if (this.doc.checkEletto(el)) {
                        const eletto = {
                            nominativo: el[0],
                            voti: el[1],
                            lista: this.info['liste'][idxList]
                        }
                        this.info['eletti'].push(eletto);
                    }


                    switch (el[0]) {
                        case schede.BIANCHE:
                        case schede.NULLE:
                        case schede.CONTESTATE:
                            this.info['schede'][el[0]] = el[1];
                            break;
                        case elettori.TUTTI:
                            this.info['elettori'] = el[1];
                            break;
                        case elettori.VOTANTI:
                            this.info['votanti'] = el[1];
                            break;
                    }
                    if (el[0].includes(seggi.SCRUTINATI))
                        idxList++;

                });





                this.write();
            });
        });
    }




}

interface Target {
    scrapeLists(info: object, data: object): void;
    scrapeOther(info: object, data: object): void;
    checkEletto(data: object): boolean;
}


class Dipartimento implements Target {
    public scrapeLists(info: object, data: object[]): void {
        for (let i = 0; i < data.length; i++) {

            if (data[i][0].includes(query.DIPARTIMENTO))
                info['dipartimento'] = data[++i][0];

            if (data[i][0].includes(candidati.LISTE_DIP)) {
                i = i + 2;
                while (!data[i][0].includes(candidati.VOTI) && !data[i][0].includes(schede.BIANCHE)) {
                    info['liste'].push(data[i][0]);
                    i++;
                }
            }
        }
    }
    public scrapeOther(info: object, data: object): void {
        if (data[0] === seggi.DA_ASSEGNARE_DIP)
            info["seggi_da_assegnare"] = data[1];
    }
    public checkEletto(data: object): boolean {
        if (data[2] === candidati.ELETTO_DIP)
            return true;

        return false;
    }

}

class Organo implements Target {
    public scrapeLists(info: object, data: object[]): void {
        for (let i = 0; i < data.length; i++) {

            if (data[i][0].includes(query.ORGANI))
                info['organo'] = data[i][0];

            if (data[i][0].includes(candidati.LISTE_ORG)) {
                while (!data[++i][0].includes(candidati.VOTI) && !data[i][0].includes(schede.BIANCHE))
                    info['liste'].push(data[i][0]);
            }
        }
    }
    public scrapeOther(info: object, data: object): void {
        if (data[1] === seggi.DA_ASSEGNARE_ORG)
            info["seggi_da_assegnare"] = data[2];
    }
    public checkEletto(data: object): boolean {
        if (data[2] === candidati.ELETTO_ORG)
            return true;

        return false;
    }
}


let fileName = process.argv[2];
let mode = parseInt(process.argv[3]);
const creator = new Parser(fileName, mode);
creator.scrape();

