from sys import flags
from Target import Target
import json

@Target.register
class Medicina(Target):

    def __find_name_department(self, text) -> str:
        self.word_not_in_update("ELEZIONI", text)
        self.i += 1
        return text[self.i]

    def __get_seats(self, text) -> object:
        self.word_not_in_update("CANDIDATI", text)
        split_text = text[self.i].split()
        list_of_seats = []
        for s in split_text:
            if self.is_integer(s):
                list_of_seats.append(s)
        return list_of_seats

    def __is_eletto(self, split_text) -> bool:
        eletto = not self.is_integer(split_text[len(split_text)-1])
        if eletto:
            split_text.pop(len(split_text)-1)
        return eletto

    def __extract_voti(self, split_text, list_of_seats) -> object:
        k = 0
        result = {}
        result["totali"] = int(split_text.pop(0))
        for s in split_text:
            result["seggio_n_" + str(list_of_seats[k])] = int(s)
            k += 1
        return result

    def __get_extract_info(self, text, nome, voti, list_of_seats) -> bool:
        nome[0] = text[self.i]
        self.i += 1
        split_text = text[self.i].split()
        eletto = self.__is_eletto(split_text)
        if len(list_of_seats) + 1 < len(split_text):
            split_text.pop(0)
        voti[0] = self.__extract_voti(split_text, list_of_seats)
        self.i += 1
        return eletto
    
    def __get_candidati(self, text, list_of_seats, eletti, non_eletti) -> None:
        self.i += 1
        while self.word_not_in_control("SCHEDE", text):
            nome_candidato = [1]
            voti = [1]
            eletto = self.__get_extract_info(text, nome_candidato, voti, list_of_seats)
            e = {
                "nome_candidato": nome_candidato[0],
                "voti": voti[0]
            };
            if eletto:
                eletti.append(e)
            else:
                non_eletti.append(e)
    
    def __get_type(self, word, text) -> float:
        self.word_not_in_update(word, text)
        try:
            return float(text[self.i].split()[len(text[self.i].split())-1])
        except ValueError:
            try:
                text[self.i] = text[self.i].replace("%", " ").strip()
                text[self.i] = text[self.i].replace(",", ".")
                return float(text[self.i].split()[len(text[self.i].split())-1])
            except ValueError:
                return 0.0

    def scrape_list(self, text) -> object:
        nome_dipartimento = self.__find_name_department(text)
        list_of_seats = self.__get_seats(text)
        eletti = []
        non_eletti = []
        tmp = [1]
        schede_bianche = [1]
        schede_nulle = [1]
        schede_contestate = [1]
        totale_voti = [1]
        self.__get_candidati(text, list_of_seats, eletti, non_eletti)
        self.__get_extract_info(text, tmp, schede_bianche, list_of_seats)
        self.__get_extract_info(text, tmp, schede_nulle, list_of_seats)
        self.__get_extract_info(text, tmp, schede_contestate, list_of_seats)
        self.__get_extract_info(text, tmp, totale_voti, list_of_seats)
        aventi_diritto = int(self.__get_type("DIRITTO", text))
        perc_votanti = self.__get_type("VOTANTI", text)
        file_json = {
            "dipartimento": nome_dipartimento,
            "schede": {
                "bianche": schede_bianche[0],
                "nulle": schede_nulle[0],
                "contestate": schede_contestate[0]
            },
            "eletti": eletti,
            "non_eletti": non_eletti,
            "voti": totale_voti[0],
            "aventi_diritto": aventi_diritto,
            "perc_votanti": perc_votanti
        }
        file = json.dumps(file_json)
        parsed = json.loads(file)
        return json.dumps(parsed, indent=4, sort_keys=False)