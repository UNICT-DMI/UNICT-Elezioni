var pdf2table = require('pdf2table');
var fs = require('fs');

var info = {
    "schede": { "Schede Bianche": 0, "Schede Nulle": 0, "Schede Contestate": 0 },
    "votanti": 0,
    "elettori": 0,
    "seggi da assegnare": 0,
    "liste": [], "eletti": []
};

var fileName = "consiglio";
fs.readFile('document/' + fileName + ".pdf", function (err, buffer) {
    if (err) return console.log(err);

    pdf2table.parse(buffer, function (err, rows, rowsdebug) {
        if (err) return console.log(err);

        //Parsing

        rows.forEach(element => {
            if (element[2] == "Eletto") {
                eletto = {
                    "COGNOME e Nome": element[0],
                    "voti": element[1]
                }
                info["eletti"].push(eletto);
            }
            if (element[0] == "Schede Bianche")
                info["schede"]["Schede Bianche"] = element[1];
            else if (element[0] == "Schede Nulle")
                info["schede"]["Schede Nulle"] = element[1];
            else if (element[0] == "Schede Contestate")
                info["schede"]["Schede Contestate"] = element[1];
            else if (element[1] == "numero seggi da assegnare")
                info["seggi da assegnare"] = element[2];
            else if (element[0] == "TOTALE ELETTORI AVENTI DIRITTO")
                info["elettori"] = element[1];
            else if (element[0] == "VOTANTI")
                info["votanti"] = element[1];

        })

        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0].includes("IN SENO")) {
                info["organo"] = rows[i][0];
            }
            if (rows[i][0].includes("LISTE")) {
                i++;
                while (!rows[i][0].includes("TOTALE") && !rows[i][0].includes("Schede")) {
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
