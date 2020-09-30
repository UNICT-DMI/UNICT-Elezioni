FROM python:alpine

RUN apk add poppler-dev pkgconfig libxslt-dev g++ gcc
RUN pip3 install lxml pdftotext

COPY ./*.py /etc/parser/code/

WORKDIR /etc/parser/

VOLUME  /etc/parser/disk

RUN chmod 777 -R /etc/parser/

ENTRYPOINT [ "python3" ]