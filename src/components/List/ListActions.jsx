import React from 'react';
import { Link } from 'react-router-dom';

import DeleteConfirmation from 'components/Utils/DeleteConfirmation';

const ListActions = props => {
  const url = props.item ? `${props.match.path}/${props.item.id}/edit` : '';

  return (
    <div>
      <Link to={url} className="hl-primary-btn borderless">
        <i className="lilicon hl-edit-icon" />
      </Link>

      <DeleteConfirmation {...props} />
    </div>
  );
};

export default ListActions;
