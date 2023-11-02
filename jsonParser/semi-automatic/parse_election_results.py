import csv
import json
import click
import os

@click.command()
@click.option('--input', '-i', help='Input CSV file', required=True)
@click.option('--output', '-o', help='Output JSON file', required=True)
def main(input:str, output:str):
    check_file_exists(input)
    
    # Read the CSV file
    with open(input, 'r', encoding='utf-8-sig') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=';')
        rows_list = create_list(csv_reader)
    
    # Create the dictionary that will contain the data
    data = {
        "schede": {
            "bianche": {
                "totali": 0,
                "seggio_n_telematico": 0
            },
            "nulle": {
                "totali": 0
            },
            "contestate": {
                "totali": 0
            }
        },
        "liste": [],
        "eletti": [],
        "non_eletti": [],
    }
    
    rows_list = get_name_and_seats(rows_list, data)
    rows_list = get_list_information(rows_list, data)
    rows_list = get_votation_information(rows_list, data)
    get_candidates_information(rows_list, data)

    # Convert data to JSON format
    json_output = json.dumps(data, indent=4, ensure_ascii=False)

    # Save the JSON data to a file
    with open(output, 'w', encoding='utf-8') as json_file:
        json_file.write(json_output)
        
def check_file_exists(file_path:str) -> None:
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File '{file_path}' not found")

def create_list(csv_reader:list) -> list:
    """Create a list of rows from the CSV file

    Args:
        csv_reader (list): The CSV reader

    Returns:
        list: The list of rows of the CSV file
    """
    rows_list = []
    for row in csv_reader:
        # Replace \xa0 with a space in the entire row
        row = [cell.replace('\xa0', ' ') for cell in row]
        rows_list.append(row)
    return rows_list

def get_name_and_seats(rows_list:list, data:dict) -> list:
    """Get the name of the department and the number of seats to be assigned

    Args:
        rows_list (list): The list of rows of the CSV file
        data (dict): The dictionary that will contain the data
    
    Returns:
        list: The list of rows of the CSV file
    """
    row = rows_list[0]
    data["dipartimento"] = str(row[0])
    row = rows_list[1]
    data["seggi_da_assegnare"] = row[1]
    rows_list = rows_list[4:]
    return rows_list
    
def get_list_information(rows_list:list, data:dict) -> list:
    """Get lists information

    Args:
        rows_list (list): The list of rows of the CSV file
        data (dict): The dictionary that will contain the data
    
    Returns:
        list: The list of rows of the CSV file
    """
    count = 0
    for row in rows_list:
        count += 1
        if row[0].strip() == "TOTALE":
            data["liste"].append({"totale": int(row[1].strip())})
            break
        lista = {
            "nome": str(row[0].strip()),
            "seggi": {
                "seggi_pieni": str(row[1].strip()),
                "resti": str(row[2].strip()),
                "seggi_ai_resti": str(row[3].strip()),
                "seggi_totali": str(row[4].strip())
            },
            "voti": {
                "totali": str(row[5].strip()),
                "seggio_telematico": str(row[-1].strip())
            }
        }
        data["liste"].append(lista)
    rows_list = rows_list[count:]
    return rows_list

def get_votation_information(rows_list:list, data:dict) -> list:
    """Get votation information

    Args:
        rows_list (list): The list of rows of the CSV file
        data (dict): The dictionary that will contain the data
    
    Returns:
        list: The list of rows of the CSV file
    """
    count = 0
    for row in rows_list:
        count += 1
        if "Schede Bianche" in row[0]:
            data["schede"]["bianche"]["totali"] = int(row[1])
            data["schede"]["bianche"]["seggio_n_telematico"] = int(row[-1])
        elif "Schede Nulle" in row[0]:
            data["schede"]["nulle"]["totali"] = int(row[-1])
        elif "Schede Contestate" in row[0]:
            data["schede"]["contestate"]["totali"] = int(row[-1])
        elif row[0].strip() == "QUOZIENTE":
            data["quoziente"] = float(row[1].strip().replace(",", "."))
        elif row[0].strip() == "VOTANTI":
            data["votanti"] = {
                "totali": int(row[1].strip()),
                "percentuale": float(row[4].strip().replace(",", ".")),
                "seggio_n_telematico": int(row[-1].strip())
            }
        elif row[0].strip() == "TOTALE ELETTORI AVENTI DIRITTO":
            data["elettori"] = {
                "totali": int(row[1].strip()),
                "seggio_n_telematico": int(row[1].strip())
            }
        elif row[0].strip() == "PREFERENZE CANDIDATI":
            break
    rows_list = rows_list[count:]
    return rows_list
    
def get_candidates_information(rows_list:list, data:dict) -> None:
    """Get candidates information

    Args:
        rows_list (list): The list of rows of the CSV file
        data (dict): The dictionary that will contain the data
    """
    while len(rows_list) > 0:
        row = rows_list[0]
        list_name = row[0].strip()
        rows_list = rows_list[2:]
        count = 0
        for row in rows_list:
            count += 1
            if "SEGGI" in row[0].strip():
                break
            candidate = {
                "nominativo": str(row[0].strip()),
                "lista": list_name,
                "voti": {
                    "totali": int(row[1].strip()),
                    "seggio_telematico": int(row[-4].strip())
                }
            }
            if "ELETTO" in row[3].strip():
                data["eletti"].append(candidate)
            else:
                data["non_eletti"].append(candidate)
        rows_list = rows_list[count:]
        
if __name__ == "__main__":
    main()