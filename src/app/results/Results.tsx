import React, { FunctionComponent } from 'react';
import './Results.scss';

const dmi = require('../../data/2018-2020/dipartimenti/dfa.json');

const Results: FunctionComponent = () => {

  console.log(dmi.liste);

  function generateTableRows(data: any) {

    // init results
    const results: { [key: string]: any[] } = {}; // any -> eletti[]

    data.liste.forEach((l: any) => results[l.nome] = []);
    data.eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: true })));
    data.non_eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: false })));

    // get max rows count
    let maxRows = 0;
    for (const lista of Object.keys(results)) {
      if (maxRows < results[lista].length) {
        maxRows = results[lista].length;
      }
    }

    // generate tableRows
    const tableRows = [];
    for(let i = 0; i < maxRows; i++)  {
      tableRows.push(
        <tr key={i}>
          {Object.keys(results).map(l =>
            <td key={l + '-' + i}>
              {(results[l] && results[l][i]) ? ([
                `${results[l][i].nominativo} (${results[l][i].voti})`,
                results[l][i].eletto ? (<img src="coccarda.png" width="16" height="30" className="float-right" />) : ''
              ]) : ''}
            </td>)
          }
        </tr>
      )
    }

    return tableRows;
  }

  return (
    <div className="Results mt-5">
      <div className="container">
        <h2>Risultati Elezioni Universitarie</h2>

        <div className="row">
          <div className="col-12">
            <div className="mt-5">
              <h2>Dipartimento: {dmi.dipartimento}</h2>
                <table className="liste mt-4 table table-bordered table-striped">
                  <thead>
                    <tr>
                      { dmi.liste.map((l: any) =>
                      <th key={l}>
                        <img src={`loghi/${l.nome}.jpg`} width="80" height="80"></img>
                        <br/>
                        {l.nome}
                      </th>) }
                    </tr>
                  </thead>
                  <tbody>
                      {generateTableRows(dmi)}
                  </tbody>
                </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Results;
