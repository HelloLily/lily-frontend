import React from 'react';

const TimeLogDisplay = props => {
  const formatHours = () => {
    let { timeLogs } = props;

    if (!(timeLogs instanceof Array)) {
      timeLogs = [timeLogs];
    }

    const hoursLogged = timeLogs.reduce(
      (hours, timeLog) => hours + parseFloat(timeLog.hoursLogged),
      0
    );
    const hours = Math.floor(hoursLogged);
    const minutes = Math.round((hoursLogged % 1) * 60);

    return { hours, minutes };
  };

  const hoursLogged = formatHours();

  return (
    <span>
      {hoursLogged.hours > 0 && (
        <span>
          {hoursLogged.hours}

          <React.Fragment>
            {hoursLogged.hours > 1 ? (
              <React.Fragment> hours</React.Fragment>
            ) : (
              <React.Fragment> hour</React.Fragment>
            )}
          </React.Fragment>
        </span>
      )}

      {hoursLogged.minutes > 0 && (
        <span>
          {hoursLogged.minutes}

          <React.Fragment>
            {hoursLogged.minutes > 1 ? (
              <React.Fragment> minutes</React.Fragment>
            ) : (
              <React.Fragment> minute</React.Fragment>
            )}
          </React.Fragment>
        </span>
      )}
    </span>
  );
};

export default TimeLogDisplay;
