from Target import Target
from Dipartimento import Dipartimento
from Organo import Organo
from CdlInf import CdlInf
from Medicina import Medicina

class SelectTarget:
    __instance = None

    @staticmethod
    def get_instance():
        if SelectTarget.__instance == None:
            SelectTarget()
        return SelectTarget.__instance

    def __init__(self):
        """Virtually private constructor."""
        if SelectTarget.__instance == None:
            SelectTarget.__instance = self
        
    def get_target(self, i) -> Target:
        if i == "0":
            return Dipartimento()
        elif i == "1":
            return CdlInf()
        elif i == "2":
            return Medicina()
        else:
            return Organo()