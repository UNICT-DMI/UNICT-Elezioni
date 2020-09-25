import React, { useEffect, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import ListLogo from './ListLogo/ListLogo';

interface Props {
	data: any;
	anno: string;
}

export const ResultTable = (props: Props) => {

	const [show, setShow] = useState(false);

	function generateTableRows(): JSX.Element[] {
		// init results
		const results: { [key: string]: any[] } = {}; // any -> eletti[]

		props.data.liste.forEach((l: any) => results[l.nome] = []);
		props.data.eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: true })));
		props.data.non_eletti.forEach((e: any) => results[e.lista].push(Object.assign(e, { eletto: false })));

		// get max rows count
		const maxRows = Object.values(results).reduce((acc, prev) => acc < prev.length ? prev.length : acc, 0);

		// generate tableRows
		const tableRows = [];
		for (let i = 0; i < maxRows; i++) {
			tableRows.push(
				<tr key={`${props.anno}-${i}`}>
					{Object.keys(results).map(l =>
						l !== 'undefined' ? (
							<td key={`${props.anno}-${l}-${i}`}>
								{
									results[l] && results[l][i] ? (
										[
											`${results[l][i].nominativo} (${results[l][i].voti.totali})`,
											results[l][i].eletto ? (<img key={`coccarda-${i}`} src="coccarda.png" alt="eletto" width="16" height="30" className="float-right" />) : ''
										]) : ''
								}
							</td>
						) : ''
					)}
				</tr>
			)
		}
		return tableRows;
	}


	function generateHead(): JSX.Element {
		return (
			<thead>
				<tr>
					<th className="bg-secondary" colSpan={props.data.liste.length}>{props.anno}</th>
				</tr>
				<tr
					key={`tr-${props.anno}-row-${Math.random()}`}
					className="head-row cursor-pointer"
					onClick={toggleBody}
					aria-controls="collapse-tbody"
					aria-expanded={show}>
					{props.data.liste.map((l: any) => !l.totale &&
						<OverlayTrigger
							placement="top"
							overlay={tooltipExpandCollapse}
							key={Math.random()}>
							<th key={props.anno + '-lista-' + l.nome}>
								<div className="logo" key={props.anno + '-logo-' + l.nome}>
									<ListLogo listName={l.nome} />
								</div>
								<div className="sub-logo" key={props.anno + '-name-' + l.nome}>
									{l.nome} ({l.voti.totali})
                </div>
							</th>
						</OverlayTrigger>)}
				</tr>
			</thead>
		);
	}

	const tooltipExpandCollapse = (props: any) => (
		<Tooltip id="button-tooltip" {...props}>
			{show ? 'Nascondi candidati' : 'Mostra candidati'}
		</Tooltip>
	);

	function toggleBody(e: any) {
		e.preventDefault();
		setShow(!show);
	}

	useEffect(() => { }, [show]);

	return (
		<div className="ResultsTable">
			<div className={show ? 'd-none' : 'd-block'}>
				<Collapse in={!show}>
					<Table striped bordered hover responsive className="liste">
						{generateHead()}
					</Table>
				</Collapse>
			</div>

			<Collapse in={show}>
				<div id="collapse-tbody">
					<Table striped bordered hover className="liste">
						{generateHead()}
						<tbody>
							{generateTableRows()}
						</tbody>
					</Table>
				</div>
			</Collapse>
		</div>
	)
}
export default ResultTable;
