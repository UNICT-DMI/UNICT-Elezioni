import React, { FunctionComponent } from 'react';
import './Container.scss';
import { faDemocrat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Input {
  selected?: string;
}

class Container extends React.Component<{}, Input> {
  constructor(props: any) {
    super(props);
    this.state = { selected: undefined };
    this.Buttons = this.Buttons.bind(this);
    this.Data = this.Data.bind(this);
    this.Dipartimento = this.Dipartimento.bind(this);
    this.Organi = this.Organi.bind(this);
  }

  public Buttons() {
    return (
      <ul>
        <li><button onClick={() => {
          this.setState({ selected: 'dipartimenti' });
        }}> Dipartimento & CdL</button></li>
        <li><button onClick={() => {
          this.setState({ selected: 'organi' });
          console.log(this.state);
        }}>Organi superiori</button></li>
      </ul >);

  }

  public Data() {
    switch (this.state.selected) {
      case 'dipartimenti':
        return <this.Dipartimento />;
      case 'organi':
        return <this.Organi />;
      default:
        return null;
    }
  }

  public Dipartimento() {
    return (
      <ul>
        <li><button>Dipartimenti</button></li>
        <li><button>CdL</button></li>
      </ul>
    );
  }

  public Organi() {
    return (<h3>Organi</h3>);
  }

  public render() {
    return (
      <div className="container-body">
        <h3><FontAwesomeIcon icon={faDemocrat} /> Risultati elezioni </h3>
        <this.Buttons />
        <this.Data />
      </div >
    );
  }
}

export default Container;
