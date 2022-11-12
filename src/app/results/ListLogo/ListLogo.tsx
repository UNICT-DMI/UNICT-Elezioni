import React from 'react';
import nameFixes from './nameFixes';
import './ListLogo.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface Props {
  listName: string;
}

export const ListLogo = (props: Props): JSX.Element => {
  function getListName(): string {
    return props.listName?.replace('# ', '')
      .replace(/ /g, ' ')
      .replace(/ /g, ' ')
      .replace(props.listName, nameFixes[props.listName] ? nameFixes[props.listName] : props.listName)
      .replace('#', '')
      .replace(new RegExp("O'", 'g'), 'Ò')
      .replace(new RegExp("E'", 'g'), 'È')
      .replace(new RegExp("A'", 'g'), 'À')
      .toUpperCase();
  }

  function getImageUrl(): string {
    return `loghi/${getListName()}.jpg`;
  }

  return (
    <div className="logolist">
      {
        getListName() !== undefined && getListName() !== 'UNINOMINAL'
        ? (
          <img key={getListName()}
            src={getImageUrl()}
            className="logolist m-auto"
            onError={(e: any): void => { e.target.onerror = null; e.target.src = 'loghi/image-not-found.svg'; }}
            width="80"
            height="80"
            alt={getListName()} />
        )
        : (<FontAwesomeIcon icon={faUser} size="4x"></FontAwesomeIcon>)
      }
    </div>
  );
};

export default ListLogo;
