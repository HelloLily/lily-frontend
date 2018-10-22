import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import LilyDate from 'components/Utils/LilyDate';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import Billing from 'models/Billing';

class BillingOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subscription: null,
      customer: null,
      card: null,
      plan: null,
      paymentMethod: null,
      invoices: [],
      loading: true
    };

    document.title = 'Billing - Lily';
  }

  async componentDidMount() {
    const billingResponse = await Billing.get();
    const { subscription, customer, card, plan, invoices } = billingResponse;
    const paymentMethod = customer.paymentMethod ? customer.paymentMethod.type : null;

    this.setState({
      subscription,
      customer,
      card,
      plan,
      paymentMethod,
      invoices,
      loading: false
    });
  }

  render() {
    const { subscription, customer, card, plan, paymentMethod, invoices, loading } = this.state;
    const { currentUser } = this.props;

    return (
      <React.Fragment>
        {!loading ? (
          <div className="content-block-container">
            <div className="content-block">
              <div className="content-block-header">
                <div className="content-block-name">Trial</div>
              </div>

              <div className="content-block-content" />
            </div>

            <div className="content-block m-t-25">
              <div className="content-block-header">
                <div className="content-block-name">Subscription</div>
              </div>

              <div className="content-block-content no-padding">
                <div className="detail-row">
                  <div>Status</div>
                  <div>
                    {currentUser.tenant.isFreePlan ? (
                      <span className="label active">Active</span>
                    ) : (
                      <span className={`label ${subscription.status}`}>{subscription.status}</span>
                    )}
                  </div>
                </div>

                <div className="detail-row">
                  <div>Plan</div>
                  <div>{plan.name}</div>
                </div>

                <div className="detail-row">
                  <div>Price per user</div>
                  <div>
                    {plan.price} x {subscription.planQuantity} users
                  </div>
                </div>

                <div className="detail-row">
                  <div>Total per month</div>
                  <div>{plan.price * subscription.planQuantity}</div>
                </div>

                <div className="detail-row">
                  <div>Next billing date</div>
                  <div>
                    <LilyDate date={subscription.nextBillingAt} />
                  </div>
                </div>
              </div>
            </div>

            <div className="content-block m-t-25">
              <div className="content-block-header">
                <div className="content-block-name">Payment method</div>
              </div>

              <div className="content-block-content no-padding">
                {paymentMethod === 'card' && (
                  <React.Fragment>
                    <div className="detail-row">
                      <div>Card</div>
                      <div className="display-flex">
                        <FontAwesomeIcon
                          icon={['fab', `cc-${card.cardType}`]}
                          size="2x"
                          className="m-r-5"
                        />
                        ending in {card.maskedNumber.replace('*', '')}
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Expiry</div>
                      <div>
                        {card.expiryMonth}/{card.expiryYear}
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>First name</div>
                      <div>{card.firstName}</div>
                    </div>

                    <div className="detail-row">
                      <div>Last name</div>
                      <div>{card.lastName}</div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>

            <div className="content-block m-t-25">
              <div className="content-block-header">
                <div className="content-block-name">Billing information</div>
              </div>

              <div className="content-block-content">
                {customer.billingAddress ? (
                  <div>
                    {customer.billingAddress.firstName} {customer.billingAddress.lastName}
                    <br />
                    {customer.billingAddress.company}
                    <br />
                    {customer.billingAddress.line1}, {customer.billingAddress.city}
                    <br />
                    {customer.billingAddress.country}
                  </div>
                ) : (
                  <div>No billing information found</div>
                )}
              </div>
            </div>

            <div className="content-block m-t-25">
              <div className="content-block-header">
                <div className="content-block-name">Payment history</div>
              </div>

              <div className="content-block-content no-padding">
                <table className="hl-table">
                  <thead>
                    <tr>
                      <th>Invoice number</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Paid on</th>
                      <th>Amount</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.map(invoice => (
                      <tr key={invoice.invoice.id}>
                        <td>{invoice.invoice.id}</td>
                        <td>{invoice.invoice.status}</td>
                        <td>
                          <LilyDate date={invoice.invoice.date} />
                        </td>
                        <td>
                          <LilyDate date={invoice.invoice.paidAt} />
                        </td>
                        <td>{invoice.invoice.total}</td>
                        <td>
                          <button className="hl-primary-btn borderless">Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <LoadingIndicator />
        )}
      </React.Fragment>
    );
  }
}

export default withContext(BillingOverview);
