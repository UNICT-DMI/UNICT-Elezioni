import React, { useEffect, useState } from 'react';
import { Collapse, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import ListLogo from '../ListLogo/ListLogo';
import DetailsList from '../DetailList/DetailsList';
import Coccarda from '../../coccarda/Coccarda';
import { datareader } from '../../../data/DataReader';

interface Props {
  anno: string;
  seggi?: number[] | null;
  showDetailsList?: boolean;
  showList?: boolean;
  entity: string;
  subEntity: string;
}

export const ResultTable = (props: Props): JSX.Element => {
  const [show, setShow] = useState(props.showList);

  const seggi = props.seggi ? props.seggi : datareader.getSeatsId(props.anno, props.subEntity);
  const multiDep: string[] = datareader.getMultiDepSeats(props.anno, props.subEntity);
  const lists: any[] = datareader.getLists(props.anno, props.entity, props.subEntity);
  const candidates: any[] = datareader.getAllCandidates(props.anno, props.entity, props.subEntity);

  function getVotiSeggio(votazioni: any): string {
    const voti: number = (
      seggi && seggi.length
        ? seggi.reduce((acc: any, prev: any) => acc + votazioni[`seggio_n_${prev}`], 0)
        : votazioni?.totali
    );
    return '(' + voti + ')';
  }

  function generateTableRows(): JSX.Element[] {
    // get max rows count
    const maxRows = Object.values(candidates).reduce((acc: number, prev: any[]): number => (acc < prev.length ? prev.length : acc), 0);

    // generate tableRows
    const tableRows = [];

    for (let i = 0; i < maxRows; i++) {
      tableRows.push(
        <tr key={`tr-${props.anno}-${i}`}>
          {
            lists.map((list: any): JSX.Element =>
              <td key={`td-${props.anno}-${i}-${list.nome}`}>
                {
                  candidates[list.nome][i]
                  ? [
                    candidates[list.nome][i].nominativo,
                    (<br key={`${props.anno}-${i}-${list}-${candidates[list.nome][i].nominativo}`} />),
                    getVotiSeggio(candidates[list.nome][i].voti),
                    candidates[list.nome][i].eletto
                    ? (<Coccarda key={`Coccarda-${list.nome}-${i}`} />) :
                    null
                  ] :
                  null
                }
              </td>
            )
          }
        </tr>
      );
    }

    return tableRows;
  }

  function detailsListPopover(candidateList: any): JSX.Element {
    if (props.showDetailsList && seggi) {
      return (
        <Popover id="detailsListPopover"
          key={`${candidateList.nome}-popover-${props.anno}`}>
          <DetailsList candidateList={candidateList} seggi={seggi} anno={props.anno} />
        </Popover>
      );
    }

    return (<Popover id="detailsListPopover" />);
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
          {
            lists.map((list: any) => (!list.totale && list.totale !== 0) &&
              (
                <th key={`${props.anno}-lista-${list.nome}`}>
                  {
                    (props.showDetailsList && seggi && seggi.length)
                    ? (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={detailsListPopover(list)}
                        key={`${props.anno}-overlay-${list.nome}`}>
                        <div key={`${props.anno}-logo-${list.nome}`}>
                          <ListLogo listName={list.nome} />
                        </div>
                      </OverlayTrigger>
                    ) : (<ListLogo listName={list.nome} />)
                  }
                  <div className="sub-logo" key={`${props.anno}-name-${list.nome}`}>
                    {list.nome}
                    <br />
                    {getVotiSeggio(list.voti)}
                  </div>
                </th>
              ))}
        </tr>
      </thead>
    );
  }

  function generateTableTitle(): JSX.Element {
    return (
      <div className="w-100 bg-light text-dark p-3">
        <h4 className="text-primary">{props.anno}</h4>
        {
          seggi && seggi.length
          ? (<br /> && (
            `Seggi${seggi.length === 1 ? 'o' : ''}: ${seggi.join(', ')
            }${!!multiDep && multiDep.length > 1
              ? ` - ${multiDep.map((d) => d.replaceAll('_', ' ')).join(', ')}`
              : ''}`
          )) :
          null
        }
        {
          !datareader.hasPassedQuorum(props.anno, props.entity, props.subEntity)
          ? (
            <b className="text-danger">[Quorum non raggiunto]</b>
          ) :
          null
        }
        {
          props.anno === '2021-2023'
          ? (
            <b className="text-warning">[Voto online causa pandemia COVID-19]</b>
          ) :
          null
        }

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
