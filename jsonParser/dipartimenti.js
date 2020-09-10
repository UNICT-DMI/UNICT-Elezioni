var pdf2table = require('pdf2table');
var fs = require('fs');

var info = {
    "schede": { "Schede Bianche": 0, "Schede Nulle": 0, "Schede Contestate": 0 },
    "votanti": 0,
    "elettori": 0,
    "seggi da assegnare": 0,
    "liste": [], "eletti": []
};

var fileName = "informatica";
fs.readFile('document/' + fileName + ".pdf", function (err, buffer) {
    if (err) return console.log(err);


    //Parsing
    pdf2table.parse(buffer, function (err, rows, rowsdebug) {
        if (err) return console.log(err);
        var list = false;
        rows.forEach(element => {
            if (element[2] == "ELETTO") {
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
            else if (element[0] == "n. di seggi da assegnare")
                info["seggi da assegnare"] = element[1];
            else if (element[0] == "ELETTORI")
                info["elettori"] = element[1];
            else if (element[0] == "VOTANTI")
                info["votanti"] = element[1];

        })

        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0].includes("DIPARTIMENTO")) {
                i++;
                info["dipartimento"] = rows[i][0];
            }
            if (rows[i][0].includes("L I S T E ")) {
                i = i + 2;
                while (!rows[i][0].includes("TOTALE")) {
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
