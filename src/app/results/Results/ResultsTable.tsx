import React, { useEffect, useState } from 'react';
import { Collapse, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import ListLogo from '../ListLogo/ListLogo';
import { dict } from '../../department/Department';
import DetailsList from '../DetailList/DetailsList';
import Coccarda from '../../coccarda/Coccarda';

interface Props {
  data: any;
  anno: string;
  seggio?: dict;
  multiDip?: dict;
  showDetailsList?: boolean;
  showList?: boolean;
}

export const ResultTable = (props: Props): JSX.Element => {
  const [show, setShow] = useState(props.showList);
  const seggi: string[] | null = props.seggio ? props.seggio[props.anno] : null;

  function getVotiSeggio(votazioni: any): string[] | null {
    return (
      seggi
        ? seggi.reduce((acc: any, prev: any) => acc + votazioni[`seggio_n_${prev}`], 0)
        : votazioni?.totali
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
                  results[l] && results[l][i] && (
                    [
                      `${results[l][i].nominativo} (${getVotiSeggio(results[l][i].voti)})`,
                      results[l][i].eletto ? (<Coccarda key={`coccarda-${i}`} />) : ''
                    ]
                  )
                }
              </td>
            )
          )}
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
        {
          props.showDetailsList &&
          <DetailsList candidateList={candidateList} seggi={seggi} anno={props.anno} />
        }
      </Popover>
    );
  }

  function generateHead(): JSX.Element {
    return (
      <thead className="show-candidate">
        <tr
          key={`tr-${props.anno}-row-${Math.random()}`}
          className="head-row cursor-pointer"
          onClick={toggleBody}
          aria-controls="collapse-tbody"
          aria-expanded={show}>
          {props.data.liste.map((l: any) => (!l.totale && l.totale !== 0) &&
            (
              <th key={`${props.anno}-lista-${l.nome}`}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={detailsListPopover(l)}
                  key={`${props.anno}-overlay-${l.nome}`}>
                  <div key={`${props.anno}-logo-${l.nome}`}>
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
            ))}
        </tr>
      </thead>
    );
  }

  function generateTableTitle(): JSX.Element {
    return (
      <div className="w-100 bg-secondary p-3">
        <b>
          {props.anno}
          {' '}
          {
            seggi && (
              `- Seggi${seggi.length === 1 ? 'o' : ''}: ${seggi.join(', ')
              }${!!props.multiDip && props.multiDip[props.anno].length > 1
                ? ` - ${props.multiDip[props.anno].map((d) => d.replace(/_/g, ' ')).join(', ')}`
                : ''}`
            )
          }
        </b>
      </div>
    );
  }

  function toggleBody(e: any): void {
    e.preventDefault();
    setShow(!show);
  }

  /* eslint-disable-next-line */
  useEffect(() => { }, [show]);

  return (
    <div className="ResultsTable">
      <div className={show ? 'd-none' : 'd-block'}>
        {generateTableTitle()}
        <Collapse in={!show}>
          <Table striped bordered hover responsive className="liste">
            {generateHead()}
          </Table>
        </Collapse>
      </div>

      <Collapse in={show}>
        <div id="collapse-tbody">
          {generateTableTitle()}
          <Table striped bordered hover responsive className="liste">
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
