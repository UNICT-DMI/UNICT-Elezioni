const entities = [
  'Senato',
  'Nucleo_di_valutazione',
  'Consiglio_di_amministrazione',
  'Comitato_per_lo_sport_universitario'
];

interface IEntitiesPath {
  [key: string]: string;
}

export const entitiesPath: IEntitiesPath = {
  Senato: '#/Senato',
  Nucleo_di_valutazione: '#/ndv',
  Consiglio_di_amministrazione: '#/cda',
  Comitato_per_lo_sport_universitario: '#/csu'
};

export default entities;
