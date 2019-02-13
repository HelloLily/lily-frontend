import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import DeleteConfirmation from 'components/Utils/DeleteConfirmation';

const ListActions = props => {
  const data = {
    id: props.item.id,
    submitCallback: props.submitCallback
  };

  return (
    <div>
      <button
        className="hl-primary-btn borderless"
        onClick={() => props.setSidebar(props.item.contentType.model, data)}
      >
        <FontAwesomeIcon icon={['far', 'pencil-alt']} />
      </button>

      <DeleteConfirmation {...props} />
    </div>
  );
};

export default withContext(ListActions);
