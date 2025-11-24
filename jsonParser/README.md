# UNICT-Elezioni parser

### UPDATE 2025

Today it's better to use Gemini and ask for extracting the data from the PDF, one of the best way of doing this, is:

- convert the PDF to text using `pdftotext input.pdf`
- convert the PDF to images using `pdftoppm input.pdf outputname -png -rx 300 -ry 300`
- send to Gemini 3 all the files PDF, txt and png asking to generate a JSON file including the data

---

## Table of contents

- **[Json Parser](#json-parser)**
- **[Requirements](#requirements)**
- **[Usage](#usage)**
- **[Usage with docker](#usage-with-docker)**

---

## Json Parser

Json Parser allows you to create JSON files of the elections concerning the University of Catania.

## Requirements

If you don't want to install anything go **[here](#usage-with-docker)**.

- **[lxml](https://pypi.org/project/lxml/)**

  ```bash
  pip install lxml
  ```

- **[pdftotext](https://pypi.org/project/pdftotext/)**

  - **Os Dependencies**

    - Debian, Ubuntu and friends

      ```bash
      sudo apt install build-essential libpoppler-cpp-dev pkg-config python3-dev
      ```

    - Fedora, Red Hat and friends

      ```bash
      sudo yum install gcc-c++ pkgconfig poppler-cpp-devel python3-devel
      ```

    ```bash
    pip install pdftotext
    ```

## Usage

- _parser.py_

  ```bash
  python3 parser.py $fileName [0|1|2|3|other]
  ```

  `$fileName` is the name of the file from which you want extract data.

  `[0|1|2|3|other]` indicates the type of data to parse.

  You shall choose:

  · `0` if you want to extract departments and CdL with a number of student greater than 500.

  · `1` if you want to extract CdL with a number of student fewer than 500 or PhD student elections.

  · `2` if you want to extract Medicine election.

  · `3` if you want to extract CNSU.

  · `other` if you want to extract political body.

- _create-json.py_

  ```bash
  python3 create-json.py $url $start_directory $parser_directory
  ```

  `$url` must be:

  - https://www.unict.it/it/ateneo/elezioni-studentesche-biennio-20182020
  - https://www.unict.it/ateneo/risultati-provvisori

  `$start_directory` is the directory where you want to store all JSON files.

  `$parser_directory` is the directory where is stored _parser.py_.

## Usage with docker

This project has a `docker-compose.yml` , so if you have docker-composer you can run the following command:

```bash
docker-compose up --build
```

otherwise, you can run this command:

```bash
docker build --tag unict-elezioni/parser .
```

- _parser.py_

  ```bash
  docker run -itv $path/:/etc/parser/disk unict-elezioni/parser ./code/parser.py ./disk/$fileName [0|1|2|3|other]
  ```

  `$path` is where you want to map the docker volume and where is stored the `$fileName`.

  `$fileName` is the name of the file from which you want extract data.

  `[0|1|2|3|other]` indicates the type of data to parse.

  You shall choose:

  · `0` if you want to extract departments and CdL with a number of student greater than 500.

  · `1` if you want to extract CdL with a number of student fewer than 500.

  · `2` if you want to extract Medicine election.

  · `3` if you want to extract CNSU.

  · `other` if you want to extract political body.

- _create-parser.py_

  ```bash
  docker run -itv $path/:/etc/parser/disk unict-elezioni/parser ./code/create-json.py $url ./disk ./code
  ```

  `$path` is where you want to map the docker volume and where you want to store all JSON files.

  `$url` must be:

  - https://www.unict.it/it/ateneo/elezioni-studentesche-biennio-20182020
  - https://www.unict.it/ateneo/risultati-provvisori
