from abc import ABC, abstractmethod
import json

class Target(ABC):

    i = 0
    lists = []

    def scrapeLists(self, text) -> object:
        """This method permits to create a JSON."""
        pass

    def is_integer(self, n):
        """Thos method verify if n is an Integer"""
        try:
            float(n)
        except ValueError:
            return False
        else:
            return float(n).is_integer()
    
    def findCard(self, type, text, listOfSeats, listOfType) -> int:
        listTmp = []
        while type not in text[self.i].upper():
            self.i = self.i + 1
        split_text = text[self.i].split()
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
    
    def formatSchede(self, schede_bianche, schede_nulle, schede_contestate, listOfWhite, listOfNull, listOfContested, listOfSeats) -> object:
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
    
    def getQuotient(self, text) -> int:
        while("QUOZIENTE" not in text[self.i].upper()):
            self.i = self.i + 1
        text[self.i] = text[self.i].replace(",", ".")
        split_text = text[self.i].split()
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

    def __getInfoCandidato(self, split_text, listOfSeatsVote, voteOfCandidate) -> str:
        nameOfCandidate = ""
        findName = False
        for s in split_text:
            if self.is_integer(s) == False and findName == False:
                nameOfCandidate += (s + " ")
            elif self.is_integer(s) == True:
                findName = True
                listOfSeatsVote.append(int(s))
        if len(listOfSeatsVote) > 0:
            voteOfCandidate[0] = listOfSeatsVote.pop(0)
        else:
            nameOfCandidate = "<fine>"
        return nameOfCandidate
            

    def getCandidati(self, text, eletti, non_eletti, listOfSeats, index):
        while "PREFERENZE" not in text[self.i].upper():
            self.i = self.i + 1
        self.i = self.i + 1

        num_lists = len(self.lists)
        j = 1
        while j <= num_lists:
            while ("L"+str(j)) not in text[self.i]:
                self.i = self.i + 1
            self.i = self.i + index
            while "SCRUTINATI" not in text[self.i]:
                voteOfCandidate = [1]
                listOfSeatsVote = []
                split_text = text[self.i].split()
                nameOfCandidate = self.__getInfoCandidato(split_text, listOfSeatsVote, voteOfCandidate)
                if nameOfCandidate == "<fine>":
                    break
                candidato = {}
                candidato["nominativo"] = nameOfCandidate.strip()
                candidato["lista"] = self.lists[j-1]
                
                voti = {}
                voti["totali"] = voteOfCandidate[0]
                k = 0
                for v in listOfSeatsVote:
                    voti["seggio_n_" + str(listOfSeats[k])] = v
                    k = k+1
                candidato["voti"] = voti
                if "ELETTO" in text[self.i].upper():
                    eletti.append(candidato)
                else:
                    non_eletti.append(candidato)
                self.i = self.i + 1
            j = j+1