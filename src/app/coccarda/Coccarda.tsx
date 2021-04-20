import { faAward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function Coccarda(): JSX.Element {
  return (
    <FontAwesomeIcon className="mx-2" icon={faAward} color="red" size="lg" />
  );
}

export default Coccarda;
