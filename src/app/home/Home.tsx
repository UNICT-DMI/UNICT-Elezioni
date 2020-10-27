import React from 'react';
import './Home.scss';

function Home(): JSX.Element {
  return (
    <div className="Home">
      <div className="container">
        <div className="row mt-5">
          <div className="col-6 text-right">
            <h2 className="text-center">UNICT Elezioni</h2>
            <img src="UNICT-Elezioni.png" className="logo" alt="UNICT Elezioni" />
          </div>
          <div className="col-6">
            <div className="text-left">
              <p>Questo progetto è stato realizzato per fornire una visualizzazione immediata ed in ordine cronologico dei risultati delle elezioni universitarie.</p>

              <p>Attualmente è possibile visualizzare lo storico dei risultati delle elezioni dei seguenti organi istituzionali:</p>
              <ul>
                <li>Dipartimento</li>
                <li>Corsi di Laurea</li>
                <li>Senato</li>
                <li>Consiglio di Amministrazione</li>
                <li>Consiglio di Amministrazione ERSU</li>
                <li>Nucleo di Valutazione</li>
                <li>Comitato per lo Sport Universitario</li>
                <li>Coordinamento Facoltà di Medicina</li>
              </ul>

              <p>Il progetto è <b>ancora in lavorazione,</b> inoltre, purtroppo molti dati non sono disponibili nel sito dell'Ateneo quindi attualmente mostriamo solo i dati dei seguenti bienni:</p>
              <ul>
                <li>2018-2020</li>
                <li>2016-2018</li>
                <li>2014-2016 (solo organi superiori)</li>
              </ul>

              Per qualsiasi suggerimento o segnalazione <a href="#/contatti">contattaci!</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
