from Target import Target
from Dipartimento import Dipartimento
from Organo import Organo
from CdlInf import CdlInf
from Medicina import Medicina
from CNSU import CNSU

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
            return Dipartimento() # or CdL > 500

        if i == "1":
            return CdlInf()

        if i == "2":
            return Medicina()

        if i == "3":
            return CNSU()

        return Organo()