import React, { useEffect, useState } from 'react';
import './Results.scss';
import Collapse from 'react-bootstrap/Collapse';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { dict } from '../department/Department';


interface Props {
  anno: string;
  path: string;
  details: boolean;
  seggio?: dict;
  multi_dip?: dict;
}

const Results = (props: Props) => {
  const data = require(`../../data/${props.anno}/${props.path}.json`);
  const [show, setShow] = useState(false);
  const seggi = props.seggio ? props.seggio[props.anno] : null;

  function getVotiSeggio(votazioni: any) {
    return (
      !!seggi
      ? seggi.reduce((acc, prev) => acc + votazioni[`seggio_n_${prev}`], 0)
      : votazioni.totali
    );
  }

  function generateTableRows(data: any): JSX.Element[] {

    const results: { [key: string]: any[] } = {}; // any -> eletti[]

    data.liste.forEach((l: any) => results[l.nome] = []);
    data.eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: true })));
    data.non_eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: false })));

    // get max rows count
    const maxRows = Object.values(results).reduce((acc, prev) => acc < prev.length ? prev.length : acc, 0);

    // generate tableRows
    const tableRows = [];
    for (let i = 0; i < maxRows; i++) {
      tableRows.push(
        <tr key={`${props.anno}-${i}`}>
          {Object.keys(results).map(l =>
            <td key={`${props.anno}-${l}-${i}`}>
              {
                results[l] && results[l][i] ? (
                [
                  `${results[l][i].nominativo} (${getVotiSeggio(results[l][i].voti)})`,
                  results[l][i].eletto ? (<img key={`coccarda-${i}`} src="coccarda.png" alt="eletto" width="16" height="30" className="float-right" />) : ''
                ]) : ''
              }
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
                .replace('ACTEA - ARCADIA', 'ACTEA  ‐  ARCADIA')
                .replace('ACTEA ‐ ARCADIA', 'ACTEA  ‐  ARCADIA')
                .replace('LIBERTAS ‐ LIBERI E FORTI', 'LIBERTAS')
                .replace('NIKE ‐ ARCADIA', 'NIKE')
                .replace('ALLEANZA ‐ CONTROCAMPUS', 'ALLEANZA  ‐  CONTROCAMPUS')
                .replace('UDU ‐ UNIONE DEGLI UNIVERSITARI', 'UDU  ‐  UNIONE DEGLI UNIVERSITARI')
                .replace('CONTROCAMPUS ‐ AZIONE UNIVERSITARIA', 'CONTROCAMPUS')
                .replace('ALLEANZA  ‐  CONTROCAMPUS ‐ AZIONE', 'ALLEANZA - AZIONE UNIVERSITARIA - CONTROCAMPUS')
                .replace('STUDENTI PER LE LIBERTÀ ‐ AZIONE UNIVERSITARIA', 'STUDENTI PER LE LIBERTÀ  ‐  AZIONE UNIVERSITARIA')
                .replace('GIOVANI CIDEC ‐ LA FINESTRA', 'GIOVANI CIDEC  ‐  LA FINESTRA')
                .replace(new RegExp("E'", "g"), 'È')
                .replace(new RegExp("A'", "g"), 'À');
  }

  function generateNOTA(): JSX.Element {
    return (
      <thead>
        <tr>
          <th>Schede Bianche</th>
          <th>Schede Nulle</th>
          <th>Schede Contestate</th>
          <th>Votanti</th>
          <th>Quoziente</th>
          <th>Seggi</th>
        </tr>
        <tr>
          <td>{getVotiSeggio(data.schede.bianche)}</td>
          <td>{getVotiSeggio(data.schede.nulle)}</td>
          <td>{getVotiSeggio(data.schede.contestate)}</td>
          <td>{getVotiSeggio(data.votanti)} {!props.seggio ? `(${data.votanti.percentuale} %)` : ''}</td>
          <td>{data.quoziente}</td>
          <td>{data.seggi_da_assegnare}</td>
        </tr>
      </thead>
    );
  }

  function generateHead(): JSX.Element {
    return (
      <thead className="cursorPointer">
        <tr>
          <th className="bg-secondary" colSpan={data.liste.length}>
            {props.anno} {
              !!seggi
              ? (
                  '- Seggi' + (seggi.length === 1 ? 'o' : '') + ': ' + seggi.join(', ') +
                  (!!props.multi_dip && props.multi_dip[props.anno].length > 1
                      ? ' - ' + props.multi_dip[props.anno].map(d => d.replace(/_/g, ' ')).join(', ')
                      : '')
                )
              : ''
            }
          </th>
        </tr>
        <tr
          key={`tr-${props.anno}-row-${Math.random()}`}
          className="head-row"
          onClick={toggleBody}
          aria-controls="collapse-tbody"
          aria-expanded={show}>
          {data.liste.map((l: any) => !l.totale &&
            <OverlayTrigger
              placement="top"
              overlay={tooltipExpandCollapse}
              key={props.anno + '-overlay-' + l.nome}>
              <th key={props.anno + '-lista-' + l.nome}>
              <div className="logo" key={props.anno + '-logo-' + l.nome}>
                  <img key={l.nome} src={`loghi/${fix_names(l.nome)}.jpg`} width="80" height="80" alt={l.nome} />
                </div>
                <div className="sub-logo" key={props.anno + '-name-' + l.nome}>
                  {l.nome} ({getVotiSeggio(l.voti)})
                </div>
              </th>
            </OverlayTrigger>)}
        </tr>
      </thead>
    );
  }

  function toggleBody(e: any) {
    e.preventDefault();
    setShow(!show);
  }

  useEffect(() => {}, [show]);

  const tooltipExpandCollapse = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {show ? 'Nascondi candidati' : 'Mostra candidati'}
    </Tooltip>
  );

  return (
    <div className="Results">
      <div className="p-2">
        <div className="row">
          <div className="col-12 lists">

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
          <Table striped bordered hover responsive className="liste">
            {props.details ? generateNOTA() : ''}
          </Table>
      </div>
    </div>
  );
}

export default Results;
