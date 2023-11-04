from sys import flags
from typing import List
from Target import Target
import json

@Target.register
class CdlInf(Target): # or PhD

    def __control_quorum(self, text, quorum) -> bool:
        if not quorum:
            return False

        if not self.word_not_in_control("NO QUORUM", text):
            text[self.i] = text[self.i].replace("NO QUORUM", " ").strip()
            return False

        return True

    def __find_name_department(self, text, quorum) -> str:
        self.word_not_in_update("ELEZIONI", text)
        self.i += 1

        quorum[0] = self.__control_quorum(text, quorum[0])
        nome = text[self.i]

        self.i += 1
        while self.word_not_in_control("BIENNIO", text):
            if len(text[self.i]) > 5:
                quorum[0] = self.__control_quorum(text, quorum[0])
                nome += "\n" + text[self.i]
            self.i += 1

        return nome.strip()
    
    def __seggi_da_assegnare_v2(self, text: List[str]) -> int:
        voti_idx = text.index("VOTI")
        seggi = [s for s in text[:voti_idx] if self.is_integer(s)][0]
        return int(seggi)
    
    def __seggi_da_assegnare(self, text) -> int:
        split_text = text[self.i].split()
        try:
            return int(split_text[len(split_text)-1])
        except ValueError:
            self.i += 1
            split_text = text[self.i].split()
            while len(split_text) <= 0:
                self.i += 1
                split_text = text[self.i].split()
            return int(split_text[len(split_text)-1])

    def __get_year(self, text: List[str]) -> str:
        biennio = text[2].replace("BIENNIO ", "")
        year = biennio[:biennio.find("/")]
        return year
    
    def __remove_perc_or_comma(self, value: str) -> str:
        return value.replace(" ", "").replace("%", "").replace(",", ".")

    def __get_type_v2(self, type: str, text: List[str]) -> str:
        type_idx = text.index(type)
        value = self.__remove_perc_or_comma(text[type_idx+2])
        return value

    def __get_candidati(self, text: List[str], eletti, non_eletti, current_quorum) -> bool:
        year = self.__get_year(text)

        self.word_not_in_update("CANDIDATI", text)
        self.i += 1
        quorum = current_quorum

        if "DOTTORANDI" in text[0] and year == "2023":
            voti_idx = text.index("VOTI") + 1
            schede_idx = text.index("SCHEDE BIANCHE")

            candidates = [el for el in text[voti_idx:schede_idx] if el != "" ]

            idx = 0
            while idx < len(candidates)-1:
                nome_candidato = candidates[idx]
                voti_candidato = candidates[idx+1]

                e = {
                        "nome_candidato": nome_candidato.strip(),
                        "voti": int(voti_candidato)
                }

                if len(candidates) > idx+2 and candidates[idx+2].upper() == "ELETTO":
                    idx += 1
                    eletti.append(e)
                else:
                    non_eletti.append(e)

                idx += 2
            
            self.i += len(text[voti_idx:schede_idx])
        else:
            while self.word_not_in_control("SCHEDE", text):
                split_text = text[self.i].split()

                # if the line is not empty
                if len(split_text) > 0:

                    if self.is_integer(split_text[0]):
                        split_text.pop(0)

                    if len(split_text) <= 0:
                        self.i += 1
                        continue

                    nome_candidato = ""
                    voti_candidato = 0
                    eletto = False
                    for s in split_text:
                        if self.is_integer(s):
                            voti_candidato = s
                        elif "ELETTO" == s.upper():
                            eletto = True
                        else:
                            nome_candidato += (s + " ")

                    if not self.word_not_in_control("NO QUORUM", text):
                        quorum = False
                        nome_candidato = nome_candidato.replace("NO QUORUM", " ").strip()

                    if not self.word_not_in_control("EX AEQUO", text):
                        nome_candidato = nome_candidato.replace("EX AEQUO", " ").strip()

                    e = {
                            "nome_candidato": nome_candidato.strip(),
                            "voti": int(voti_candidato)
                    }

                    if eletto:
                        eletti.append(e)
                    else:
                        non_eletti.append(e)

                self.i += 1

        return quorum
    
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

    def __operation(self, text) -> object:
        year = self.__get_year(text)

        quorum = [True]
        nome_dipartimento = self.__find_name_department(text, quorum)
        
        if year == "2023":
            seggi = self.__seggi_da_assegnare_v2(text)
        else:
            seggi = self.__seggi_da_assegnare(text)

        eletti = []
        non_eletti = []
        quorum[0] = self.__get_candidati(text, eletti, non_eletti, quorum[0])

        schede_bianche = int(self.__get_type("BIANCHE", text)) # TODO use v2 for 2023

        if year != "2023":
            schede_nulle = int(self.__get_type("NULLE", text))
            schede_contestate = int(self.__get_type("CONTESTATE", text))
        else:
            schede_nulle = 0
            schede_contestate = 0

        if year == "2023":
            totale_voti = int(self.__get_type_v2("TOTALE VOTI", text))
            aventi_diritto = int(self.__get_type_v2("AVENTI DIRITTO", text))
            perc_votanti = float(self.__get_type_v2("% VOTANTI", text))
        else:
            totale_voti = int(self.__get_type("VOTI", text))
            aventi_diritto = int(self.__get_type("DIRITTO", text))
            perc_votanti = self.__get_type("VOTANTI", text)


        file_json = {
            "dipartimento": nome_dipartimento,
            "quorum": quorum[0],
            "seggi_da_assegnare": seggi,
            "schede": {
                "bianche": schede_bianche,
                "nulle": schede_nulle,
                "contestate": schede_contestate
            },
            "eletti": eletti,
            "non_eletti": non_eletti,
            "totale_voti": totale_voti,
            "aventi_diritto": aventi_diritto,
            "perc_votanti": perc_votanti
        }
        self.i += 1
        file = json.dumps(file_json)
        parsed = json.loads(file)

        if year != "2018":
            self.i = len(text)-1

        return json.dumps(parsed, indent=4, sort_keys=False)


    def scrape_list(self, text) -> object:
        result_json = []
        while self.i < len(text)-1:
            result_json.append(self.__operation(text))
        return result_json