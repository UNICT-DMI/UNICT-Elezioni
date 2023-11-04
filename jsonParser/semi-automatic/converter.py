import aspose.pdf as pdf
import os
import click
from glob import glob

@click.command()
@click.option('--input', '-i', help='Input path with PDF files', required=True)
def main(input:str):
    if not os.path.isdir(input):
        raise FileNotFoundError(f"'{input}' is not a folder or does not exist")
    folder = input
    folders = glob(f"{folder}/*.pdf")
    for file_pdf in folders:
        output_file = os.path.join(file_pdf.replace(".pdf", ".csv"))
        print(f"Converting {file_pdf} to {output_file}...")
        convert_PDF_to_CSV(file_pdf, output_file)

def convert_PDF_to_CSV(infile:str, outfile:str):
    # Load input PDF document
    document = pdf.Document(infile)

    # Initialize the ExcelSaveOptions
    excelSaveOptions = pdf.ExcelSaveOptions()

    # Set CSV format
    excelSaveOptions.format= pdf.ExcelSaveOptions.ExcelFormat.CSV

    # Convert the PDF to Comma-Separated Values
    document.save(outfile, excelSaveOptions)

    print("Rendering process completed")

if __name__ == "__main__":
    main()