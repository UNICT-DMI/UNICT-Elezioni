FROM python:alpine

RUN apk add bash poppler-dev pkgconfig g++ gcc libxslt-dev

RUN pip3 install lxml pdftotext

COPY ./*.py /etc/parser/code/

WORKDIR /etc/parser/

VOLUME  /etc/parser/disk

ENTRYPOINT [ "python3" ]