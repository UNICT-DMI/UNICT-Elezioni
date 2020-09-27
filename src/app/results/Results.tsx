import React from 'react';
import { Table } from 'react-bootstrap';
import './Results.scss';
import ResultTable from './ResultsTable';
import DetailsTable from './DetailsTable';
import { dict } from '../department/Department';

interface Props {
  anno: string;
  path: string;
  details: boolean;
  seggio?: dict;
  multiDip?: dict;
  showDetailsList?: boolean;
}

export const Results = (props: Props): JSX.Element => {
  const data = require(`../../data/${props.anno}/${props.path}.json`);

  return (
    <div className="Results">
      <div className="p-2">
        <div className="row">
          <div className="col-12 overflow-x-auto">
            <ResultTable seggio={props.seggio} multiDip={props.multiDip} data={data} anno={props.anno} showDetailsList={props.showDetailsList} />
          </div>
        </div>
        <Table striped bordered hover responsive className="liste">
          {props.details ? <DetailsTable seggio={props.seggio} data={data} anno={props.anno} /> : ''}
        </Table>
      </div>
    </div>
  );
};

export default Results;
