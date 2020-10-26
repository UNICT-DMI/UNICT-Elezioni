import React from 'react';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Coccarda from '../../coccarda/Coccarda';

interface Params {
  anno: string;
  cdl: string;
  type: string;
}

export const ResultsSingle = (): JSX.Element => {
  const params: Params = useParams();
  const data = require(`../../../data/${params.anno}/${params.type}/${params.cdl}.json`);
  const keys = Object.keys(data.schede.bianche);
  keys.shift();

  return (
    <div className="ResultsSingle">
      <div className="p-2">
        <div className="container">
          <div className="row">
            <div className="col-12 overflow-x">

              <h2 className="capitalize">{params.cdl.replaceAll('_', ' ')} {params.anno}</h2>

              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th className="bg-secondary">Candidati</th>
                    <th className="bg-secondary">Voti totali</th>
                    {keys.map(k => <th className="bg-secondary" key={`head-${k}`}>Voti {k.replaceAll('_', ' ')}</th>)}
                  </tr>
                </thead>
                <tbody>
                { data.eletti.map((e: any) =>
                  <tr key={`e-${e.nome_candidato}`}>
                    <td className="text-primary">{e.nome_candidato} <Coccarda key={`coccarda-${e.nome_candidato}`} /></td>
                    <td className="text-success">{e.voti}</td>
                    {keys.map(k => <td key={`e-${e.nome_candidato}-${k}`}>{e.voti[k]}</td>)}
                  </tr>
                )}
                { data.non_eletti.map((e: any) =>
                  <tr key={`non-e-${e.nome_candidato}`}>
                    <td className="text-primary">{e.nome_candidato}</td>
                    <td className="text-success">{e.voti}</td>
                    {keys.map(k => <td key={`non-e-${e.nome_candidato}-${k}`}>{e.voti[k]}</td>)}
                  </tr>
                )}
                </tbody>
                <tfoot>
                  <tr className="table-primary">
                    <td>Totale voti</td>
                    <td>{data.totale_voti}</td>
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

export default ResultsSingle;
