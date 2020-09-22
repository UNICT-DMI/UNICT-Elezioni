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


    def scrapeList(self, text):
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
        
        i = self.__i
        ### Qui devo continuare con il refactoring
        # Extract votanti info
        listOfVoters = []
        while "VOTANTI" not in text[i].upper():
            i = i+1
        text[i] = text[i].replace(",", ".")
        split_text = text[i].split()
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
        
        while "ELETTORI" not in text[i].upper():
            i = i+1
        
        split_text = text[i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                totale_elettori = int(s)
                break
        i=i+1
        
        while "ELETTORI" not in text[i].upper():
            i = i+1
        
        elettori_per_seggio = []
        split_text = text[i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                elettori_per_seggio.append(int(s))

        info_elettori = {}
        info_elettori["totali"] = totale_elettori
        k = 0
        for v in elettori_per_seggio:
            info_elettori["seggio_n_" + str(listOfSeats[k])] = v
            k = k+1

        # Extract candidati
        while "PREFERENZE" not in text[i].upper():
            i = i+1
        i = i+1

        num_lists = len(self.__lists)

        eletti = []
        non_eletti = []
        j = 1
        while j <= num_lists:
            while ("L"+str(j)) not in text[i]:
                i = i+1
            i = i+1
            while "SCRUTINATI" not in text[i]:
                nameOfCandidate = ""
                voteOfCandidate = 0
                listOfSeatsVote = []
                candidato = {}
                findName = False
                split_text = text[i].split()
                for s in split_text:
                    if self.is_integer(s) == False and findName == False:
                        nameOfCandidate += (s + " ")
                    elif self.is_integer(s) == True:
                        findName = True
                        listOfSeatsVote.append(int(s))

                voteOfCandidate = listOfSeatsVote.pop(0)
                candidato["nominativo"] = nameOfCandidate.strip()
                candidato["lista"] = self.__lists[j-1]
                voti = {}
                voti["totali"] = voteOfCandidate
                k = 0
                for v in listOfSeatsVote:
                    voti["seggio_n_" + str(listOfSeats[k])] = v
                    k = k+1
                candidato["voti"] = voti
                if "ELETTO" in text[i]:
                    eletti.append(candidato)
                else:
                    non_eletti.append(candidato)
                i = i+1
            j = j+1

        file_json = {
            "dipartimento": nomeDipartimento,
            "seggi_da_assegnare": seggiDaAssegnare,
            "schede": schede,
            "liste": infoList,
            "eletti": eletti,
            "non_eletti": non_eletti,
            "quoziente": quoziente,
            "votanti": vot,
            "elettori": info_elettori
        }

        print(json.dumps(file_json))
        pass