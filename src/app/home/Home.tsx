import React from 'react';
import './Home.scss';
import VoteIcon from 'mdi-react/VoteIcon';
import BallotOutlineIcon from 'mdi-react/BallotOutlineIcon';
import ImageIcon from 'mdi-react/ImageIcon';

function Home(): JSX.Element {
  return (
    <div className="Home">
      <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
        <div className="col-md-5 p-lg-5 mx-auto my-5">
          <h1 className="display-4 font-weight-normal">
            UNICT Elezioni
          </h1>
          <p className="lead font-weight-normal">
            Progetto sviluppato per fornire una visione immediata e cronologica dei risultati delle elezioni universitarie.
          </p>
          <a className="btn btn-outline-primary" href="#">Coming soon</a>
        </div>
        <div className="ballot ballot-box text-secondary">
          <VoteIcon size={300} />
        </div>
        <div className="ballot ballot-sheet text-secondary">
          <BallotOutlineIcon size={300} />
        </div>
      </div>
      <div className="container marketing">

        <div className="row">
          <div className="col-lg-4">
            <ImageIcon size={50} />
            <h2>Heading</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum tellus non enim ornare tempus.</p>
            <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
          </div>
          <div className="col-lg-4">
            <ImageIcon size={50} />
            <h2>Heading</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum tellus non enim ornare tempus.</p>
            <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
          </div>
          <div className="col-lg-4">
            <ImageIcon size={50} />
            <h2>Heading</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum tellus non enim ornare tempus.</p>
            <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
