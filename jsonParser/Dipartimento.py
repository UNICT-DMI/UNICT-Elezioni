from Target import Target
import json

class Dipartimento(Target):

    def __find_name_department(self, text) -> str:
        nome = text[1]
        self.i = 2
        while "BIENNIO" not in text[self.i].upper() and "VOTI DI LISTA" not in text[self.i].upper():
            nome += "\n" + text[self.i]
            self.i += 1
        return nome
        
    def __find_info_lists(self, text) -> None:
        while "L I S T E" not in text[self.i].upper():
            self.i += 1
        self.i += 1

    def __get_seats(self, text) -> object:
        list_of_seats = []
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s):
                list_of_seats.append(int(s))
        self.i += 1
        return list_of_seats

    def __get_info_lists(self, text, list_of_seats, seggi_da_assegnare) -> object:
        info_lists = []
        while("TOTALE" not in text[self.i]):
            seats = []
            name_of_list = ""
            vote_of_list = 0
            find_vote = False
            split_text = text[self.i].split()
            for s in split_text:
                if not self.is_integer(s) and not find_vote:
                    name_of_list += (s + " ")
                elif find_vote == False:
                    try:
                        int_s = int(s)
                        vote_of_list = int_s
                        self.lists.append(name_of_list.strip())
                        find_vote = True
                    except ValueError:
                        name_of_list += (s + " ")
                else:
                    seats.append(s)
            
            votes = {}
            votes["totali"] = vote_of_list
            j = len(list_of_seats)-1
            k = 0
            while j>=0:
                votes["seggio_n_" + str(list_of_seats[k])] = int(seats.pop(len(seats)-(j+1)))
                k += 1
                j = j-1
            info_lists.append({
                "nome": name_of_list.strip(), 
                "seggi": {
                    "seggi_pieni": seats.pop(0),
                    "resti": seats.pop(0),
                    "seggi_ai_resti": seats.pop(0),
                    "seggi_totali": seats.pop(0)
                    },
                    "voti": votes
            })
            self.i += 1
        
        tmp = text[self.i].split()
        info_lists.append({"totale": int(tmp[1])})
        seggi_da_assegnare[0] = tmp[len(tmp)-1]
        self.i += 1
        return info_lists

    def __getVotanti(self, text, list_of_seats) -> object:
        list_of_voters = []
        while "VOTANTI" not in text[self.i].upper():
            self.i += 1
        text[self.i] = text[self.i].replace(",", ".")
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s):
                ssplit = s.split(".")
                list_of_voters.append(int(ssplit[0]))
            else:
                try:
                    fs = float(s)
                    list_of_voters.append(fs)
                except ValueError:
                    continue
        votanti = list_of_voters.pop(0)
        votanti_perc = list_of_voters.pop(0)

        vot = {}
        vot["totali"] = votanti
        vot["percentuale"] = votanti_perc
        k = 0
        for v in list_of_voters:
            vot["seggio_n_" + str(list_of_seats[k])] = v
            k += 1
        return vot
    
    def __getInfoElettori(self, text, list_of_seats) -> object:
        while "ELETTORI" not in text[self.i].upper():
            self.i += 1
        
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s):
                totale_elettori = int(s)
                break
        self.i += 1
        
        while "ELETTORI" not in text[self.i].upper():
            self.i += 1
        
        elettori_per_seggio = []
        split_text = text[self.i].split()
        for s in split_text:
            if self.is_integer(s):
                elettori_per_seggio.append(int(s))

        info_elettori = {}
        info_elettori["totali"] = totale_elettori
        k = 0
        for v in elettori_per_seggio:
            info_elettori["seggio_n_" + str(list_of_seats[k])] = v
            k += 1
        return info_elettori


    def scrape_list(self, text) -> object:
        nome_dipartimento = self.__find_name_department(text)
        seggi_da_assegnare = [1]
        self.__find_info_lists(text)
        list_of_seats = self.__get_seats(text)
        info_lists = self.__get_info_lists(text, list_of_seats, seggi_da_assegnare)

        list_of_white = []
        schede_bianche = self.find_card("BIANCHE", text, list_of_seats, list_of_white)

        list_of_null = []
        schede_nulle = self.find_card("NULLE", text, list_of_seats, list_of_null)

        list_of_contested = []
        schede_contestate = self.find_card("CONTESTATE", text, list_of_seats, list_of_contested)

        schede = self.format_schede(schede_bianche, schede_nulle, schede_contestate, list_of_white, list_of_null, list_of_contested, list_of_seats)
        
        quoziente = self.get_quotient(text)
        
        votanti = self.__getVotanti(text, list_of_seats)
        info_elettori = self.__getInfoElettori(text, list_of_seats)

        eletti = []
        non_eletti = []
        self.get_candidati(text, eletti, non_eletti, list_of_seats, 1)

        file_json = {
            "dipartimento": nome_dipartimento,
            "seggi_da_assegnare": seggi_da_assegnare[0],
            "schede": schede,
            "liste": info_lists,
            "eletti": eletti,
            "non_eletti": non_eletti,
            "quoziente": quoziente,
            "votanti": votanti,
            "elettori": info_elettori
        }
        file = json.dumps(file_json)
        parsed = json.loads(file)
        return json.dumps(parsed, indent=4, sort_keys=False)