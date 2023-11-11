import os

# usage: put this script inside the json directory and run it
# change the param cdl_less_500 based on what you are doing

def create_file_name(s, path, cdl_less_500: bool = False) -> str:
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

    if cdl_less_500:
        # todo: verify name mismatch
        names = file_path.split('-')
        if "magistrale" in file_path:
            file_path = names[0] + '_magistrale.json'
        else:
            file_path = names[0] + '.json'
        return file_path.lower()

    return file_path

files = [f for f in os.listdir('.') if os.path.isfile(f)]
for f in files:
    if ".json" in f:
        print(f)
        file_name = create_file_name(f, './', True)
        print(file_name)
        os.rename(f, file_name)
