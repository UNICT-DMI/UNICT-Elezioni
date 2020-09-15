export const enum schede {
  BIANCHE = 'Schede Bianche',
  NULLE = 'Schede Nulle',
  CONTESTATE = 'Schede Contestate'
}

export const enum candidati {
  ELETTO_DIP = 'ELETTO',
  ELETTO_COMP = 'ELETT',
  LISTE_DIP = 'L I S T E ',
  ELETTO_ORG = 'Eletto',
  LISTE_ORG = 'LISTE',
  VOTI = 'TOTALE'
}

export const enum seggi {
  SCRUTINATI = 'N° SEGGI SCRUTINATI SU '
}

export const enum elettori {
  TUTTI = 'TOTALE ELETTORI AVENTI DIRITTO',
  VOTANTI = 'VOTANTI',
  QUOZIENTE = 'QUOZIENTE',
  PERC = '% VOTANTI'
}

export const enum query {
  DIPARTIMENTO = 'DIPARTIMENTO',
  ORGANI = 'IN SENO',
  END = 'ELEZIONI'
}

export interface Candidato {
  nominativo: any;
  voti: any;
  lista: any;
}

export interface Info {
  schede: any;
  liste: any[];
  eletti: Candidato[];
  non_eletti: Candidato[];
  elettori?: any;
  votanti?: any;
  dipartimento?: any;
  seggi_da_assegnare?: any;
  organo?: any;
  quoziente?: any;
  perc_votanti?: any;
}
