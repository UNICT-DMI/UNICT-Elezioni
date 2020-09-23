import pdftotext
import sys
import os

class FormatPDF:
    @staticmethod
    def formatPdf(pathname) -> None:
        '''
            Create a list that contains the lines of the pdf.\n
            @params:\n
            \t- pathname: the path of the file .pdf
        '''
        # Open and convert pdf to text
        with open(pathname, "rb") as f:
            pdf = pdftotext.PDF(f)
        
        # Create a temp file
        original_stdout = sys.stdout
        with open("temp.txt", "w+") as f:
            sys.stdout = f
            for page in pdf:
                print(page)
            sys.stdout = original_stdout
            f.close()
        
        # Create the list
        formatted_lines = []
        with open("temp.txt", "r") as f:
            lines = f.readlines()
            for x in lines:
                formatted_lines.append(x.strip())
            f.close()
        os.unlink("temp.txt")
        
        return formatted_lines