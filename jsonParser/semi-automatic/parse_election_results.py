import json
import click
import os
import csv
from typing import List
from glob import glob

@click.command()
@click.option('--input', '-i', help='Input CSV file or path with CSV files', required=True)
@click.option('--output', '-o', help='Output JSON file or folder', required=True)
def main(input:str, output:str):
    check_file_exists(input)
    
    input_files = []
    output_files = []
    if os.path.isdir(input):
        input_files = glob(input + "/*.csv")
        if len(input_files) == 0:
            input_files = glob(input + "/*/*.csv")
            if len(input_files) == 0:
                raise FileNotFoundError(f"No CSV files found in '{input}'")
        for file in input_files:
            output_files.append(os.path.join(output, file.split("/")[-1].replace(".csv", ".json")))
    else:
        input_files.append(input)
        output_files.append(output)
        
    for input, output in zip(input_files, output_files):
        print(f"Creating JSON file '{output}' from CSV file '{input}'...")
        create_json_file(input, output)
        print("#"*50)

def create_json_file(input:str, output:str) -> None:
    # Read the CSV file
    with open(input, 'r', encoding='utf-8-sig') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
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
    if not os.path.isfile(file_path) and not os.path.isdir(file_path):
        raise FileNotFoundError(f"File '{file_path}' not found")

def create_list(csv_reader:List[str]) -> List[str]:
    """Create a list of rows from the CSV file

    Args:
        csv_reader (list): The CSV reader

    Returns:
        list: The list of rows of the CSV file
    """
    rows_list = []
    for line in csv_reader:
        for i in range(len(line)):
            line[i] = line[i].replace("\"", "").replace("\n", "").replace("\xa0", " ").replace("Evaluation Only. Created with Aspose.PDF. Copyright 2002-2023 Aspose Pty Ltd.", "")
        if len(line) == 1 and (line[0] == "" or line[0] == "VOTI DI LISTA" or line[0] == "BIENNIO 2023/2025" or "ELEZIONI RAPPRESENTANTI" in line[0]):
            continue
        if line[0] == "VOTI DI LISTA" or line[0] == "BIENNIO 2023/2025" or "ELEZIONI RAPPRESENTANTI" in line[0]:
            continue
        line = [x.strip() for x in line if x.strip() != "" and "aequo" not in x.strip()]
        if len(line) == 0:
            continue
        if "DIPARTIMENTO" in line[0]:
            l = " ".join(line)
            line = [l.split("-")[0].strip()]
        if len(line) > 1:
            if line[1] in line[0]:
                line[0] = line[0].replace(line[1], "")
                line.append(line[1])
        rows_list.append(line)
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
    print(row)
    data["dipartimento"] = str(row[0])
    row = rows_list[1]
    print(row)
    data["seggi_da_assegnare"] = row[1]
    rows_list = rows_list[4:]
    return rows_list
    
def get_list_information(rows_list: list, data: dict) -> list:

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
        print(row)
        lista = {
            "nome": str(row[0].strip()),
            "seggi": {
                "seggi_pieni": str(row[2].strip()),
                "resti": str(row[3].strip()),
                "seggi_ai_resti": str(row[4].strip()),
                "seggi_totali": str(row[5].strip())
            },
            "voti": {
                "totali": str(row[1].strip()),
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
                "percentuale": float(row[3].strip().replace(",", ".")),
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
                    "seggio_telematico": int(row[-1].strip())
                }
            }
            if "ELETTO" in row:
                data["eletti"].append(candidate)
            else:
                data["non_eletti"].append(candidate)
        rows_list = rows_list[count:]
        
if __name__ == "__main__":
    main()