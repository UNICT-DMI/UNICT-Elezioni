from Target import Target
import json

class Dipartimento(Target):
    def scrapeList(self, text, data):
        
        # Find the name of the department
        nomeDipartimento = text[1]
        i = 2
        while("BIENNIO" not in text[i]):
            nomeDipartimento += "\n" + text[i]
            i = i+1
        i = i+2

        # Find the number of seats
        seggiDaAssegnare = text[i].split()[len(text[i].split())-1]
        i = i+1

        # Find the name of the lists and their info
        while("L I S T E" not in text[i]):
            i = i+1
        i = i+1;
        listOfSeats = []
        split_text = text[i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                listOfSeats.append(int(s))
        i = i+1
        lists = []
        votesOfSeats = []
        SingleLists = []
        Seats = []
        nameOfList = ""
        voteOfList = 0
        findVote = False
        while("TOTALE" not in text[i]):
            split_text = text[i].split()
            for s in split_text:
                if self.is_integer(s) == False and findVote == False:
                    nameOfList += (s + " ")
                elif findVote == False:
                    voteOfList = int(s)
                    lists.append(nameOfList.strip())
                    findVote = True
                else:
                    Seats.append(s)
            
            votes = {}
            j = len(listOfSeats)-1
            k = 0
            votes["totali"] = voteOfList
            while j>=0:
                votes["seggio_n_" + str(listOfSeats[k])] = int(Seats.pop(len(Seats)-(j+1)))
                k = k+1
                j = j-1
            SingleLists.append({
                "nome": nameOfList.strip(), 
                "seggi": {
                    "seggi_pieni": Seats.pop(0),
                    "resti": Seats.pop(0),
                    "seggi_ai_resti": Seats.pop(0),
                    "seggi_totali": Seats.pop(0)
                    },
                    "voti": votes
            })
            voteOfList = 0
            nameOfList = ""
            findVote = False
            votesOfSeats.clear()
            Seats.clear()
            i = i+1
        SingleLists.append({"totale": int(text[i].split()[1])})
        i = i+1

        listTmp = []
        # Find white card
        while "BIANCHE" not in text[i].upper():
            i = i+1
        listOfWhite = []
        split_text = text[i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                listTmp.append(int(s))
        j = len(listOfSeats) - 1
        while j>=0:
            listOfWhite.append(listTmp.pop(len(listTmp)-(j+1)))
            j = j-1
        schede_bianche = listTmp.pop(0)

        listTmp.clear()
        # Find null card
        while "NULLE" not in text[i].upper():
            i = i+1
        listOfNull = []
        split_text = text[i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                listTmp.append(int(s))
        j = len(listOfSeats) - 1
        while j>=0:
            listOfNull.append(listTmp.pop(len(listTmp)-(j+1)))
            j = j-1
        schede_nulle = listTmp.pop(0)

        listTmp.clear()
        # Find contested card
        while "CONTESTATE" not in text[i].upper():
            i = i+1
        listOfContested = []
        split_text = text[i].split()
        for s in split_text:
            if self.is_integer(s) == True:
                listTmp.append(int(s))
        j = len(listOfSeats) - 1
        while j>=0:
            listOfContested.append(listTmp.pop(len(listTmp)-(j+1)))
            j = j-1
        schede_contestate = listTmp.pop(0)

        bianche = {}
        nulle = {}
        contestate = {}

        bianche["totali"] = schede_bianche
        k = 0
        for v in listOfWhite:
            bianche["seggio_n_" + str(listOfSeats[k])] = v
            k = k+1
        
        nulle["totali"] = schede_nulle
        k = 0
        for v in listOfWhite:
            nulle["seggio_n_" + str(listOfSeats[k])] = v
            k = k+1

        contestate["totali"] = schede_contestate
        k = 0
        for v in listOfWhite:
            contestate["seggio_n_" + str(listOfSeats[k])] = v
            k = k+1
        
        schede = {
            "bianche": bianche,
            "nulle": nulle,
            "contestate": contestate
        }

        # Quotient extraction
        while("QUOZIENTE" not in text[i].upper()):
            i = i+1
        text[i] = text[i].replace(",", ".")
        split_text = text[i].split()
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

        num_lists = len(lists)

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
                candidato["lista"] = lists[j-1]
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
            "liste": SingleLists,
            "eletti": eletti,
            "non_eletti": non_eletti,
            "quoziente": quoziente,
            "votanti": vot,
            "elettori": info_elettori
        }
        pass