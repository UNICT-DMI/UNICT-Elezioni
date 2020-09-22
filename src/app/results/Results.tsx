import React, { useEffect, useState } from 'react';
import './Results.scss';
import Collapse from 'react-bootstrap/Collapse';
import Table from 'react-bootstrap/Table';

interface Props {
  anno: string;
  path: string;
}

const Results = (props: Props) => {
  const data = require(`../../data/${props.anno}/${props.path}.json`);
  const [show, setShow] = useState(false);

  function generateTableRows(data: any): JSX.Element[] {

    // init results
    const results: { [key: string]: any[] } = {}; // any -> eletti[]

    data.liste.forEach((l: any) => results[l.nome] = []);
    data.eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: true })));
    data.non_eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: false })));

    // get max rows count
    const maxRows = Object.values(results).reduce((acc, prev) => acc < prev.length ? prev.length : acc, 0);

    // generate tableRows
    const tableRows = [];
    for(let i = 0; i < maxRows; i++)  {
      tableRows.push(
        <tr key={`${props.anno}-${i}`}>
          <td></td>
          {Object.keys(results).map(l => 
            <td key={`${props.anno}-${l}-${i}`}>

              {(results[l] && results[l][i]) ? (
                [
                  `${results[l][i].nominativo} (${results[l][i].voti})`,
                  results[l][i].eletto ? (<img key={`coccarda-${i}`} src="coccarda.png" alt="eletto" width="16" height="30" className="float-right" />) : ''
                ]
              ) : ''}

            </td>
          )}
        </tr>
      )
    }

    return tableRows;
  }

  function fix_names(name: string): string {
    return name.replace('#', '')
               .replace(/ /g, ' ')
               .replace(/ /g, ' ')
               .replace('ALLENZA UNIVERSITARIA', 'ALLEANZA UNIVERSITARIA')
               .replace('NIKE  ‐  ARCADIA', 'ARCADIA - NIKE')
               .replace('INGENERIATTIVA', 'INGEGNERIATTIVA')
               .replace('LA FINESTRA  ‐  LIBERI DI SCEGLIERE', 'LA FINESTRA ‐ LIBERI DI SCEGLIERE')
               .replace('LA FINESTRA‐LIBERI DI SCEGLIERE', 'LA FINESTRA ‐ LIBERI DI SCEGLIERE')
               .replace('LIBERTAS LIBERI E FORTI', 'LIBERTAS')
               .replace('NUOVA IBLA', 'NUOVAIBLA')
               .replace('SANI LAB', 'SANILAB')
               .replace('ECONOMIATTIVA', 'ECONOMIA ATTIVA')
               .replace('WE LOVE UNICT/CREDIAMOCI', 'WE LOVE UNICT')
               .replace('WE LOVE UNICT - ARES', 'WE LOVE UNICT')
               .replace('PARTECIPA ‐ SOS GIURISTI', 'PARTECIPA')
               .replace('ARCADIA ‐ REVOLUTION', 'ARCADIA REVOLUTION')
               .replace('UDU - UNIONE DEGLI UNIVERSITARI', 'UDU  ‐  UNIONE DEGLI UNIVERSITARI')
               .replace(new RegExp("E'", "g"), 'È')
               .replace(new RegExp("A'", "g"), 'À');
  }

  function generateHead(): JSX.Element {
    return (
        <thead>
        <tr
          onClick={toggleBody}
          aria-controls="collapse-tbody"
          aria-expanded={show}
        >
          <th className="year">{props.anno} </th>
          { data.liste.map((l: any) =>
          <th key={props.anno + '-lista-' + l.nome}>
            <div className="logo" key={props.anno + '-logo-' + l.nome}>
              <img src={`loghi/${fix_names(l.nome)}.jpg`} width="80" height="80" alt={l.nome}></img>
            </div>
            <div className="sub-logo" key={props.anno + '-name-' + l.nome}>
              {l.nome} ({l.voti_totali})
            </div>
          </th>) }
        </tr>
      </thead>
    );
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

            <div className={show ? 'invisible' : 'visible'}>
              <Collapse in={!show}>
                <Table striped bordered hover responsive className="liste">
                  {generateHead()}
                </Table>
              </Collapse>
            </div>

              <Collapse in={show}>
                <div id="collapse-tbody">
                  <Table striped bordered hover className="liste">
                    {generateHead()}
                    <tbody>
                      {generateTableRows(data)}
                    </tbody>
                  </Table>
                </div>
              </Collapse>

          </div>
        </div>

        <br />
        <br />

      </div>
    </div>
  );
}

export default Results;
