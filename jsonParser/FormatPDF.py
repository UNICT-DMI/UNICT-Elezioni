import pdftotext

class FormatPDF:
    
    @staticmethod
    def format_pdf(pathname) -> None:
        '''
            Create a list that contains the lines of the pdf.\n
            @params:\n
            \t- pathname: the path of the file .pdf
        '''
        # Open and convert pdf to text
        with open(pathname, "rb") as f:
            pdf = pdftotext.PDF(f)
            f.close()
        
        # Create the list
        formatted_lines = []
        text = ""
        for line in pdf:
            text += line
        split_text = text.split("\n")
        for line in split_text:
            formatted_lines.append(line.strip())
        
        return formatted_lines