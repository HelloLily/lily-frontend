import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { parse } from 'date-fns';

import withContext from 'src/withContext';
import ucfirst from 'utils/ucfirst';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import LilyDate from 'components/Utils/LilyDate';
import LilyCurrency from 'components/Utils/LilyCurrency';
import Billing from 'models/Billing';

class BillingOverview extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      subscription: null,
      customer: null,
      card: null,
      plan: null,
      paymentMethod: null,
      invoices: [],
      loading: true
    };

    document.title = 'Subscription - Lily';
  }

  async componentDidMount() {
    this.mounted = true;

    const billingResponse = await Billing.get();
    const { subscription, customer, card, plan, invoices } = billingResponse;
    const paymentMethod = customer.paymentMethod ? customer.paymentMethod.type : null;

    if (this.mounted) {
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
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { subscription, customer, card, plan, paymentMethod, invoices, loading } = this.state;
    const { currentUser, t } = this.props;

    const { trialRemaining } = currentUser.tenant;
    const unit = t('billing.unit', { count: trialRemaining });

    return (
      <React.Fragment>
        {!loading ? (
          <div className="content-block-container">
            {currentUser.tenant.billing.plan.tier !== 0 && (
              <div className="content-block m-b-25">
                <div className="content-block-header">
                  <div className="content-block-name">Trial</div>
                </div>

                <div className="content-block-content">
                  <p>
                    <Trans
                      defaults={t('billing.trialInfoLine1', {
                        amount: currentUser.tenant.trialRemaining,
                        unit
                      })}
                      components={[<strong>text</strong>]}
                    />

                    <span> {t('billing.trialInfoLine2')}</span>
                  </p>

                  <p>{t('billing.trialInfoLine3')}</p>

                  <p>
                    Read more about all
                    <a
                      href="https://hellolily.com/features/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span> Features</span>
                    </a>
                    <span> and </span>
                    <a
                      href="https://hellolily.com/pricing/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pricing
                    </a>{' '}
                    and send us a message if you have any questions.
                  </p>
                </div>
              </div>
            )}

            <div className="content-block">
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
                      <span className={`label ${subscription.status.replace('_', '-')}`}>
                        {subscription.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-row">
                  <div>Plan</div>
                  <div>
                    {plan.name}

                    <Link to="/preferences/billing/change" className="hl-interface-btn">
                      <FontAwesomeIcon icon={['far', 'pencil-alt']} />
                    </Link>
                  </div>
                </div>

                <div className="detail-row">
                  <div>Price per user</div>
                  <div>
                    <LilyCurrency value={plan.price / 100} currency={plan.currencyCode} /> x{' '}
                    {subscription.planQuantity} users
                  </div>
                </div>

                <div className="detail-row">
                  <div>Total per month</div>
                  <div>
                    <LilyCurrency
                      value={(plan.price / 100) * subscription.planQuantity}
                      currency={plan.currencyCode}
                    />
                  </div>
                </div>

                <div className="detail-row">
                  <div>Next billing date</div>
                  <div>
                    <LilyDate date={parse(subscription.nextBillingAt, 't', new Date())} />
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
                        <td>{ucfirst(invoice.invoice.status)}</td>
                        <td>
                          <LilyDate date={parse(invoice.invoice.date, 't', new Date())} />
                        </td>
                        <td>
                          <LilyDate date={parse(invoice.invoice.paidAt, 't', new Date())} />
                        </td>
                        <td>
                          <LilyCurrency
                            value={invoice.invoice.total / 100}
                            currency={invoice.invoice.currencyCode}
                          />
                        </td>
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

export default withTranslation('preferences')(withContext(BillingOverview));
