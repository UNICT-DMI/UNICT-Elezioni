import React from 'react';
import { Popover, Table } from 'react-bootstrap';
import Seggi from './Seggi';

interface Props {
  candidateList: any;
  seggi: any;
  anno: string;
}

export const DetailsList = (props: Props) => {

  let seggi: Seggi = new Seggi(props.candidateList, props.seggi)

  function generateHead() {
    let seggiList = seggi.getSeggi();
    let seggiItems = [];
    for (let seggio of seggiList!) {
      seggiItems.push(
        <th>{seggio.replace("seggio_n_", "")}</th>
      )
    }
    return (
      <thead>
        <tr>
          <th><b>Seggio</b></th>
          {seggiItems}
        </tr>
      </thead>
    )
  }

  function generateVotesRow() {
    let votes = seggi.getVotes();
    let voteItems = [];

    for (let vote of votes!) {
      voteItems.push(
        <td>{vote}</td>
      )
    }
    return (
      <tbody>
        <tr>
          <td><b>Voti</b></td>
          {voteItems}
        </tr>
      </tbody>
    )
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
  )
}

export default DetailsList;
