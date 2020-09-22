from Target import Target
from Dipartimento import Dipartimento
from Organo import Organo

class selectTarget:
    __instance = None

    @staticmethod
    def getInstance():
        if selectTarget.__instance == None:
            selectTarget()
        return selectTarget.__instance

    def __init__(self):
        """Virtually private constructor."""
        if selectTarget.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            selectTarget.__instance = self
        
    def getTarget(self, i) -> Target:
        if i == "0":
            return Dipartimento()
        else:
            return Organo()