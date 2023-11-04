import sys
from typing import List
from Target import Target
import json

from parser import create_file_name, error_start, save_json

class Cdl:

    def is_integer(self, n) -> None:
        """Thos method verify if n is an Integer"""
        try:
            fn = float(n)
            return fn.is_integer()
        except ValueError:
            return False

    def __find_name_department(self, text: List[str]) -> str:
        for i in range(len(text)):
            if text[i].find("ELEZIONI") != -1:
                nome = text[i+1]
                return nome.strip()
        
    def __seggi_da_assegnare_v2(self, text: List[str]) -> int:
        voti_idx = text.index("VOTI")
        seggi = [s for s in text[:voti_idx] if self.is_integer(s)][0]
        return int(seggi)

    def __get_year(self, text: List[str]) -> str:
        for t in text:
            if t.find("BIENNIO") != -1:
                biennio = t.replace("BIENNIO ", "")
                break

        year = biennio[:biennio.find("/")]
        return year

    def __remove_perc_or_comma(self, value: str) -> str:
        return value.replace(" ", "").replace("%", "").replace(",", ".")

    def __get_type_v2(self, type: str, text: List[str]) -> str:
        print(text)
        type_idx = text.index(type)
        value = self.__remove_perc_or_comma(text[type_idx+2])
        return value

    def __get_candidati(self, text: List[str], eletti, non_eletti, current_quorum) -> bool:
        year = self.__get_year(text)

        quorum = current_quorum

        if int(year) >= 2023: # and "DOTTORANDI" in text[0]
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
            
            # self.i += len(text[voti_idx:schede_idx])

        return quorum


    def operation(self, text) -> object:
        year = self.__get_year(text)

        quorum = [True]
        nome_dipartimento = self.__find_name_department(text)
        
        if int(year) >= 2023:
            seggi = self.__seggi_da_assegnare_v2(text)
        else:
            seggi = self.__seggi_da_assegnare(text)

        eletti = []
        non_eletti = []
        quorum[0] = self.__get_candidati(text, eletti, non_eletti, quorum[0])


        if int(year) >= 2023:
            perc_votanti = float(self.__get_type_v2("% VOTANTI", text))

            schede_nulle = 0
            schede_contestate = 0

            if perc_votanti < 15:
                quorum[0] = False
                schede_bianche = 0
                totale_voti = 0

                for non_eletto in non_eletti:
                    non_eletto["voti"] = 0

            else:
                schede_bianche = int(self.__get_type_v2("SCHEDE BIANCHE", text))
                totale_voti = int(self.__get_type_v2("TOTALE VOTI", text))

            aventi_diritto = int(self.__get_type_v2("AVENTI DIRITTO", text))

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

        # self.i += 1
        file = json.dumps(file_json)
        parsed = json.loads(file)

        return json.dumps(parsed, indent=4, sort_keys=False)


    # def scrape_list(self, text) -> object:
    #     result_json = []
    #     while self.i < len(text)-1:
    #         result_json.append(self.__operation(text))
    #     return result_json


# def main(argv: List[str]) -> None:
#     error_start(len(argv))

#     formatted_text = FormatPDF.format_pdf(argv[0])
#     target = SelectTarget.get_instance().get_target(argv[1])

#     str_json = target.scrape_list(formatted_text)
#     # print(str_json)

#     if isinstance(str_json, list):
#         for s in str_json:
#             if len(str_json) > 1:
#                 input_path = create_file_name(s, argv[0])
#                 save_json(s, input_path)
#             else:
#                 save_json(s, argv[0])
#     else:
#         save_json(str_json, argv[0])

def main() -> None:
    with open("CDL_B.txt", "r") as f:
        file_content = f.read()

    target = Cdl()

    multi_text = file_content.split("")

    for i in range(len(multi_text)):
        text = multi_text[i]
        text = text.split("\n")
        print("\n".join(text))
        print(target.operation(text))

        if i == 2:
            break

if __name__ == "__main__":
    # main(sys.argv[1:])
    main()
