from Target import Target
from Dipartimento import Dipartimento
from Organo import Organo

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
        else:
            return Organo()