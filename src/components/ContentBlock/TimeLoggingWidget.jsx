import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import { successToast, errorToast } from 'utils/toasts';
import TimeLogDisplay from 'components/Utils/TimeLogDisplay';
import TimeLog from 'models/TimeLog';
import TimeLogModal from 'components/TimeLogModal';

class TimeLoggingWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  submit = async timeLog => {
    const { t } = this.props;

    try {
      await TimeLog.post(timeLog);

      successToast(t('timeLogged'));
    } catch (error) {
      errorToast(t('error'));
    }
  };

  render() {
    const { modalOpen } = this.state;
    const { object } = this.props;

    const users = object.timeLogs.reduce((acc, timeLog) => {
      const index = acc.findIndex(user => user.id === timeLog.user.id);

      if (index > -1) {
        acc[index].timeLogs.push(timeLog);
      } else {
        acc.push({ ...timeLog.user, timeLogs: [timeLog] });
      }

      return acc;
    }, []);

    return (
      <div className="content-block-container">
        <div className="content-block">
          <div className="content-block-header">
            <div className="content-block-label" />
            <div className="content-block-name">Time logging</div>

            <div className="content-block-extra">
              <button className="hl-primary-btn" onClick={this.openModal}>
                <FontAwesomeIcon icon={['far', 'plus']} /> Log time
              </button>
            </div>
          </div>

          <div className="content-block-body h-100">
            <div className="detail-row">
              <div>
                <strong>Total time spent</strong>
              </div>
              <div>
                {object.timeLogs.length === 0 ? (
                  <span>No time has been logged yet</span>
                ) : (
                  <TimeLogDisplay timeLogs={object.timeLogs} />
                )}
              </div>
            </div>

            <div className="detail-row time-log-collaborators">
              <div>Collaborators</div>
              <div>
                {users.length > 0 ? (
                  <React.Fragment>
                    <div>
                      {users.map(user => (
                        <img
                          src={user.profilePicture}
                          alt={user.fullName}
                          key={`timelog-avatar-${user.id}`}
                          className="user-avatar"
                        />
                      ))}
                    </div>

                    {users.map(user => (
                      <div className="time-log-collaborator" key={user.id}>
                        {user.fullName}

                        <div>
                          <TimeLogDisplay
                            timeLogs={object.timeLogs.filter(
                              timeLog => timeLog.user.id === user.id
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ) : (
                  <span>No collaborators</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <TimeLogModal
          modalOpen={modalOpen}
          closeModal={this.closeModal}
          submitCallback={this.submit}
          {...this.props}
        />
      </div>
    );
  }
}

export default withTranslation('toasts')(TimeLoggingWidget);
