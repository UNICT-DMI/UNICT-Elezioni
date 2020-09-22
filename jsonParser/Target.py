from abc import ABC, abstractmethod
import json

class Target(ABC):
    def scrapeLists(self, text, data):
        """This method permits to create a JSON."""
        pass

    def is_integer(self, n):
        """Thos method verify if n is an Integer"""
        try:
            float(n)
        except ValueError:
            return False
        else:
            return float(n).is_integer()