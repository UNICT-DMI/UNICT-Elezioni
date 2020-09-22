FROM ubuntu

RUN apt-get update && apt-get install -y \
    software-properties-common
RUN add-apt-repository universe
RUN apt-get install python3 -y
RUN apt-get install python3-pip -y
RUN apt-get install build-essential libpoppler-cpp-dev pkg-config python3-dev -y
RUN apt-get install python3-lxml -y
RUN pip3 install lxml
RUN pip3 install pdftotext

COPY ./*.py /etc/parser/code/

WORKDIR /etc/parser/

VOLUME  /etc/parser/disk

RUN chmod 777 -R /etc/parser/

ENTRYPOINT [ "python3" ]