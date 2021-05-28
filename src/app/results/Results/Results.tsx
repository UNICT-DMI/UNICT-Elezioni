import React from 'react';
import './Results.scss';
import ResultTable from './ResultsTable';
import DetailsTable from './DetailsTable';
import { datareader } from '../../../data/DataReader';

interface Props {
  anno: string;
  path: string;
  details: boolean;
  showDetailsList?: boolean;
  showList?: boolean;
  entity: string;
  subEntity: string;
  seggi?: number[] | null;
}

export const Results = (props: Props): JSX.Element => {
  if (!datareader.getYearsOfSubEntity(props.entity, props.subEntity).includes(props.anno)) {
    return (<></>);
  }
  return (
    <div className="Results">
      <div className="p-2">
        <div className="row">
          <div className="col-12 overflow-x-auto">
            <ResultTable
              anno={props.anno}
              entity={props.entity}
              subEntity={props.subEntity}
              showDetailsList={props.showDetailsList}
              showList={props.showList}
              seggi={props.seggi} />
          </div>
        </div>
        {
          props.details &&
          <DetailsTable
            anno={props.anno}
            entity={props.entity}
            subEntity={props.subEntity}
            seggi={props.seggi}/>
        }
      </div>
    </div>
  );
};

export default Results;
