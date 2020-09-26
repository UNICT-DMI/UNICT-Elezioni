#! /usr/bin/python3

from lxml import html
import requests
import sys
import os


start_parser = [
         "Risultati provvisori",
         "<div class=\"field-item even\"id=\"first\"><ul>", 
         "<div class=\"field-item even\"id=\"first\"><p>", 
         "<div class=\"field-items\">"
        ]
end_parser = ["</ul>", "</ul></div></div></div>", "</span></div></div></div>", "</div></div></div>"]

def is_file(filename) -> bool:
    file = filename.split(".")
    return(bool(len(file) > 1 and file[len(file)-1] == "pdf"))

def is_important(filename) -> bool:
    return(bool("CDL_B" not in filename.upper() and "INFERIORE" not in filename.upper() and "COORDIMAMENTO" not in filename.upper() and "COORDINAMENTO" not in filename.upper() and "DOTTORANDI" not in filename.upper()))

def create_json(pathname, option, command) -> None:
    print("Create JSON: " + pathname)
    os.system("python3 " + command + "parser.py " + "\"" + pathname + "\" " + option)

def sub_url(url, directory, command) -> None:
    try:
        os.makedirs(directory, mode = 0o777, exist_ok = True)
    except ValueError:
        pass
    x = requests.get(url)
    if x.status_code != 200:
        print("ERROR", x.status_code, ":", x.text)
        sys.exit(-1)
    index1 = -1
    max = -1
    for el in start_parser:
        if max < x.text.find(el):
            max = x.text.find(el)
    index1 = max
    if index1 < 0:
        print("ERROR in find substring 1")
        sys.exit(-1)
    text = x.text[index1:]
    min = sys.maxsize
    for el in end_parser:
        if min > text.find(el) and text.find(el) > 0:
            min = text.find(el)
    index2 = min
    if index2 < 0:
        print("ERROR in find substring 2")
        sys.exit(-1)
    text = text[0:index2]
    webpage = html.fromstring(text)
    for link in webpage.xpath('//a/@href'):
        if link.find("https://") < 0 and link.find("http://") < 0:
            link = "https://www.unict.it" + link
        file = link.split("/")
        if is_file(file[len(file)-1]):
            if is_important(file[len(file)-1]):
                file[len(file)-1] = file[len(file)-1].replace("%20", "_")
                file[len(file)-1] = file[len(file)-1].replace("%2", "_")
                open(directory + "/" + file[len(file)-1], "wb").write(requests.get(link).content)
                if "CONSIGLIO" in file[len(file)-1].upper() or "SENATO" in file[len(file)-1].upper() or "NUCLEO" in file[len(file)-1].upper() or "COMITATO" in file[len(file)-1].upper():
                    create_json(directory + "/" + file[len(file)-1], "other", command)
                else:
                    create_json(directory + "/" + file[len(file)-1], "0", command)
                os.unlink(directory + "/" + file[len(file)-1])
        else:
            sub_url(link, directory + "/" + file[len(file)-1], command)

def main(argv) -> None:
    if len(argv) != 3:
        print("USAGE: python3 create-json.py <url> <start_directory> <command_parser_directory>")
        sys.exit(0)
    if argv[1][len(argv[1])-1] == "/":
        argv[1] = argv[1][:-1]
    if argv[2][len(argv[2])-1] != "/":
        argv[2] += "/"
    sub_url(argv[0], argv[1], argv[2])

if __name__ == "__main__":
    main(sys.argv[1:])
