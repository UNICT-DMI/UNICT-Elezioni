from Target import Target
import json

@Target.register
class Organo(Target):

    def __find_name_organo(self, text) -> str:
        nome_organo = ""
        while self.word_not_in_control("IN SENO", text):
            if self.word_not_in_control("AGGIORNAMENTO", text):
                nome_organo += (text[self.i].upper() + " ")
            self.i += 1
        nome_organo += (text[self.i].upper() + " ")
        self.i += 1
        if not self.word_not_in_control("ERSU", text):
            nome_organo += (text[self.i].upper() + " ")
        return nome_organo.strip()

    def __automatic_control1(self, index, text) -> bool:
        return bool(index < len(text) and text[index] == "d")

    def __automatic_control2(self, find_d, list_of_seats, list_of_not, num) -> None:
        if find_d:
            list_of_seats.append(int(num))
        else:
            list_of_not.append(int(num))

    def __find_list_of_seats_automatic(self, text1, text2, list_of_not) -> object:
        list_of_seats = []
        j = 0
        num = ""
        find_d = False
        len_text = len(text1)
        while j < len_text:
            if self.is_integer(text1[j]):
                num += text1[j]
                if not find_d:
                    find_d = self.__automatic_control1(j, text2)
            elif num != "":
                self.__automatic_control2(find_d, list_of_seats, list_of_not, num)
                num = ""
                find_d = False
            elif not find_d:
                find_d = self.__automatic_control1(j, text2)
            j += 1
        if num != "":
            self.__automatic_control2(find_d, list_of_seats, list_of_not, num)
        return list_of_seats

    def __find_list_of_seats_manual(self, text1, list_of_not) -> object:
        list_of_seats = []
        list_support = []
        num_seggi_non_considerati = -1
        while num_seggi_non_considerati != 0 and self.is_integer(num_seggi_non_considerati):
            print("Inserisci il numero del seggio da non considerare (0 o un qualunque carattere per uscire):")
            try:
                num_seggi_non_considerati = int(input())
                list_support.append(num_seggi_non_considerati)
            except ValueError:
                break
        split_text = text1.split()
        for s in split_text:
            if self.is_integer(s):
                if int(s) not in list_support:
                    list_of_seats.append(int(s))
                else:
                    list_of_not.append(int(s))
        return list_of_seats


    def __find_list_of_seats(self, text, list_of_not) -> object:
        self.word_not_in_update("LISTE", text)
        sub = " "
        for s in text[self.i]:
            if self.is_integer(s):
                break
            sub += s
        text1 = text[self.i].replace(sub.strip(), " ").strip()
        text2 = text[self.i-1]
        if "d" in text2:
            return self.__find_list_of_seats_automatic(text1, text2, list_of_not)
        else:
            return self.__find_list_of_seats_manual(text1, list_of_not)

    def __get_name_list(self, text, split_text) -> str:
        name_list = ""
        while not self.is_integer(split_text[0][0]):
            name_list += (split_text[0].pop(0) + " ")
            if len(split_text[0]) <= 0:
                self.i += 1
                split_text[0] = text[self.i].split()
                name_list += self.__get_name_list(text, split_text)
                return name_list
        return name_list

    def __get_info_lists(self, text) -> object:
        self.word_not_in_update("TOTALE", text)
        self.i += 1
        info_list = []
        while self.word_not_in_control("TOTALE", text):
            split_text = [1]
            split_text[0] = text[self.i].split()
            name_list = self.__get_name_list(text, split_text)
            self.lists.append(name_list.strip())
            info_list.append(split_text[0])
            self.i += 1
        return info_list

    def __get_totale_voti(self, text, voti, seggi) -> None:
        split_text = text[self.i].split()
        voti[0] = int(split_text[1])
        seggi[0] = int(split_text[3])

    def __get_type(self, text, type) -> object:
        lista = []
        while self.word_not_in_control(type, text):
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

    def __support_extract(self, main_list, list_of_seats, list_of_not, secondary_list) -> None:
        list_support = []
        k = 0
        for v in main_list:
            if len(list_of_not) > 0:
                if list_of_not[0]-1 != k:
                    if k in list_of_seats and "seggio_n_" + str(list_of_seats[k]) in secondary_list:
                        secondary_list["seggio_n_" + str(list_of_seats[k])] = int(v)
                    k += 1
                else:
                    list_support.append(list_of_not.pop(0))
            else:
                if k in list_of_seats and "seggio_n_" + str(list_of_seats[k]) in secondary_list:
                    secondary_list["seggio_n_" + str(list_of_seats[k])] = int(v)
                k += 1
        for el in list_support:
            list_of_not.append(el)
            list_support.pop(0)

    def __create_json_info_list(self, info_list, voti_totali, list_of_seats, list_of_not) -> object:
        j = 0
        json_file = []
        while j < len(self.lists):
            votes = {}
            votes["totali"] = int(info_list[j].pop(0))
            seggi_pieni = info_list[j].pop(0)
            resti = info_list[j].pop(0)
            seggi_ai_resti = info_list[j].pop(0)
            seggi_totali = info_list[j].pop(0)
            k = 0
            if len(info_list[j]) == len(list_of_seats):
                for v in info_list[j]:
                    if k in list_of_seats and "seggio_n_" + str(list_of_seats[k]) in votes:
                        votes["seggio_n_" + str(list_of_seats[k])] = int(v)
                    k += 1
            else:
                self.__support_extract(info_list[j], list_of_seats, list_of_not, votes)
            json_file.append({
                "nome": self.lists[j],
                "seggi": {
                    "seggi_pieni": seggi_pieni,
                    "resti": resti,
                    "seggi_ai_resti": seggi_ai_resti,
                    "seggi_totali": seggi_totali
                },
                "voti": votes
            })
            j = j+1
        json_file.append({"totale": voti_totali[0]})
        return json_file

    def __create_json_votanti(self, list_of_voters, perc_votanti, list_of_seats, list_of_not) -> object:
        vot = {}
        vot["totali"] = list_of_voters.pop(0)
        vot["percentuale"] = perc_votanti
        k = 0
        if len(list_of_voters) == len(list_of_seats):
            for v in list_of_voters:
                if k in list_of_seats and "seggio_n_" + str(list_of_seats[k]) in vot:
                    vot["seggio_n_" + str(list_of_seats[k])] = int(v)
                k += 1
        else:
            self.__support_extract(list_of_voters, list_of_seats, list_of_not, vot)
        return vot

    def __create_json_elettori(self, list_of_elettori, list_of_seats, list_of_not) -> object:
        info_elettori = {}
        info_elettori["totali"] = list_of_elettori.pop(0)
        k = 0
        if len(list_of_elettori) == len(list_of_seats):
            for v in list_of_elettori:
                if k in list_of_seats and "seggio_n_" + str(list_of_seats[k]) in info_elettori:
                    info_elettori["seggio_n_" + str(list_of_seats[k])] = int(v)
                k += 1
        else:
            self.__support_extract(list_of_elettori, list_of_seats, list_of_not, info_elettori)
        return info_elettori

    def scrape_list(self, text) -> object:
        nome_organo = self.__find_name_organo(text)
        list_of_not = []
        list_of_seats = self.__find_list_of_seats(text, list_of_not)
        info_list = self.__get_info_lists(text)
        voti_totali = [1]
        seggi_da_assegnare = [1]
        self.__get_totale_voti(text, voti_totali, seggi_da_assegnare)
        json_info_list = self.__create_json_info_list(info_list, voti_totali, list_of_seats, list_of_not)
        list_of_white = []
        schede_bianche = self.find_card("BIANCHE", text, list_of_seats, list_of_white)

        list_of_null = []
        schede_nulle = self.find_card("NULLE", text, list_of_seats, list_of_null)

        list_of_contested = []
        schede_contestate = self.find_card("CONTESTATE", text, list_of_seats, list_of_contested)

        schede = self.format_schede(schede_bianche, schede_nulle, schede_contestate, list_of_white, list_of_null, list_of_contested, list_of_seats)

        quoziente = self.get_quotient(text)


        list_of_voters = self.__get_type(text, "VOTANTI")
        list_of_elettori = self.__get_type(text, "ELETTORI")
        perc_votanti = self.__get_type(text, "VOTANTI")

        votanti = self.__create_json_votanti(list_of_voters, perc_votanti[0], list_of_seats, list_of_not)
        info_elettori = self.__create_json_elettori(list_of_elettori, list_of_seats, list_of_not)

        eletti = []
        non_eletti = []
        self.get_candidati(text, eletti, non_eletti, list_of_seats, 2)


        file_json = {
            "organo": nome_organo,
            "seggi_da_assegnare": seggi_da_assegnare[0],
            "schede": schede,
            "liste": json_info_list,
            "eletti": eletti,
            "non_eletti": non_eletti,
            "quoziente": quoziente,
            "votanti": votanti,
            "elettori": info_elettori
        }
        file = json.dumps(file_json)
        parsed = json.loads(file)
        return json.dumps(parsed, indent=4, sort_keys=False)