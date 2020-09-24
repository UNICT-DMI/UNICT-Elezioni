import React from 'react';
import './Results.scss';
import Table from 'react-bootstrap/Table';
import ResultTable from './ResultsTable';
import DetailsTable from './DetailsTable';

interface Props {
  anno: string;
  path: string;
  details: boolean;
}

export const Results = (props: Props) => {
  const data = require(`../../data/${props.anno}/${props.path}.json`);

  return (
    <div className="Results">
      <div className="p-2">
        <div className="row">
          <div className="col-12 lists">
            <ResultTable data={data} anno={props.anno} />
          </div>
        </div>
          <Table striped bordered hover responsive className="liste">
            {props.details ? <DetailsTable data={data} /> : ''}
          </Table>
      </div>
    </div>
  );
}

export default Results;
