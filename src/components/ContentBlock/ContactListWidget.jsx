import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import BlockUI from 'components/Utils/BlockUI';
import ContentBlock from 'components/ContentBlock';
import LilyTooltip from 'components/LilyTooltip';
import Contact from 'models/Contact';

class ContactListWidget extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = { items: [], loading: true };
  }

  async componentDidMount() {
    const { account } = this.props;

    this.mounted = true;

    let items = [];

    if (account) {
      const contactRequest = await Contact.query({ 'accounts.id': account.id });

      items = contactRequest.results;
    }

    if (this.mounted) {
      this.setState({ items, loading: false });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setSidebar = () => {
    this.props.setSidebar('contact', { object: this.props.object });
  };

  render() {
    const { items, loading } = this.state;
    const { object, account, t } = this.props;

    const title = (
      <React.Fragment>
        <div className="content-block-label" />
        <div className="content-block-name">
          <i className="lilicon hl-entities-icon m-r-5" />
          {account ? (
            <div>
              Colleagues at <Link to={`/accounts/${account.id}`}>{account.name}</Link>
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

    const extra = (
      <button className="hl-primary-btn" onClick={this.setSidebar}>
        <FontAwesomeIcon icon="plus" /> Contact
      </button>
    );

    return (
      <div>
        <BlockUI blocking={loading}>
          <ContentBlock title={title} extra={extra} component="contactListWidget">
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
                      {!item.functions.filter(func => func.id === object.id).isActive && (
                        <span> (inactive)</span>
                      )}
                    </td>
                    <td>
                      {item.primaryEmail && object.primaryEmail && (
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

                      {!item.phoneNumber && object.phoneNumber && (
                        <div>
                          <i
                            className="lilicon hl-company-icon m-r-5"
                            data-tip={t('contactListInfoTooltip')}
                            data-for={`contact-${item.id}`}
                          />
                          <a href={`tel:${object.phoneNumber.number}`}>
                            {object.phoneNumber.number}
                          </a>

                          <LilyTooltip id={`contact-${item.id}`} />
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

              {items.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan="2">No colleagues</td>
                  </tr>
                </tbody>
              )}
            </table>
          </ContentBlock>
        </BlockUI>
      </div>
    );
  }
}

export default withNamespaces('tooltips')(withContext(ContactListWidget));
