import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import { successToast, errorToast } from 'utils/toasts';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import LilyModal from 'components/LilyModal';
import Security from 'models/Security';

class UserSecurity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
      sessions: [],
      modalOpen: false,
      loading: true
    };

    document.title = 'My security - Lily';
  }

  async componentDidMount() {
    await this.loadItems();
  }

  loadItems = async () => {
    const deviceResponse = await Security.query();
    const sessionResponse = await Security.sessions();

    this.setState({
      devices: deviceResponse,
      sessions: sessionResponse.results,
      loading: false
    });
  };

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  confirmDelete = async () => {
    const { t } = this.props;

    try {
      await Security.disable();

      successToast(t('toasts:twoFactorDisabled'));

      await this.loadItems();

      this.closeModal();
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  endSession = async ({ sessionKey }) => {
    const { sessions } = this.state;
    const { t } = this.props;

    try {
      await Security.endSession(sessionKey);

      successToast(t('toasts:security.sessionEnded'));

      const newSessions = sessions.filter(session => session.sessionKey !== sessionKey);

      this.setState({ sessions: newSessions });
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  render() {
    const { devices, sessions, modalOpen, loading } = this.state;
    const { t } = this.props;

    return (
      <React.Fragment>
        {!loading ? (
          <React.Fragment>
            <div className="content-block-container m-b-25">
              <div className="content-block">
                <div className="content-block-header">
                  <div className="content-block-title">
                    <div className="content-block-name">Two factor authentication</div>
                  </div>

                  {devices.default ? (
                    <button className="hl-primary-btn-red" onClick={this.openModal}>
                      Disable
                    </button>
                  ) : (
                    <a
                      href={`${process.env.BASE_URL}two-factor/setup/`}
                      className="hl-primary-btn-blue"
                    >
                      Enable
                    </a>
                  )}
                </div>

                {devices.default ? (
                  <React.Fragment>
                    <div className="content-block-content border-bottom">
                      <strong className="green">Enabled: </strong> {devices.default}
                    </div>

                    <div className="content-block-content border-bottom">
                      {t('preferences:security.backupPhonesInfo')}
                    </div>

                    <div className="content-block-content">
                      {t('preferences:security.backupTokenInfo')}
                    </div>
                  </React.Fragment>
                ) : (
                  <div className="content-block-content">
                    <strong className="red">Disabled: </strong>
                    {t('preferences:security.noTwoFactorEnabled')}
                  </div>
                )}
              </div>
            </div>

            <div className="list">
              <div className="list-header">
                <div className="list-title flex-grow">Active sessions</div>
              </div>

              <table className="hl-table">
                <thead>
                  <tr>
                    <th>IP address</th>
                    <th>Device</th>
                    <th>Logged in</th>
                    <th>Expires in</th>
                    <th>End session</th>
                  </tr>
                </thead>

                <tbody>
                  {sessions.map(session => (
                    <tr key={session.sessionKey}>
                      <td>{session.ip}</td>
                      <td>{session.device}</td>
                      <td>{session.lastLogin}</td>
                      <td>{session.expiresIn}</td>
                      <td>
                        {session.isCurrent ? (
                          <span>(current session)</span>
                        ) : (
                          <button
                            className="hl-primary-btn"
                            onClick={() => this.endSession(session)}
                          >
                            End session
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <LilyModal modalOpen={modalOpen} closeModal={this.closeModal}>
              <div className="modal-header">
                <div className="modal-title">
                  {t('modals:preferences.twoFactorAuth.disable.confirmTitle')}
                </div>
              </div>

              <div className="modal-content">
                {t('modals:preferences.twoFactorAuth.disable.confirmText')}
              </div>

              <div className="modal-footer">
                <button className="hl-primary-btn-red" onClick={this.confirmDelete}>
                  Yes, disable
                </button>
                <button className="hl-primary-btn m-l-10" onClick={this.closeModal}>
                  Cancel
                </button>
              </div>
            </LilyModal>
          </React.Fragment>
        ) : (
          <LoadingIndicator />
        )}
      </React.Fragment>
    );
  }
}

export default withTranslation(['modals', 'preferences', 'toasts'])(UserSecurity);
