from Target import Target
import json

class Organo(Target):

    def __findNameOrgano(self, text) -> str:
        while "ELEZIONI" not in text[self.i].upper():
            self.i += 1
        
        return text[self.i]

    def __findListOfSeats(self, text) -> object:
        while "LISTE" not in text[self.i].upper():
            self.i += 1
        
        listOfSeats = []
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s):
                listOfSeats.append(int(s))
        return listOfSeats
    
    def __getInfoLists(self, text) -> object:
        while "TOTALE" not in text[self.i].upper():
            self.i += 1
        self.i += 1

        infoList = []
        while "TOTALE" not in text[self.i].upper():
            split_text = text[self.i].split()
            nameList = ""
            while not self.is_integer(split_text[0]):
                nameList += (split_text.pop(0) + " ")
            self.lists.append(nameList.strip())
            infoList.append(split_text)
            self.i += 1

        
        return infoList

    def __getTotaleVoti(self, text, voti, seggi) -> None:
        split_text = text[self.i].split()
        voti[0] = int(split_text[1])
        seggi[0] = int(split_text[3])

    def __getType(self, text, type) -> object: 
        lista = []
        while type not in text[self.i].upper():
            self.i += 1
        text[self.i] = text[self.i].replace(",", ".")
        text[self.i] = text[self.i].replace("%", "")
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s):
                lista.append(int(s))
            else:
                try:
                    fs = float(s)
                    lista.append(fs)
                except ValueError:
                    continue
        return lista

    def __createJsonInfoList(self, infoList, voti_totali, listOfSeats) -> object:
        j = 0
        json_file = []
        while j < len(self.lists):
            votes = {}
            votes["totali"] = int(infoList[j].pop(0))
            seggiPieni = infoList[j].pop(0)
            resti = infoList[j].pop(0)
            seggiAiResti = infoList[j].pop(0)
            seggiTotali = infoList[j].pop(0)
            k = 0
            for v in infoList[j]:
                votes["seggio_n_" + str(listOfSeats[k])] = int(v)
                k = k+1
            json_file.append({
                "nome": self.lists[j],
                "seggi": {
                    "seggi_pieni": seggiPieni,
                    "resti": resti,
                    "seggi_ai_resti": seggiAiResti,
                    "seggi_totali": seggiTotali
                },
                "voti": votes
            })
            j = j+1
        json_file.append({"totale": voti_totali[0]})
        return json_file

    def __createJsonVotanti(self, listOfVoters, perc_votanti, listOfSeats) -> object:
        vot = {}
        vot["totali"] = listOfVoters.pop(0)
        vot["percentuale"] = perc_votanti
        k = 0
        for v in listOfVoters:
            vot["seggio_n_" + str(listOfSeats[k])] = v
            k = k+1
        return vot

    def __createJsonElettori(self, listOfElettori, listOfSeats) -> object:
        info_elettori = {}
        info_elettori["totali"] = listOfElettori.pop(0)
        k = 0
        for v in listOfElettori:
            info_elettori["seggio_n_" + str(listOfSeats[k])] = v
            k = k+1
        return info_elettori

    def scrapeList(self, text) -> object:
        nomeOrgano = self.__findNameOrgano(text)
        listOfSeats = self.__findListOfSeats(text)
        infoList = self.__getInfoLists(text)
        voti_totali = [1]
        seggiDaAssegnare = [1]
        self.__getTotaleVoti(text, voti_totali, seggiDaAssegnare)
        jsonInfoList = self.__createJsonInfoList(infoList, voti_totali, listOfSeats)
        
        listOfWhite = []
        schede_bianche = self.findCard("BIANCHE", text, listOfSeats, listOfWhite)

        listOfNull = []
        schede_nulle = self.findCard("NULLE", text, listOfSeats, listOfNull)

        listOfContested = []
        schede_contestate = self.findCard("CONTESTATE", text, listOfSeats, listOfContested)

        schede = self.formatSchede(schede_bianche, schede_nulle, schede_contestate, listOfWhite, listOfNull, listOfContested, listOfSeats)

        quoziente = self.getQuotient(text)
        

        listOfVoters = self.__getType(text, "VOTANTI")
        listOfElettori = self.__getType(text, "ELETTORI")
        perc_votanti = self.__getType(text, "VOTANTI")

        votanti = self.__createJsonVotanti(listOfVoters, perc_votanti[0], listOfSeats)
        infoElettori = self.__createJsonElettori(listOfElettori, listOfSeats)
        
        eletti = []
        non_eletti = []
        self.getCandidati(text, eletti, non_eletti, listOfSeats, 2)
        

        file_json = {
            "organo": nomeOrgano,
            "seggi_da_assegnare": seggiDaAssegnare[0],
            "schede": schede,
            "liste": jsonInfoList,
            "eletti": eletti,
            "non_eletti": non_eletti,
            "quoziente": quoziente,
            "votanti": votanti,
            "elettori": infoElettori
        }
        file = json.dumps(file_json)
        parsed = json.loads(file)
        return json.dumps(parsed, indent=4, sort_keys=False)
        pass