from Target import Target
import json

class Dipartimento(Target):

    __i = 0
    __lists = []

    def __findNameDepartment(self, text) -> str:
        nome = text[1]
        self.__i = 2
        while("BIENNIO" not in text[self.__i]):
            nome += "\n" + text[self.__i]
            self.__i = self.__i + 1
        self.__i = self.__i + 2
        return nome

    def __findNumberOfSeats(self, text) -> str:
        r = text[self.__i].split()[len(text[self.__i].split())-1]
        self.__i = self.__i + 1
        return r
        
    def __findInfoLists(self, text):
        while "L I S T E" not in text[self.__i]:
            self.__i = self.__i + 1
        self.__i = self.__i + 1

    def __getSeats(self, text) -> object:
        listOfSeats = []
        split_text = text[self.__i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                listOfSeats.append(int(s))
        self.__i = self.__i + 1
        return listOfSeats

    def __getInfoLists(self, text, listOfSeats) -> object:
        infoLists = []
        while("TOTALE" not in text[self.__i]):
            votesOfSeats = []
            Seats = []
            nameOfList = ""
            voteOfList = 0
            findVote = False
            split_text = text[self.__i].split()
            for s in split_text:
                if self.is_integer(s) == False and findVote == False:
                    nameOfList += (s + " ")
                elif findVote == False:
                    voteOfList = int(s)
                    self.__lists.append(nameOfList.strip())
                    findVote = True
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
            self.__i = self.__i + 1
        infoLists.append({"totale": int(text[self.__i].split()[1])})
        self.__i = self.__i + 1
        return infoLists
    
    def __findCard(self, type, text, listOfSeats, listOfType) -> int:
        listTmp = []
        while type not in text[self.__i].upper():
            self.__i = self.__i + 1
        split_text = text[self.__i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                listTmp.append(int(s))
        j = len(listOfSeats) - 1
        while j>=0:
            listOfType.append(listTmp.pop(len(listTmp)-(j+1)))
            j = j-1
        return listTmp.pop(0)

    def __scheda(self, type, schedeType, listOfType, listOfSeats):
        type["totali"] = schedeType
        k = 0
        for v in listOfType:
            type["seggio_n_" + str(listOfSeats[k])] = v
            k = k+1
    
    def __formatSchede(self, schede_bianche, schede_nulle, schede_contestate, listOfWhite, listOfNull, listOfContested, listOfSeats) -> object:
        bianche = {}
        nulle = {}
        contestate = {}

        self.__scheda(bianche, schede_bianche, listOfWhite, listOfSeats)
        self.__scheda(nulle, schede_nulle, listOfNull, listOfSeats)
        self.__scheda(contestate, schede_contestate, listOfContested, listOfSeats)
        
        schede = {
            "bianche": bianche,
            "nulle": nulle,
            "contestate": contestate
        }
        return schede
    
    def __getQuotient(self, text) -> int:
        while("QUOZIENTE" not in text[self.__i].upper()):
            self.__i = self.__i + 1
        text[self.__i] = text[self.__i].replace(",", ".")
        split_text = text[self.__i].split()
        quoziente = -1
        for s in split_text:
            try:
                float(s)
            except ValueError:
                continue
            else:
                quoziente = float(s)
                break
        if quoziente == -1:
            for s in split_text:
                try:
                    int(s)
                except ValueError:
                    continue
                else:
                    quoziente = int(s)
                    break
        return quoziente

    def __getVotanti(self, text, listOfSeats) -> object:
        listOfVoters = []
        while "VOTANTI" not in text[self.__i].upper():
            self.__i = self.__i + 1
        text[self.__i] = text[self.__i].replace(",", ".")
        split_text = text[self.__i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                listOfVoters.append(int(s))
            else:
                try:
                    float(s)
                except ValueError:
                    continue
                else:
                    listOfVoters.append(float(s))
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
        while "ELETTORI" not in text[self.__i].upper():
            self.__i = self.__i + 1
        
        split_text = text[self.__i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                totale_elettori = int(s)
                break
        self.__i = self.__i + 1
        
        while "ELETTORI" not in text[self.__i].upper():
            self.__i = self.__i + 1
        
        elettori_per_seggio = []
        split_text = text[self.__i].split()
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
    
    def __getInfoCandidato(self, split_text, listOfSeatsVote, voteOfCandidate) -> str:
        nameOfCandidate = ""
        findName = False
        for s in split_text:
            if self.is_integer(s) == False and findName == False:
                nameOfCandidate += (s + " ")
            elif self.is_integer(s) == True:
                findName = True
                listOfSeatsVote.append(int(s))
        voteOfCandidate[0] = listOfSeatsVote.pop(0)
        return nameOfCandidate
            

    def __getCandidati(self, text, eletti, non_eletti, listOfSeats):
        while "PREFERENZE" not in text[self.__i].upper():
            self.__i = self.__i + 1
        self.__i = self.__i + 1

        num_lists = len(self.__lists)
        j = 1
        while j <= num_lists:
            while ("L"+str(j)) not in text[self.__i]:
                self.__i = self.__i + 1
            self.__i = self.__i + 1
            while "SCRUTINATI" not in text[self.__i]:
                voteOfCandidate = [1]
                listOfSeatsVote = []
                split_text = text[self.__i].split()
                nameOfCandidate = self.__getInfoCandidato(split_text, listOfSeatsVote, voteOfCandidate)
                
                candidato = {}
                candidato["nominativo"] = nameOfCandidate.strip()
                candidato["lista"] = self.__lists[j-1]
                
                voti = {}
                voti["totali"] = voteOfCandidate[0]
                k = 0
                for v in listOfSeatsVote:
                    voti["seggio_n_" + str(listOfSeats[k])] = v
                    k = k+1
                candidato["voti"] = voti
                if "ELETTO" in text[self.__i]:
                    eletti.append(candidato)
                else:
                    non_eletti.append(candidato)
                self.__i = self.__i + 1
            j = j+1

    def scrapeList(self, text) -> object:
        nomeDipartimento = self.__findNameDepartment(text)
        seggiDaAssegnare = self.__findNumberOfSeats(text)
        self.__findInfoLists(text)
        listOfSeats = self.__getSeats(text)
        infoList = self.__getInfoLists(text, listOfSeats)

        listOfWhite = []
        schede_bianche = self.__findCard("BIANCHE", text, listOfSeats, listOfWhite)

        listOfNull = []
        schede_nulle = self.__findCard("NULLE", text, listOfSeats, listOfNull)

        listOfContested = []
        schede_contestate = self.__findCard("CONTESTATE", text, listOfSeats, listOfContested)

        schede = self.__formatSchede(schede_bianche, schede_nulle, schede_contestate, listOfWhite, listOfNull, listOfContested, listOfSeats)
        
        quoziente = self.__getQuotient(text)
        
        votanti = self.__getVotanti(text, listOfSeats)
        info_elettori = self.__getInfoElettori(text, listOfSeats)

        eletti = []
        non_eletti = []
        self.__getCandidati(text, eletti, non_eletti, listOfSeats)

        file_json = {
            "dipartimento": nomeDipartimento,
            "seggi_da_assegnare": seggiDaAssegnare,
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