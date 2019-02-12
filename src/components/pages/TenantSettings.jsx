import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import { successToast } from 'utils/toasts';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import FeatureBlock from 'components/Utils/FeatureBlock';
import Tenant from 'models/Tenant';

class TenantSettings extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = { tenant: null };

    document.title = 'Settings - Lily';
  }

  async componentDidMount() {
    this.mounted = true;

    const tenantResponse = await Tenant.get();

    if (this.mounted) {
      this.setState({
        tenant: tenantResponse[0]
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  toggleField = field => {
    const { tenant } = this.state;

    tenant[field] = !tenant[field];

    this.setState({ tenant });
    this.saveSettings();
  };

  saveSettings = () => {
    const { tenant } = this.state;
    const { t } = this.props;

    Tenant.patch(tenant).then(() => {
      successToast(t('toasts:tenantUpdated'));
    });
  };

  render() {
    const { tenant } = this.state;
    const { t } = this.props;

    return tenant ? (
      <div className="list">
        <div className="list-header">
          <div className="list-title flex-grow">{t('preferences:settings.header')}</div>
        </div>

        <FeatureBlock tier="1" needsAdmin>
          <table className="hl-table">
            <thead>
              <tr>
                <th className="w-20">Name</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className={tenant.billing.isFreePlan ? 'is-disabled' : ''}>
              <tr>
                <td>Time logging</td>
                <td>{t('preferences:settings.timeLogging')}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={tenant.timeloggingEnabled || false}
                      onChange={() => this.toggleField('timeloggingEnabled')}
                    />
                    <div className="slider round" />
                  </label>
                </td>
              </tr>

              {tenant.timeloggingEnabled && (
                <tr>
                  <td>Billable default value</td>
                  <td>{t('preferences:settings.billingDefault')}</td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" onChange={() => this.toggleField('billingDefault')} />
                      <div className="slider round" />
                    </label>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </FeatureBlock>
      </div>
    ) : (
      <LoadingIndicator />
    );
  }
}

export default withTranslation(['preferences', 'toasts'])(TenantSettings);
