export const enum schede {
  BIANCHE = 'Schede Bianche',
  NULLE = 'Schede Nulle',
  CONTESTATE = 'Schede Contestate'
}

export const enum candidati {
  ELETTO_DIP = 'ELETTO',
  LISTE_DIP = 'L I S T E ',
  ELETTO_ORG = 'Eletto',
  LISTE_ORG = 'LISTE',
  VOTI = 'TOTALE'
}

export const enum seggi {
  DA_ASSEGNARE_DIP = 'n. di seggi da assegnare',
  DA_ASSEGNARE_ORG = 'numero seggi da assegnare',
  SCRUTINATI = 'N° SEGGI SCRUTINATI SU '
}

export const enum elettori {
  TUTTI = 'TOTALE ELETTORI AVENTI DIRITTO',
  VOTANTI = 'VOTANTI'
}

export const enum query {
  DIPARTIMENTO = 'DIPARTIMENTO',
  ORGANI = 'IN SENO'
}

export interface Eletto {
  nominativo: any;
  voti: any;
  lista: any;
}

export interface Info {
  schede: object;
  liste: any[];
  eletti: Eletto[];
  elettori?: any;
  votanti?: any;
  dipartimento?: any;
  seggi_da_assegnare?: any;
  organo?: any;
}
