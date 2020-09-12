import React, { FunctionComponent, useEffect } from 'react';
import './Results.scss';
import { dmi } from './dmi';

const Results: FunctionComponent = () => {

  const results: { [key: string]: any[] } = {}; // any -> eletti[]

  // init results
  dmi.eletti.forEach(e => {
    if (!results[e.lista]) {
      results[e.lista] = [];
    }

    results[e.lista].push(e);
  });

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
            {results[l] && results[l][i] && `${results[l][i].nominativo} (${results[l][i].voti})`}
          </td>)
        }
      </tr>
    )
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
                      { Object.keys(results).map(l =>
                      <th key={l}>
                        <img src={`loghi/${l}.jpg`} width="80" height="80"></img>
                        <br/>
                        {l}
                      </th>) }
                    </tr>
                  </thead>
                  <tbody>
                      {tableRows}
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
