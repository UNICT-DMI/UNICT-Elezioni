const pdf2table = require('pdf2table');
const fs = require('fs');

const schede = {
    BIANCHE: 'Schede Bianche',
    NULLE: 'Schede Nulle',
    CONTESTATE: 'Schede Contestate'
}

const candidati = {
    ELETTO: 'Eletto',
    LISTE: 'LISTE'
}

const seggi = {
    DA_ASSEGNARE: 'numero seggi da assegnare',
    SCRUTINATI: 'N° SEGGI SCRUTINATI SU '
}

const elettori = {
    TUTTI: 'TOTALE ELETTORI AVENTI DIRITTO',
    VOTANTI: 'VOTANTI'
}

const query = 'IN SENO';


const info = {
    schede: {},
    liste: [], eletti: []
};

let fileName = process.argv.slice(2);

fs.readFile('document/' + fileName + '.pdf', function (errR, buffer) {

    if (errR)
        return console.log(errR);

    pdf2table.parse(buffer, function (errP, rows, rowsdebug) {
        if (errP) return console.log(errP);
        //Parsing
        for (let i = 0; i < rows.length; i++) {

            if (rows[i][0].includes(query))
                info.organo = rows[i][0];

            if (rows[i][0].includes(candidati.LISTE)) {
                while (!rows[++i][0].includes(candidati.VOTI) && !rows[i][0].includes(schede.BIANCHE))
                    info.liste.push(rows[i][0]);
            }
        }

        let idxList = -1;

        rows.forEach(element => {
            if (element[2] == candidati.ELETTO) {

                const eletto = {
                    nominativo: element[0],
                    voti: element[1],
                    lista: info.liste[idxList]
                }

                info.eletti.push(eletto);
            }

            switch (element[0]) {
                case schede.BIANCHE:
                case schede.NULLE:
                case schede.CONTESTATE:
                    info.schede[element[0]] = element[1];
                    break;
                case elettori.TUTTI:
                    info.elettori = element[1];
                    break;
                case elettori.VOTANTI:
                    info.votanti = element[1];
                    break;
            }
            if (element[0].includes(seggi.SCRUTINATI))
                idxList++;

            if (element[1] === seggi.DA_ASSEGNARE)
                info.seggi_da_assegnare = element[2];

        })

        //Output
        const data = JSON.stringify(info);
        fs.writeFile('json/' + fileName + '.json', data, (errW) => {
            if (errW) {
                throw errW;
            }
            console.log('JSON data is saved.');
        });
    });
});
