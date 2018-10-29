import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import { successToast, errorToast } from 'utils/toasts';
import BlockUI from 'components/Utils/BlockUI';
import User from 'models/User';

class TokenForm extends Component {
  constructor(props) {
    super(props);

    this.state = { token: '', loading: true };

    document.title = 'My API token - Lily';
  }

  componentDidMount = async () => {
    const response = await User.token();

    this.setState({ token: response.authToken, loading: false });
  };

  deleteToken = async () => {
    const { t } = this.props;

    try {
      await User.deleteToken();

      this.setState({ token: '' });

      successToast(t('toasts:apiTokenDeleted'));
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  generateToken = async () => {
    const { t } = this.props;

    try {
      const response = await User.generateToken();

      this.setState({ token: response.authToken });

      successToast(t('toasts:apiTokenCreated'));
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  render() {
    const { token, loading } = this.state;
    const { t } = this.props;

    return (
      <BlockUI blocking={loading}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">My API token</div>
            </div>

            <div className="content-block-content">
              <div>
                <strong>Your token is: </strong>

                {token ? (
                  <code>{token}</code>
                ) : (
                  <span>{t('preferences:user.apiToken.noToken')}</span>
                )}
              </div>

              <div className="m-t-15">
                {token ? (
                  <React.Fragment>
                    <p>{t('preferences:user.apiToken.usageInfo')}</p>

                    <pre>
                      <code>Authorization: Token {token}</code>
                    </pre>

                    <p>{t('preferences:user.apiToken.usageInfoAlt')}</p>

                    <pre>
                      <code>{`/api/<endpoint>/?key=${token}`}</code>
                    </pre>
                  </React.Fragment>
                ) : (
                  <div className="label info">{t('preferences:user.apiToken.noTokenInfo')}</div>
                )}
              </div>
            </div>

            <div className="content-block-footer">
              <button className="hl-primary-btn-red" onClick={this.deleteToken}>
                Delete token
              </button>

              <button className="hl-primary-btn-blue m-l-10" onClick={this.generateToken}>
                Generate token
              </button>
            </div>
          </div>
        </div>
      </BlockUI>
    );
  }
}

export default withNamespaces(['alerts', 'preferences'])(withContext(TokenForm));
