import React, { useEffect, useState } from 'react';
import { Collapse, OverlayTrigger, Popover, Table, Tooltip } from 'react-bootstrap';
import ListLogo from './ListLogo/ListLogo';
import { dict } from '../department/Department';
import DetailsList from './DetailList/DetailsList';

interface Props {
  data: any;
  anno: string;
  seggio?: dict;
  multiDip?: dict;
  showDetailsList?: boolean;
}

export const ResultTable = (props: Props): JSX.Element => {
  const [show, setShow] = useState(false);

  const seggi: string[] | null = props.seggio ? props.seggio[props.anno] : null;

  function getVotiSeggio(votazioni: any): string[] | null {
    return (
      seggi
        ? seggi.reduce((acc: any, prev: any) => acc + votazioni[`seggio_n_${prev}`], 0)
        : votazioni.totali
    );
  }

  function generateTableRows(): JSX.Element[] {
    const results: { [key: string]: any[] } = {}; // any -> eletti[]

    props.data.liste.forEach((l: any) => (results[l.nome] = []));
    props.data.eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: true })));
    props.data.non_eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: false })));

    // get max rows count
    const maxRows = Object.values(results).reduce((acc, prev) => (acc < prev.length ? prev.length : acc), 0);

    // generate tableRows
    const tableRows = [];
    for (let i = 0; i < maxRows; i++) {
      tableRows.push(
        <tr key={`${props.anno}-${i}`}>
          {Object.keys(results).map((l: string) => l !== 'undefined' &&
            (
              <td key={`${props.anno}-${l}-${i}`}>
                {
                  results[l] && results[l][i] ? (
                    [
                      `${results[l][i].nominativo} (${getVotiSeggio(results[l][i].voti)})`,
                      results[l][i].eletto ? (<img key={`coccarda-${i}`} src="coccarda.png" alt="eletto" width="16" height="30" className="float-right" />) : ''
                    ]) : ''
                }
              </td>
            ))}
        </tr>
      );
    }
    return tableRows;
  }

  function detailsListPopover(candidateList: any): JSX.Element {
    return (
      <Popover id="popover"
        className={props.showDetailsList ? 'd-block' : 'd-none'}
        key={`${candidateList.nome}-popover-${props.anno}`}>
        <DetailsList candidateList={candidateList} seggi={seggi} anno={props.anno} />
      </Popover>
    );
  }

  function generateHead(): JSX.Element {
    return (
      <thead>
        <tr>
          <th className="bg-secondary" colSpan={props.data.liste.length}>
            {props.anno}
            {' '}
            {
              seggi
                ? (
                  `- Seggi${seggi.length === 1 ? 'o' : ''}: ${seggi.join(', ')
                  }${!!props.multiDip && props.multiDip[props.anno].length > 1
                    ? ` - ${props.multiDip[props.anno].map((d) => d.replace(/_/g, ' ')).join(', ')}`
                    : ''}`
                )
                : ''
            }
          </th>
        </tr>
        <tr
          key={`tr-${props.anno}-row-${Math.random()}`}
          className="head-row cursor-pointer"
          onClick={toggleBody}
          aria-controls="collapse-tbody"
          aria-expanded={show}>
          {props.data.liste.map((l: any) => !l.totale &&
            (
              <OverlayTrigger
                placement="top"
                overlay={tooltipExpandCollapse}
                key={`${props.anno}-overlay-${l.nome}`}>
                <th key={`${props.anno}-lista-${l.nome}`}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={detailsListPopover(l)}
                    key={`${props.anno}-overlay-${l.nome}`}>
                    <div className="logo" key={`${props.anno}-logo-${l.nome}`}>
                      <ListLogo listName={l.nome} />
                    </div>
                  </OverlayTrigger>
                  <div className="sub-logo" key={`${props.anno}-name-${l.nome}`}>
                    {l.nome}
                    {' '}
                  (
                    {getVotiSeggio(l.voti)}
                  )
                  </div>
                </th>
              </OverlayTrigger>
            ))}
        </tr>
      </thead>
    );
  }

  const tooltipExpandCollapse = (props: any): JSX.Element => (
    <Tooltip id="button-tooltip" {...props}>
      {show ? 'Nascondi candidati' : 'Mostra candidati'}
    </Tooltip>
  );

  function toggleBody(e: any): void {
    e.preventDefault();
    setShow(!show);
  }

  /* eslint-disable-next-line */
  useEffect(() => { }, [show]);

  return (
    <div className="ResultsTable">
      <div className={show ? 'd-none' : 'd-block'}>
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
              {generateTableRows()}
            </tbody>
          </Table>
        </div>
      </Collapse>
    </div>
  );
};
export default ResultTable;
