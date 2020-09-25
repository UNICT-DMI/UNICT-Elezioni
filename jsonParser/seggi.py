# -*- coding: utf-8 -*-
import json
from os import listdir
from os.path import isfile, join

anno = "2018-2020"
path = "../src/data/" + anno + "/dipartimenti/"
files = [f for f in listdir(path) if isfile(join(path, f))]

seggi = {}

for f in files:
  with open("../src/data/"+anno+"/dipartimenti/" + f) as json_file:
      data = json.load(json_file)

      seggi_n = list(data['schede']['bianche'].keys())

      # extract seggi
      for s in seggi_n[1:]:
        s = s.replace('seggio_n_', '')

        if not s in seggi:
          seggi[s] = []

        seggi[s].append(f.replace('.json', ''))

with open('seggi.json', 'w+') as fp:
    json.dump(seggi, fp, sort_keys=True, indent=4, ensure_ascii=False)
