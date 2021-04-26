import React from 'react';
import './Home.scss';
import Icon from '@mdi/react';
import { mdiBallotOutline, mdiDatabase, mdiGestureTap, mdiGithub, mdiProgressWrench, mdiVote } from '@mdi/js';

function Home(): JSX.Element {
  return (
    <div className="home">
      <div className="home-slide-first position-relative overflow-hidden p-3 p-md-5 text-center bg-light">
        <div className="col-md-5 p-lg-5 mx-auto my-5">
          <div className="home-title">
            <h1 className="display-4 font-weight-normal">
              UNICT Elezioni
            </h1>
            <span className="badge bg-secondary">Beta</span>
          </div>
          <p className="lead font-weight-normal">
            Progetto sviluppato per fornire una visione immediata e cronologica dei risultati delle elezioni universitarie.
          </p>
        </div>
        <div className="ballot ballot-box text-secondary">
          <Icon path={mdiVote} size={15} />
        </div>
        <div className="ballot ballot-sheet text-secondary">
          <Icon path={mdiBallotOutline} size={15} />
        </div>
      </div>
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-4">
            <Icon path={mdiDatabase} size={3} />
            <h2>Dati ufficiali</h2>
            <p>Basato su dati estratti da documenti PDF pubblicati sul sito dell&apos;Università di Catania.</p>
          </div>
          <div className="col-lg-4">
            <Icon path={mdiGithub} size={3} />
            <h2>Free and Open</h2>
            <p>Progetto completamente Free and Open Source. Chiunque può contribuire per migliorare il progetto.</p>
          </div>
          <div className="col-lg-4">
            <Icon path={mdiGestureTap} size={3} />
            <h2>Semplice</h2>
            <p>Permette di fornire una visione dei risultati delle elezioni in modo semplice e veloce.</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-md-7 align-self-center">
            <h1>Progetto in manutenzione</h1>
          </div>
          <div className="col-md-5">
            <Icon path={mdiProgressWrench} size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
