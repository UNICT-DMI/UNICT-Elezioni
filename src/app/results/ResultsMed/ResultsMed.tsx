import React from 'react';
import { Table } from 'react-bootstrap';
import Coccarda from '../../coccarda/Coccarda';

interface Props {
  anno: string;
  path: string;
}

export const ResultsMed = (props: Props): JSX.Element => {
  const data = require(`../../../data/${props.anno}/${props.path}.json`);
  const keys = Object.keys(data.schede.bianche);
  keys.shift();

  return (
    <div className="ResultsMed">
      <div className="p-2">
        <div className="container">
          <div className="row">
            <div className="col-12 overflow-x">

              <h2>{props.anno}</h2>

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
                    <tr key={`e-${e.nominativo}`}>
                      <td className="text-primary">{e.nominativo} <Coccarda key={`coccarda-${e.nominativo}`} /></td>
                      <td className="text-success">{e.voti.totali}</td>
                      {keys.map(k => <td key={`e-${e.nominativo}-${k}`}>{e.voti[k]}</td>)}
                    </tr>
                  )}
                  { data.non_eletti.map((e: any) =>
                    <tr key={`non-e-${e.nominativo}`}>
                      <td className="text-primary">{e.nominativo}</td>
                      <td className="text-success">{e.voti.totali}</td>
                      {keys.map(k => <td key={`non-e-${e.nominativo}-${k}`}>{e.voti[k]}</td>)}
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="table-primary">
                    <td>Totale voti</td>
                    <td>{data.voti.totali}</td>
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

export default ResultsMed;
