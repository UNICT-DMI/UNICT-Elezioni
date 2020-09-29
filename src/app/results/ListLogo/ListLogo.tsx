import React from 'react';
import nameFixes from './nameFixes';

interface Props {
  listName: string;
}

export const ListLogo = (props: Props): JSX.Element => {
  function getListName(): string {
    return props.listName.replace('#', '')
      .replace(/ /g, ' ')
      .replace(/ /g, ' ')
      .replace(props.listName, nameFixes[props.listName] ? nameFixes[props.listName] : props.listName)
      .replace(new RegExp("E'", 'g'), 'È')
      .replace(new RegExp("A'", 'g'), 'À');
  }

  return (
    <img key={getListName()}
      src={`loghi/${getListName()}.jpg`}
      className="m-auto"
      width="80"
      height="80"
      alt={getListName()} />
  );
};

export default ListLogo;
