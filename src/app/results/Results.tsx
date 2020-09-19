import React, { useEffect, useState } from 'react';
import './Results.scss';

interface Props {
  anno?: string;
  path?: string;
}

const Results = (props: Props) => {
  const data = require(`../../data/${props.anno}/${props.path}.json`);
  const [show, setShow] = useState(false);

  function generateTableRows(data: any) {

    // init results
    const results: { [key: string]: any[] } = {}; // any -> eletti[]

    data.liste.forEach((l: any) => results[l.nome] = []);
    data.eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: true })));
    data.non_eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: false })));

    // get max rows count
    const maxRows = Object.values(results).reduce((acc, prev) => acc < prev.length ? prev.length : acc, 0);

    // generate tableRows
    const tableRows = [];
    let idx = 0;
    for(let i = 0; i < maxRows; i++)  {
      tableRows.push(
        <tr key={props.anno + '-' + i}>
          <td></td>
          {Object.keys(results).map(l => {
            console.log(props.anno + '-' + l + '-' + i + '-' + idx);
            idx++;
            return <td key={props.anno + '-' + l + '-' + i}>
              {(results[l] && results[l][i]) ? ([
                `${results[l][i].nominativo} (${results[l][i].voti})`,
                results[l][i].eletto ? (<img src="coccarda.png" alt="eletto" width="16" height="30" className="float-right" />) : ''
              ]) : ''}
            </td>;
          })
          }
        </tr>
      )
    }

    return tableRows;
  }

  function toggleBody(e: any) {
    e.preventDefault();
    setShow(!show);
  }

  useEffect(() => {}, [show]);

  return (
    <div className="Results">
      <div className="container-fluid">

        <div className="row">
          <div className="col-12">
            {/* <h2>Dipartimento: {data.dipartimento}</h2> */}
            <table className="liste mt-4 table table-bordered table-striped">
              <thead>
                <tr onClick={toggleBody}>
                  <th className="year">{props.anno} </th>
                  { data.liste.map((l: any) =>
                  <th key={props.anno + '-lista-' + l.nome}>
                    <img src={`loghi/${l.nome.replace('#', '')}.jpg`} width="80" height="80" alt={l.nome}></img>
                    <p></p>
                    {l.nome} ({l.voti_totali})
                  </th>) }
                </tr>
              </thead>
              <tbody>
                {generateTableRows(data)}
              </tbody>
            </table>
          </div>
        </div>

        <br />
        <br />

      </div>
    </div>
  );
}

export default Results;
