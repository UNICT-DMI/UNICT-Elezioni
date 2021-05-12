from re import split
from Target import Target
import json

@Target.register
class CNSU(Target):

    def __find_name_organo(self, text) -> str:
        nome_organo = ""
        self.word_not_in_update("ELEZIONI", text)
        nome_organo = text[self.i]
        if nome_organo[len(nome_organo) - 1] != ")":
            nome_organo += ".)"
        return nome_organo

    def __find_list_of_seats(self, text, list_of_not, seggi_da_assegnare) -> object:
        self.word_not_in_update("TOTALE SEGGI", text)
        split_text = text[self.i].split()
        seggi_da_assegnare[0] = int(split_text[2])
        count = 1
        list_of_seats = []
        for seggio in split_text[3:]:
            if seggio == '0':
                list_of_not.append(count)
            else:
                list_of_seats.append(count)
            count += 1
        return list_of_seats

    def __get_iscritti(self, text, list_of_seats) -> dict:
        self.word_not_in_update("ISCRITTI", text)
        text[self.i] = text[self.i].replace(".", '')
        split_text = text[self.i].split()
        json_file = {
            "totali": int(split_text[1]),
        }
        for seat, iscritti in zip(list_of_seats, split_text[2:]):
            json_file["seggio_n_" + str(seat)] = int(iscritti)
        return json_file

    def __get_votanti(self, text, list_of_seats) -> dict:
        self.word_not_in_update("VOTANTI", text)
        text[self.i] = text[self.i].replace(".", '')
        split_text = text[self.i].split()
        json_file = {
            "totali": int(split_text[1]),
            "percentuale": self.__get_percentuale_votanti(text, list_of_seats)['totali']
        }
        for seat, votanti in zip(list_of_seats, split_text[2:]):
            json_file["seggio_n_" + str(seat)] = int(votanti)
        return json_file

    def __get_percentuale_votanti(self, text, list_of_seats) -> dict:
        self.word_not_in_update("PERCENTUALE", text)
        text[self.i] = text[self.i].replace("Percentuale votanti --->", '')
        split_text = text[self.i].split()
        json_file = {
            "totali": int(split_text[0]),
        }
        for seat, votanti in zip(list_of_seats, split_text[1:]):
            json_file["seggio_n_" + str(seat)] = int(votanti)
        return json_file

    def __get_schede(self, type, text, list_of_seats, list_of_not, list_of_type) -> int:
        list_tmp = []
        self.word_not_in_update(type, text)
        text[self.i] = text[self.i].replace(".", '')
        split_text = text[self.i].split()
        count = 0
        for s in split_text:
            if self.is_integer(s):
                if count not in list_of_not:
                    list_tmp.append(int(s))
                count += 1
        j = len(list_of_seats) - 1
        while j>=0:
            list_of_type.append(list_tmp.pop(len(list_tmp)-(j+1)))
            j = j-1
        return list_tmp.pop(0)

    def __get_list(self, text) -> list:
        self.i += 1
        while len(text[self.i].strip()) < 10:
            self.i += 1
        t = text[self.i].replace(".", '').split("  ")
        list_info = []
        for s in t[1:]:
            if s != '':
                list_info.append(s.strip())
        return list_info
    
    def __create_json_list(self, list_of_seats, nome_lista, list_info) -> dict:
        voti = {}
        voti["totali"] = int(list_info.pop(0))
        for voto, seggio in zip(list_info, list_of_seats):
            voti["seggio_n_" + str(seggio)] = int(voto)
        return {
            "nome": nome_lista,
            "voti": voti
        }

    def __get_candidato(self, text) -> list:
        t = text[self.i].replace(".", '').split("  ")
        candidato_info = []
        for s in t:
            if s != '':
                candidato_info.append(s.strip())
        if len(candidato_info[0]) < 5:
            candidato_info.pop(0)
            if len(candidato_info[0]) < 5:
                candidato_info.pop(0)
        return candidato_info

    def __create_json_candidato(self, list_of_seats, nome_lista, nome_candidato, candidato_info) -> dict:
        voti = {}
        voti["totali"] = int(candidato_info.pop(0))
        for voto, seggio in zip(candidato_info, list_of_seats):
            voti["seggio_n_" + str(seggio)] = int(voto)
        return {
            "nominativo": nome_candidato,
            "lista": nome_lista,
            "voti": voti
        }

    def __get_info_lista(self, text, list_of_seats) -> dict:
        json_file = {
            "liste": [],
            "candidati": []
        }
        while self.i < len(text):
            if "LISTA" in text[self.i].upper():
                nome_lista = ""
                list_info = self.__get_list(text)
                nome_lista = list_info.pop(0)
                json_file["liste"].append(self.__create_json_list(list_of_seats, nome_lista, list_info))
                self.i += 1
                while "LISTA" not in text[self.i].upper() and "CNSU" not in text[self.i].upper():
                    if len(text[self.i]) > 10:
                        candidato_info = self.__get_candidato(text)
                        json_file["candidati"].append(self.__create_json_candidato(list_of_seats, nome_lista, candidato_info.pop(0), candidato_info))
                    self.i += 1
            else:
                self.i += 1
        return json_file

    def __get_quotient(self, votes, nota_votes, seats):
        votes = int(votes['totali'])
        whites = int(nota_votes['bianche']['totali'])
        wrong = int(nota_votes['nulle']['totali'])
        rejected = int(nota_votes['contestate']['totali'])
        to_assing = seats[0]
        return format((votes - (whites + wrong + rejected)) / to_assing, '.2f')
    
    def scrape_list(self, text) -> object:
        nome_organo = self.__find_name_organo(text)
        list_of_not = []
        seggi_da_assegnare = [1]
        list_of_seats = self.__find_list_of_seats(text, list_of_not, seggi_da_assegnare)
        iscritti = self.__get_iscritti(text, list_of_seats)
        votanti = self.__get_votanti(text, list_of_seats)
        # percentuale_votanti = self.__get_percentuale_votanti(text, list_of_seats)
        list_of_white = []
        schede_bianche = self.find_card("BIANCHE", text, list_of_seats, list_of_white)

        list_of_null = []
        schede_nulle = self.find_card("NULLE", text, list_of_seats, list_of_null)

        list_of_contested = []
        schede_contestate = self.find_card("CONTESTATE", text, list_of_seats, list_of_contested)

        list_of_valid = []
        schede_valide = self.__get_schede("VALIDE", text, list_of_seats, list_of_not, list_of_valid)

        list_of_votes = []
        schede_votate = self.__get_schede("VOTATE", text, list_of_seats, list_of_not, list_of_votes)

        schede = self.format_schede(schede_bianche, schede_nulle, schede_contestate, list_of_white, list_of_null, list_of_contested, list_of_seats, schede_valide, list_of_valid, schede_votate, list_of_votes)
        list_info = self.__get_info_lista(text, list_of_seats)

        file_json = {
            "organo": nome_organo,
            "seggi_da_assegnare": seggi_da_assegnare[0],
            "schede": schede,
            "iscritti": iscritti,
            "votanti": votanti,
            "quoziente": self.__get_quotient(votanti, schede, seggi_da_assegnare),
            # "percentuale_votanti": percentuale_votanti,
            "liste": list_info["liste"],
            "candidati": list_info["candidati"]
        }
        file = json.dumps(file_json)
        parsed = json.loads(file)
        return json.dumps(parsed, indent=4, sort_keys=False)