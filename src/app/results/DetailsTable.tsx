import React from 'react';

interface Props {
  data: any;
}

export const DetailsTable = (props: Props) => {
  return (
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
        <td>{props.data.schede.bianche.totali}</td>
        <td>{props.data.schede.nulle.totali}</td>
        <td>{props.data.schede.contestate.totali}</td>
        <td>{props.data.votanti.percentuale}</td>
        <td>{props.data.quoziente}</td>
        <td>{props.data.seggi_da_assegnare}</td>
      </tr>
    </thead>
  );
}

export default DetailsTable;