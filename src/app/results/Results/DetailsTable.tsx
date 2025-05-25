import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { OverlayTrigger, Popover, Table } from 'react-bootstrap';
import { datareader } from '../../../data/DataReader';
import './Results.scss';

interface Props {
  anno: string;
  entity: string;
  subEntity: string;
  seggi?: number[] | null;
}

export const DetailsTable = (props: Props): JSX.Element => {
  const seggi: number[] | null = props.seggi
    ? props.seggi
    : datareader.getSeatsId(props.anno, props.subEntity);
  const data: any = datareader.getSubEntity(
    props.anno,
    props.entity,
    props.subEntity,
  );

  function getVotiSeggio(votazioni: any): string[] | null {
    return seggi && seggi.length
      ? seggi.reduce(
          (acc: any, prev: any) => acc + votazioni[`seggio_n_${prev}`],
          0,
        )
      : votazioni.totali;
  }

  function eligibilityQuotientPopover(): JSX.Element {
    return (
      <Popover id="eligibilityQuotientPopover">
        <Popover.Title as="h3">Eleggibilità</Popover.Title>
        <Popover.Content>
          <div className="w-100">
            <img src="formula.png" width="400" key="formula" alt="formula" />
          </div>
        </Popover.Content>
      </Popover>
    );
  }

  return (
    <Table striped bordered hover responsive className="liste">
      <thead>
        <tr>
          <th>Schede Bianche</th>
          <th>Schede Nulle</th>
          <th>Schede Contestate</th>
          <th>Votanti</th>
          <th>
            Quoziente &nbsp;
            <OverlayTrigger overlay={eligibilityQuotientPopover()}>
              <FontAwesomeIcon icon={faInfo}></FontAwesomeIcon>
            </OverlayTrigger>
          </th>
          <th>Seggi da Assegnare</th>
        </tr>
        <tr>
          <td>{getVotiSeggio(data.schede.bianche)}</td>
          <td>{getVotiSeggio(data.schede.nulle)}</td>
          <td>{getVotiSeggio(data.schede.contestate)}</td>
          <td>
            {`${getVotiSeggio(data.votanti)} (${data.votanti.percentuale} %)`}
          </td>
          <td>{data.quoziente}</td>
          <td>{data.seggi_da_assegnare}</td>
        </tr>
      </thead>
    </Table>
  );
};

export default DetailsTable;
