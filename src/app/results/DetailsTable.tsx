import React from 'react';
import { Table } from 'react-bootstrap';
import { dict } from '../department/Department';

interface Props {
  data: any;
  anno: string;
  seggio?: dict;
}

export const DetailsTable = (props: Props): JSX.Element => {
  const seggi: string[] | null = props.seggio ? props.seggio[props.anno] : null;

  function getVotiSeggio(votazioni: any): string[] | null {
      return (
      seggi
        ? seggi.reduce((acc: any, prev: any) => acc + votazioni[`seggio_n_${prev}`], 0)
        : votazioni.totali
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
          <th>Quoziente</th>
          <th>Seggi da Assegnare</th>
        </tr>
        <tr>
          <td>{getVotiSeggio(props.data.schede.bianche)}</td>
          <td>{getVotiSeggio(props.data.schede.nulle)}</td>
          <td>{getVotiSeggio(props.data.schede.contestate)}</td>
          <td>
            {getVotiSeggio(props.data.votanti)}
            {' '}
            {!props.seggio ? `(${props.data.votanti.percentuale} %)` : ''}
          </td>
          <td>{props.data.quoziente}</td>
          <td>{props.data.seggi_da_assegnare}</td>
        </tr>
      </thead>
    </Table>
  );
};

export default DetailsTable;
