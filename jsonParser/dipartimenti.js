const pdf2table = require('pdf2table');
const fs = require('fs');

const schede = {
    BIANCHE: 'Schede Bianche',
    NULLE: 'Schede Nulle',
    CONTESTATE: 'Schede Contestate'
}

const candidati = {
    ELETTO: "ELETTO",
    LISTE: "L I S T E ",
    VOTI: 'TOTALE'
}

const seggi = {
    DA_ASSEGNARE: 'n. di seggi da assegnare',
    SCRUTINATI: "N° SEGGI SCRUTINATI SU 1"
}

const elettori = {
    TUTTI: 'TOTALE ELETTORI AVENTI DIRITTO',
    VOTANTI: 'VOTANTI'
}

const query = "DIPARTIMENTO";


const info = {
    "schede": {},
    "liste": [], "eletti": []
};

let fileName = "informatica";
fs.readFile('document/' + fileName + ".pdf", function (err, buffer) {
    if (err) return console.log(err);

    pdf2table.parse(buffer, function (err, rows, rowsdebug) {

        if (err)
            return console.log(err);

        //Parsing

        for (let i = 0; i < rows.length; i++) {

            if (rows[i][0].includes(query))
                info.dipartimento = rows[++i][0];


            if (rows[i][0].includes(candidati.LISTE)) {
                i = i + 2;
                while (!rows[i][0].includes(candidati.VOTI) && !rows[i][0].includes(schede.BIANCHE)) {
                    info.liste.push(rows[i][0]);
                    i++;
                }
            }
        }

        let idxList = -1;

        rows.forEach(element => {
            if (element[2] === candidati.ELETTO) {

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
                case seggi.DA_ASSEGNARE:
                    info.seggi_da_assegnare = element[1];
                    break;
                case seggi.SCRUTINATI:
                    idxList++;
                    break;
            }


        })


        //Output
        const data = JSON.stringify(info);
        fs.writeFile("json/" + fileName + ".json", data, err => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    });
});
