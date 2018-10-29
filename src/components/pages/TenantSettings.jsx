import React, { Component } from 'react';

import Tenant from 'models/Tenant';

class TenantSettings extends Component {
  constructor(props) {
    super(props);

    this.state = { tenant: {} };

    document.title = 'Settings - Lily';
  }

  async componentDidMount() {
    const tenantResponse = await Tenant.get();

    this.setState({
      tenant: tenantResponse[0]
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

    Tenant.patch(tenant).then(() => {
      // TODO: Show success message.
    });
  };

  render() {
    const { tenant } = this.state;

    return (
      <div className="list">
        <div className="list-header">
          <div className="list-title flex-grow">Additional features</div>
        </div>

        <table className="hl-table">
          <thead>
            <tr>
              <th className="w-20">Name</th>
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
      </div>
    );
  }
}

export default TenantSettings;
