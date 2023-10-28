import json

def create_file_name(s, path) -> str:
    input_path = ""

    file_name = ''
    with open(s, "r") as f:
        file_name = f.readlines()[1].replace('    "dipartimento": "', '').replace('",', '')

    file_name = file_name.replace(",", '').replace(" ", "_").replace("/", "_").strip().lower().split("\n")[0] + ".json"
    tmp = ""
    for p in path:
        tmp += p
        if p == "/":
            input_path = tmp
    file_path = input_path + file_name
    file_path = file_path.replace("dipartimento_di_", "")
    file_path = file_path[2].upper() + file_path[3:]
    return file_path

import os
files = [f for f in os.listdir('.') if os.path.isfile(f)]
for f in files:
    if ".json" in f:
        print(f)
        file_name = create_file_name(f, './')
        print(file_name)
        os.rename(f, file_name)
