import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import List from 'components/List';
import BlockUI from 'components/Utils/BlockUI';
import Tenant from 'models/Tenant';

class TenantSettings extends Component {
  constructor(props) {
    super(props);

    this.state = { tenant: {}, loading: true };
  }

  async componentDidMount() {
    const tenantResponse = await Tenant.get();

    this.setState({
      tenant: tenantResponse[0],
      loading: false
    });
  }

  toggleField = field => {
    const { tenant } = this.state;

    tenant[field] = !tenant[field];

    this.setState({ tenant });
    this.saveSettings();
  };

  saveSettings = () => {
    const { tenant } = this.state;

    this.setState({ loading: true });

    Tenant.patch(tenant).then(() => {
      this.setState({ loading: false });
    });
  };

  render() {
    const { tenant, loading } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <div className="list-title flex-grow">Additional features</div>
          </div>

          <table className="hl-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Time logging</td>
                <td>Enable this feature so users can log hours on cases and deals.</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      onChange={() => this.toggleField('timeLoggingEnabled')}
                    />
                    <div className="slider round" />
                  </label>
                </td>
              </tr>

              {tenant.timeLoggingEnabled && (
                <tr>
                  <td>Billable default value</td>
                  <td>{"Sets the default for the 'Billable' value for logged hours."}</td>
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
        </List>
      </BlockUI>
    );
  }
}

export default TenantSettings;
