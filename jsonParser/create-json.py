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

match1 = ["CONSIGLIO", "SENATO", "NUCLEO", "COMITATO"]
match2 = ["DOTTORANDI", "CDL_B", "INFERIORE"]
match3 = ["COORDIMAMENTO", "COORDINAMENTO"]

def is_file(filename) -> bool:
    file = filename.split(".")
    return(bool(len(file) > 1 and file[len(file)-1] == "pdf"))

def create_json(pathname, option, command) -> None:
    print("Create JSON: " + pathname)
    status = os.system("python3 " + command + "parser.py " + "\"" + pathname + "\" " + option)
    if os.WEXITSTATUS(status) > 0:
        print("I try to create the file again: " + pathname)
        os.system("python3 " + command + "parser.py " + "\"" + pathname + "\" 0")

def sub_url(url: str, directory: str, command: str) -> None:
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

    # download every pdf in page
    for link in webpage.xpath('//a/@href'):
        if link.find("https://") == -1 and link.find("http://") == -1:
            link = "https://www.unict.it" + link

        file = link.split("/")
        f = file[len(file)-1]
        if is_file(f):
            f = f.replace("%20", "_")
            f = f.replace("%2", "_")
            
            open(directory + "/" + f, "wb").write(requests.get(link).content)
            if any(s in f.upper() for s in match1):
                create_json(directory + "/" + f, "other", command)
            elif any(s in f.upper() for s in match3):
                create_json(directory + "/" + f, "2", command)
            elif any(s in f.upper() for s in match2):
                create_json(directory + "/" + f, "1", command)
            else:
                create_json(directory + "/" + f, "0", command)
            #os.unlink(directory + "/" + f)
        else:
            sub_url(link, directory + "/" + f, command)

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
