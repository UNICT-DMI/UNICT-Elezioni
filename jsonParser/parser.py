#! /usr/bin/python3

import sys
from FormatPDF import FormatPDF
from Target import Target
from SelectTarget import SelectTarget

def error_start(argc):
    if argc != 2:
        print("USAGE: python3 parser.py <filename>.pdf <0|other>\n")
        print("`$fileName` is the name of the file from which you want extract data.")
        print("`[0|other]` indicates the type of data to parse.")
        print("\nYou shall choose `0` if you want extract data from departments pdf. Otherwise `other` if you want to extract political body.")
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

def main(argv):
    error_start(len(argv))
    formatted_text = FormatPDF.format_pdf(argv[0])
    target = SelectTarget.get_instance().get_target(argv[1])
    #print_pars(formatted_text)
    #print(argv[0])
    save_json(target.scrape_list(formatted_text), argv[0])


if __name__ == "__main__":
    main(sys.argv[1:])