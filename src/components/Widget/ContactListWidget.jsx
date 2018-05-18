import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Widget from 'components/Widget';
import BlockUI from 'components/Utils/BlockUI';
import Contact from 'models/Contact';

class ContactListWidget extends Component {
  constructor(props) {
    super(props);

    this.state = { items: [], loading: true };
  }

  componentDidMount = async () => {
    const contactRequest = await Contact.query({ account: this.props.object });

    this.setState({ items: contactRequest.results, loading: false });
  };

  render() {
    const { items, loading } = this.state;
    const { object } = this.props;

    const title = (
      <React.Fragment>
        <div className="widget-label" />
        <div className="widget-name">
          <i className="lilicon hl-entities-icon m-r-5" />
          {!object.contentType ? (
            <div>
              Colleagues at <NavLink to={`/accounts/${object.id}`}>{object.name}</NavLink>
            </div>
          ) : (
            <React.Fragment>
              <NavLink to={`/contacts/${object.id}/edit`}>Edit</NavLink>
              <span className="m-l-5">to link with an account</span>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );

    return (
      <div>
        <BlockUI blocking={loading}>
          <Widget title={title} component="caseListWidget">
            <table className="hl-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact information</th>
                </tr>
              </thead>

              {items.map(item => (
                <tbody key={item.id}>
                  <tr>
                    <td>
                      <NavLink to={`/contacts/${item.id}`}>{item.fullName}</NavLink>
                      {!item.functions.filter(account => account.id === object.id).isActive}
                    </td>
                    <td>
                      {item.primaryEmail &&
                        object.primaryEmail && (
                          <div>
                            <i className="lilicon hl-company-icon m-r-5" />
                            <NavLink to={`/email/compose/${object.primaryEmail.emailAddress}`}>
                              {object.primaryEmail.emailAddress}
                            </NavLink>
                          </div>
                        )}

                      {item.primaryEmail && (
                        <div>
                          <NavLink to={`/email/compose/${item.primaryEmail.emailAddress}`}>
                            {item.primaryEmail.emailAddress}
                          </NavLink>
                        </div>
                      )}

                      {!item.phoneNumber &&
                        object.phoneNumber && (
                          <div>
                            <i className="lilicon hl-company-icon m-r-5" />
                            <a href={`tel:${object.phoneNumber.number}`}>
                              {object.phoneNumber.number}
                            </a>
                          </div>
                        )}

                      {item.phoneNumber && (
                        <div>
                          <a href={`tel:${item.phoneNumber.number}`}>{item.phoneNumber.number}</a>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </Widget>
        </BlockUI>
      </div>
    );
  }
}

export default ContactListWidget;
