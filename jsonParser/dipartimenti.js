const pdf2table = require('pdf2table');
const fs = require('fs');

const schede = {
    BIANCHE: 'Schede Bianche',
    NULLE: 'Schede Nulle',
    CONTESTATE: 'Schede Contestate'
}

const candidati = {
    ELETTO: "ELETTO",
    LISTE: "L I S T E "
}

const seggi = {
    DA_ASSEGNARE: 'n. di seggi da assegnare',
    SCRUTINATI: 'TOTALE'
}

const elettori = {
    TUTTI: 'TOTALE ELETTORI AVENTI DIRITTO',
    VOTANTI: 'VOTANTI'
}

const query = "DIPARTIMENTO";


let info = {
    "schede": { "Schede Bianche": 0, "Schede Nulle": 0, "Schede Contestate": 0 },
    "votanti": 0,
    "elettori": 0,
    "seggi da assegnare": 0,
    "liste": [], "eletti": []
};

let fileName = "informatica";
fs.readFile('document/' + fileName + ".pdf", function (err, buffer) {
    if (err) return console.log(err);

    pdf2table.parse(buffer, function (err, rows, rowsdebug) {
        if (err) return console.log(err);

        //Parsing

        rows.forEach(element => {
            if (element[2] == candidati.ELETTO) {

                eletto = {
                    "COGNOME e Nome": element[0],
                    "voti": element[1]
                }

                info["eletti"].push(eletto);
            }

            switch (element[0]) {
                case schede.BIANCHE:
                case schede.NULLE:
                case schede.CONTESTATE:
                    info["schede"][element[0]] = element[1];
                    break;
                case elettori.TUTTI:
                    info["elettori"] = element[1];
                    break;
                case elettori.VOTANTI:
                    info["votanti"] = element[1];
                    break;
                case seggi.DA_ASSEGNARE:
                    info["seggi da assegnare"] = element[1];
                    break;
            }


        })

        for (let i = 0; i < rows.length; i++) {

            if (rows[i][0].includes(query))
                info["dipartimento"] = rows[++i][0];


            if (rows[i][0].includes(candidati.LISTE)) {
                i = i + 2;
                while (!rows[i][0].includes(seggi.SCRUTINATI) && !rows[i][0].includes(schede.BIANCHE)) {
                    info["liste"].push(rows[i][0]);
                    i++;
                }
            }
        }

        //Output
        const data = JSON.stringify(info);
        fs.writeFile("json/" + fileName + ".json", data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    });
});
