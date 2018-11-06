import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import { del } from 'lib/api';
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

    document.title = 'Security - Lily';
  }

  async componentDidMount() {
    const deviceResponse = await Security.query();
    const sessionResponse = await Security.sessions();

    this.setState({
      devices: deviceResponse,
      sessions: sessionResponse.results,
      loading: false
    });
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  confirmDelete = async () => {
    const { item, deleteCallback, t } = this.props;

    try {
      await Security.disable();

      const text = t('toasts:twoFactorDisabled');
      successToast(text);

      this.closeModal();

      if (deleteCallback) {
        deleteCallback(item);
      }
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
                    <button className="hl-primary-btn-blue">Enable</button>
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
                          <button className="hl-primary-btn">End session</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <LilyModal modalOpen={modalOpen} closeModal={this.closeModal} alignCenter>
              <div className="modal-header">
                <div className="modal-title">
                  {t('alerts:preferences.twoFactorAuth.disable.confirmTitle')}
                </div>
              </div>

              <div className="modal-content">
                {t('alerts:preferences.twoFactorAuth.disable.confirmText')}
              </div>

              <div className="modal-footer">
                <button className="hl-primary-btn-red" onClick={this.confirm}>
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

export default withNamespaces(['alerts', 'preferences', 'toasts'])(UserSecurity);
