#! /usr/bin/python3

from re import split
import sys
import json
from FormatPDF import FormatPDF
from Target import Target
from SelectTarget import SelectTarget

def error_start(argc):
    if argc != 2:
        print("USAGE: python3 parser.py <filename>.pdf <0|1|2|3|other>\n")
        print("`$fileName` is the name of the file from which you want extract data.")
        print("`[0|1|2|3|other]` indicates the type of data to parse.")
        print("\nYou shall choose:\n")
        print("· `0` if you want to extract departments and CdL with a number of student greater than 500.\n")
        print("· `1` if you want to extract CdL with a number of student fewer than 500.\n")
        print("· `2` if you want to extract Medicine election.\n")
        print("· `3` if you want to extract CSNU.\n")
        print("· `other` if you want to extract political body.")
        sys.exit(-1)

def print_pars(text):
    for x in text:
        print(x)
    
def save_json(str_json, filename_pdf):
    filename = filename_pdf.replace("pdf", "json")
    with open(filename, "w") as f:
        f.write(str_json)
        f.close()
    print("JSON file has been created.")

def create_file_name(s, path) -> str:
    input_path = ""
    data = json.loads(s)
    file_name = data["dipartimento"]
    file_name = file_name.replace(",", '').replace(" ", "_").replace("/", "_").strip().lower().split("\n")[0] + ".pdf"
    tmp = ""
    for p in path:
        tmp += p
        if p == "/":
            input_path = tmp
    return input_path + file_name

def main(argv):
    error_start(len(argv))
    formatted_text = FormatPDF.format_pdf(argv[0])
    target = SelectTarget.get_instance().get_target(argv[1])
    #print_pars(formatted_text)
    #print(len(formatted_text))
    #print(argv[0])
    str_json = target.scrape_list(formatted_text)
    #print(str_json)
    if isinstance(str_json, list):
        for s in str_json:
            if len(str_json) > 1:
                input_path = create_file_name(s, argv[0])
                save_json(s, input_path)
            else:
                save_json(s, argv[0])
    else:
        save_json(str_json, argv[0])

if __name__ == "__main__":
    main(sys.argv[1:])