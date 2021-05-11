import React from 'react';
import { Table } from 'react-bootstrap';
import { datareader } from '../../../data/DataReader';
import Coccarda from '../../coccarda/Coccarda';

interface Params {
  year: string;
  entity: string;
  subEntity: string;
}

function getName(candidate: any): string {
  return candidate.nominativo ? candidate.nominativo : candidate.nome_candidato;
}

function getVotes(candidate: any): string {
  return candidate.voti.totali ? candidate.voti.totali : candidate.voti;
}

export const ResultsUninominal = (params: Params): JSX.Element => {
  const data = datareader.getSubEntity(params.year, params.entity, params.subEntity);// require(`../../../data/${params.anno}/${params.type}/${params.cdl}.json`);
  const keys = Object.keys(data.schede.bianche);
  keys.shift();

  return (
    <div className="ResultsUninominal">
      <div className="p-2">
        <div className="container">
          <div className="row">
            <div className="w-100 overflow-x">
              <div className="w-100 bg-light text-dark p-3">
                <b>{params.year}</b>
              </div>
              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th className="bg-secondary">Candidati</th>
                    <th className="bg-secondary">Voti totali</th>
                    {keys.map(k => <th className="bg-secondary" key={`head-${k}`}>Voti {k.replaceAll('_', ' ')}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.eletti.map((e: any) =>
                    <tr key={`e-${getName(e)}`}>
                      <td className="text-primary">{getName(e)} <Coccarda key={`coccarda-${getName(e)}`} /></td>
                      <td className="text-success">{getVotes(e)}</td>
                      {keys.map(k => <td key={`e-${getName(e)}-${k}`}>{e.voti[k]}</td>)}
                    </tr>
                  )}
                  {data.non_eletti.map((e: any) =>
                    <tr key={`non-e-${getName(e)}`}>
                      <td className="text-primary">{getName(e)}</td>
                      <td className="text-success">{getVotes(e)}</td>
                      {keys.map(k => <td key={`non-e-${getName(e)}-${k}`}>{e.voti[k]}</td>)}
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="table-primary">
                    <td>Totale voti</td>
                    <td>{(data.voti && data.voti.totali) ? data.voti.totali : data.totale_voti}</td>
                    {keys.map(k => <td key={`tot-${k}`}>{data.voti[k]}</td>)}
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsUninominal;
