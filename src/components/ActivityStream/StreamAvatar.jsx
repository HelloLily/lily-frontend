import React from 'react';

const StreamAvatar = props => {
  const { object, field } = props;

  return object[field] ? (
    <img src={object[field].profilePicture} alt="" className="activity-stream-image" />
  ) : (
    <div className="activity-stream-image" />
  );
};

export default StreamAvatar;
