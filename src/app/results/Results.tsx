import React from 'react';
import './Results.scss';
import Table from 'react-bootstrap/Table';
import ResultTable from './ResultsTable';
import DetailsTable from './DetailsTable';
import { dict } from '../department/Department';

interface Props {
  anno: string;
  path: string;
  details: boolean;
  seggio?: dict;
  multi_dip?: dict;
  showDetailsList?: boolean;
}

export const Results = (props: Props) => {
  const data = require(`../../data/${props.anno}/${props.path}.json`);

  return (
    <div className="Results">
      <div className="p-2">
        <div className="row">
          <div className="col-12 overflow-x-auto">
            <ResultTable seggio={props.seggio} multi_dip={props.multi_dip} data={data} anno={props.anno} showDetailsList={props.showDetailsList} />
          </div>
        </div>
        <Table striped bordered hover responsive className="liste">
          {props.details ? <DetailsTable seggio={props.seggio} data={data} anno={props.anno} /> : ''}
        </Table>
      </div>
    </div>
  );
}

export default Results;
