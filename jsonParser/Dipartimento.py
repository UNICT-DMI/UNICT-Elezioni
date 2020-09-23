from Target import Target
import json

class Dipartimento(Target):

    def __findNameDepartment(self, text) -> str:
        nome = text[1]
        self.i = 2
        while "BIENNIO" not in text[self.i].upper() and "VOTI DI LISTA" not in text[self.i].upper():
            nome += "\n" + text[self.i]
            self.i += 1
        return nome

    def __findNumberOfSeats(self, text) -> str:
        r = text[self.i].split()[len(text[self.i].split())-1]
        self.i += 1
        return r
        
    def __findInfoLists(self, text):
        while "L I S T E" not in text[self.i].upper():
            self.i += 1
        self.i += 1

    def __getSeats(self, text) -> object:
        listOfSeats = []
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                listOfSeats.append(int(s))
        self.i += 1
        return listOfSeats

    def __getInfoLists(self, text, listOfSeats, seggiDaAssegnare) -> object:
        infoLists = []
        while("TOTALE" not in text[self.i]):
            votesOfSeats = []
            Seats = []
            nameOfList = ""
            voteOfList = 0
            findVote = False
            split_text = text[self.i].split()
            for s in split_text:
                if self.is_integer(s) == False and findVote == False:
                    nameOfList += (s + " ")
                elif findVote == False:
                    try:
                        int_s = int(s)
                        voteOfList = int_s
                        self.lists.append(nameOfList.strip())
                        findVote = True
                    except ValueError:
                        nameOfList += (s + " ")
                else:
                    Seats.append(s)
            
            votes = {}
            votes["totali"] = voteOfList
            j = len(listOfSeats)-1
            k = 0
            while j>=0:
                votes["seggio_n_" + str(listOfSeats[k])] = int(Seats.pop(len(Seats)-(j+1)))
                k = k+1
                j = j-1
            infoLists.append({
                "nome": nameOfList.strip(), 
                "seggi": {
                    "seggi_pieni": Seats.pop(0),
                    "resti": Seats.pop(0),
                    "seggi_ai_resti": Seats.pop(0),
                    "seggi_totali": Seats.pop(0)
                    },
                    "voti": votes
            })
            self.i += 1
        
        tmp = text[self.i].split()
        infoLists.append({"totale": int(tmp[1])})
        seggiDaAssegnare[0] = tmp[len(tmp)-1]
        self.i += 1
        return infoLists

    def __getVotanti(self, text, listOfSeats) -> object:
        listOfVoters = []
        while "VOTANTI" not in text[self.i].upper():
            self.i += 1
        text[self.i] = text[self.i].replace(",", ".")
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                ssplit = s.split(".")
                listOfVoters.append(int(ssplit[0]))
            else:
                try:
                    fs = float(s)
                    listOfVoters.append(fs)
                except ValueError:
                    continue
        votanti = listOfVoters.pop(0)
        votanti_perc = listOfVoters.pop(0)

        vot = {}
        vot["totali"] = votanti
        vot["percentuale"] = votanti_perc
        k = 0
        for v in listOfVoters:
            vot["seggio_n_" + str(listOfSeats[k])] = v
            k = k+1
        return vot
    
    def __getInfoElettori(self, text, listOfSeats) -> object:
        while "ELETTORI" not in text[self.i].upper():
            self.i += 1
        
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                totale_elettori = int(s)
                break
        self.i += 1
        
        while "ELETTORI" not in text[self.i].upper():
            self.i += 1
        
        elettori_per_seggio = []
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                elettori_per_seggio.append(int(s))

        info_elettori = {}
        info_elettori["totali"] = totale_elettori
        k = 0
        for v in elettori_per_seggio:
            info_elettori["seggio_n_" + str(listOfSeats[k])] = v
            k = k+1
        return info_elettori


    def scrapeList(self, text) -> object:
        nomeDipartimento = self.__findNameDepartment(text)
        seggiDaAssegnare = [1]
        self.__findInfoLists(text)
        listOfSeats = self.__getSeats(text)
        infoList = self.__getInfoLists(text, listOfSeats, seggiDaAssegnare)

        listOfWhite = []
        schede_bianche = self.findCard("BIANCHE", text, listOfSeats, listOfWhite)

        listOfNull = []
        schede_nulle = self.findCard("NULLE", text, listOfSeats, listOfNull)

        listOfContested = []
        schede_contestate = self.findCard("CONTESTATE", text, listOfSeats, listOfContested)

        schede = self.formatSchede(schede_bianche, schede_nulle, schede_contestate, listOfWhite, listOfNull, listOfContested, listOfSeats)
        
        quoziente = self.getQuotient(text)
        
        votanti = self.__getVotanti(text, listOfSeats)
        info_elettori = self.__getInfoElettori(text, listOfSeats)

        eletti = []
        non_eletti = []
        self.getCandidati(text, eletti, non_eletti, listOfSeats, 1)

        file_json = {
            "dipartimento": nomeDipartimento,
            "seggi_da_assegnare": seggiDaAssegnare[0],
            "schede": schede,
            "liste": infoList,
            "eletti": eletti,
            "non_eletti": non_eletti,
            "quoziente": quoziente,
            "votanti": votanti,
            "elettori": info_elettori
        }
        file = json.dumps(file_json)
        parsed = json.loads(file)
        return json.dumps(parsed, indent=4, sort_keys=False)
        pass