import React from 'react';
import { Popover, Table } from 'react-bootstrap';
import Seggi from './Seggi';

interface Props {
  candidateList: any;
  seggi: string[] | null;
  anno: string;
}

export const DetailsList = (props: Props): JSX.Element => {
  const seggi: Seggi = new Seggi(props.candidateList, props.seggi);

  function generateHead (): JSX.Element {
    const seggiList = seggi.getSeggi();
    const seggiItems = [];

    for (const seggio of seggiList) {
      seggiItems.push(
        <th key={seggio}>{seggio.replace('seggio_n_', '')}</th>
      );
    }
    return (
      <thead>
        <tr>
          <th><b>Seggio</b></th>
          {seggiItems}
        </tr>
      </thead>
    );
  }

  function generateVotesRow (): JSX.Element {
    const votes = seggi.getVotes();
    const voteItems = [];

    for (const vote of votes) {
      voteItems.push(
        <td key={vote}>{vote}</td>
      );
    }
    return (
      <tbody>
        <tr>
          <td><b>Voti</b></td>
          {voteItems}
        </tr>
      </tbody>
    );
  }

  return (
    <div className="detail-list">
      <Popover.Title as="h3">{props.candidateList.nome}</Popover.Title>
      <Popover.Content>
        {
          <Table striped bordered hover>
            {generateHead()}
            {generateVotesRow()}
          </Table>
        }
      </Popover.Content>
    </div>
  );
};

export default DetailsList;
