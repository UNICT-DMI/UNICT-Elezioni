from abc import ABC, abstractmethod
import json

class Target(ABC):

    i = 0
    lists = []

    def scrape_list(self, text) -> object:
        """This method permits to create a JSON."""
        pass

    def is_integer(self, n) -> None:
        """Thos method verify if n is an Integer"""
        try:
            fn = float(n)
            return fn.is_integer()
        except ValueError:
            return False
            
    
    def find_card(self, type, text, list_of_seats, list_of_type) -> int:
        list_tmp = []
        while type not in text[self.i].upper():
            self.i += 1
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s):
                list_tmp.append(int(s))
        j = len(list_of_seats) - 1
        while j>=0:
            list_of_type.append(list_tmp.pop(len(list_tmp)-(j+1)))
            j = j-1
        return list_tmp.pop(0)

    def __scheda(self, type, schede_type, list_of_type, list_of_seats) -> None:
        type["totali"] = schede_type
        k = 0
        for v in list_of_type:
            type["seggio_n_" + str(list_of_seats[k])] = v
            k += 1
    
    def format_schede(self, schede_bianche, schede_nulle, schede_contestate, list_of_white, list_of_null, list_of_contested, list_of_seats) -> object:
        bianche = {}
        nulle = {}
        contestate = {}

        self.__scheda(bianche, schede_bianche, list_of_white, list_of_seats)
        self.__scheda(nulle, schede_nulle, list_of_null, list_of_seats)
        self.__scheda(contestate, schede_contestate, list_of_contested, list_of_seats)
        
        schede = {
            "bianche": bianche,
            "nulle": nulle,
            "contestate": contestate
        }
        return schede
    
    def get_quotient(self, text) -> int:
        while("QUOZIENTE" not in text[self.i].upper()):
            self.i += 1
        text[self.i] = text[self.i].replace(",", ".")
        split_text = text[self.i].split()
        quoziente = -1
        for s in split_text:
            try:
                fs = float(s)
                quoziente = fs
                break
            except ValueError:
                continue
    
        if quoziente == -1:
            for s in split_text:
                try:
                    int_s = int(s)
                    quoziente = int_s
                    break
                except ValueError:
                    continue
                    
        return quoziente

    def __get_info_candidato(self, split_text, list_of_seats_vote, vote_of_candidate) -> str:
        name_of_candidate = ""
        find_name = False
        for s in split_text:
            if self.is_integer(s):
                find_name = True
                list_of_seats_vote.append(int(s))
            else:
                if not find_name:
                    name_of_candidate += (s + " ")
        if len(list_of_seats_vote) > 0:
            vote_of_candidate[0] = list_of_seats_vote.pop(0)
        else:
            name_of_candidate = "<fine>"
        return name_of_candidate
            

    def get_candidati(self, text, eletti, non_eletti, list_of_seats, index) -> None:
        while "PREFERENZE" not in text[self.i].upper():
            self.i += 1
        self.i += 1

        num_lists = len(self.lists)
        j = 1
        while j <= num_lists:
            while ("L"+str(j)) not in text[self.i]:
                self.i += 1
            self.i = self.i + index
            while "SCRUTINATI" not in text[self.i]:
                vote_of_candidate = [1]
                list_of_seats_vote = []
                split_text = text[self.i].split()
                name_of_candidate = self.__get_info_candidato(split_text, list_of_seats_vote, vote_of_candidate)
                if name_of_candidate == "<fine>":
                    break
                candidato = {}
                candidato["nominativo"] = name_of_candidate.strip()
                candidato["lista"] = self.lists[j-1]
                
                voti = {}
                voti["totali"] = vote_of_candidate[0]
                k = 0
                for v in list_of_seats_vote:
                    voti["seggio_n_" + str(list_of_seats[k])] = v
                    k += 1
                candidato["voti"] = voti
                if "ELETTO" in text[self.i].upper():
                    eletti.append(candidato)
                else:
                    non_eletti.append(candidato)
                self.i += 1
            j = j+1