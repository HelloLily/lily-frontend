import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ContentBlock from 'components/ContentBlock';
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
        <div className="content-block-label" />
        <div className="content-block-name">
          <i className="lilicon hl-entities-icon m-r-5" />
          {!object.contentType || object.contentType.model === 'account' ? (
            <div>
              Colleagues at <Link to={`/accounts/${object.id}`}>{object.name}</Link>
            </div>
          ) : (
            <React.Fragment>
              <Link to={`/contacts/${object.id}/edit`}>Edit</Link>
              <span className="m-l-5">to link with an account</span>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );

    return (
      <div>
        <BlockUI blocking={loading}>
          <ContentBlock title={title} component="caseListWidget">
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
                      <Link to={`/contacts/${item.id}`}>{item.fullName}</Link>
                      {!item.functions.filter(account => account.id === object.id).isActive && (
                        <span> (inactive)</span>
                      )}
                    </td>
                    <td>
                      {item.primaryEmail &&
                        object.primaryEmail && (
                          <div>
                            <i className="lilicon hl-company-icon m-r-5" />
                            <Link to={`/email/compose/${object.primaryEmail.emailAddress}`}>
                              {object.primaryEmail.emailAddress}
                            </Link>
                          </div>
                        )}

                      {item.primaryEmail && (
                        <div>
                          <Link to={`/email/compose/${item.primaryEmail.emailAddress}`}>
                            {item.primaryEmail.emailAddress}
                          </Link>
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
          </ContentBlock>
        </BlockUI>
      </div>
    );
  }
}

export default ContactListWidget;
