import React from 'react';
import { dict } from '../../department/Department';

interface Props {
  anno: string;
  path: string;
  details: boolean;
  seggio?: dict;
  multiDip?: dict;
  showDetailsList?: boolean;
}

export const ResultsSingle = (props: Props): JSX.Element => {
  const data = require(`../../../data/${props.anno}/${props.path}.json`);
  const keys = Object.keys(data.schede.bianche);
  keys.shift();

  return (
    <div className="ResultsSingle">
      <div className="p-2">
        <div className="container">
          <div className="row">
            <div className="col-12 overflow-x">

              <h2>{props.anno}</h2>

              <table className="table table-stripe table-bordered">
                <thead>
                  <tr>
                    <th className="bg-secondary">Candidati</th>
                    <th className="bg-secondary">Voti totali</th>
                    {keys.map(k => <th className="bg-secondary">Voti {k.replaceAll('_', ' ')}</th>)}
                  </tr>
                </thead>
                <tbody>
                { data.eletti.map((e: any) =>
                  <tr>
                    <td className="text-primary">{e.nominativo} <img src="coccarda.png" width="16" height="30" className="float-right" alt="eletto"/></td>
                    <td className="text-success">{e.voti.totali}</td>
                    {keys.map(k => <td>{e.voti[k]}</td>)}
                  </tr>
                )}
                { data.non_eletti.map((e: any) =>
                  <tr>
                    <td className="text-primary">{e.nominativo}</td>
                    <td className="text-success">{e.voti.totali}</td>
                    {keys.map(k => <td>{e.voti[k]}</td>)}
                  </tr>
                )}
                </tbody>
                <tfoot>
                  <tr className="table-primary">
                    <td>Totale voti</td>
                    <td>{data.voti.totali}</td>
                    {keys.map(k => <td>{data.voti[k]}</td>)}
                  </tr>
                </tfoot>
              </table>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSingle;
