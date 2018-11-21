import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LoadingIndicator from 'components/Utils/LoadingIndicator';
import LilyCurrency from 'components/Utils/LilyCurrency';
import FormSection from 'components/Form/FormSection';
import Billing from 'models/Billing';
import { errorToast, successToast } from 'src/utils/toasts';

class BillingChangePlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plans: [],
      subscription: null,
      currentPlan: null,
      selectedPlan: null,
      loading: true
    };

    document.title = 'Billing - Lily';
  }

  async componentDidMount() {
    const planResponse = await Billing.plans();

    const { plans, subscription, currentPlan } = planResponse;

    this.setState({
      plans,
      subscription,
      currentPlan,
      selectedPlan: currentPlan.id,
      loading: false
    });
  }

  handleSubmit = async () => {
    const { history, t } = this.props;

    const response = await Billing.patch({ planId: this.state.selectedPlan });

    if (response.url) {
      window.location.href = response.url;
    } else if (response.success) {
      // Changed to free plan, so no need to visit Chargebee.
      successToast(t('subscriptionUpdated'));
      history.push('/preferences/billing');
    } else {
      errorToast(t('subscriptionError'));
    }
  };

  render() {
    const { plans, subscription, currentPlan, selectedPlan, loading } = this.state;

    return (
      <React.Fragment>
        {!loading ? (
          <div className="content-block-container">
            <div className="content-block">
              <div className="content-block-header">
                <div className="content-block-name">Trial</div>
              </div>

              <div className="content-block-content">
                <FormSection header="Current plan">
                  <h3>{currentPlan.name}</h3>
                  <div>
                    <strong>
                      <LilyCurrency
                        value={currentPlan.price / 100}
                        currency={currentPlan.currencyCode}
                      />
                    </strong>{' '}
                    <span className="text-muted">({subscription.planQuantity} users)</span>
                  </div>
                </FormSection>

                <FormSection header="Select a plan">
                  <div className="display-flex m-b-15">
                    {plans.map(plan => {
                      const { id, description, name, price, currencyCode } = plan.plan;
                      const className = `plan-item${selectedPlan === id ? ' is-selected' : ''}`;

                      return (
                        <div key={id} className={className}>
                          <h3>{name}</h3>
                          <h4>
                            <LilyCurrency value={price / 100} currency={currencyCode} />
                          </h4>
                          <div className="text-muted">{description}</div>
                          <button
                            className="hl-primary-btn"
                            onClick={() => this.setState({ selectedPlan: id })}
                          >
                            Select
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <a
                    href="https://hellolily.com/pricing/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More info about plans and pricing
                  </a>
                </FormSection>

                <div className="form-section">
                  <div className="form-section-heading no-border" />
                  <div className="form-section-content">
                    <button
                      className="hl-primary-btn-blue"
                      onClick={this.handleSubmit}
                      disabled={loading}
                      type="button"
                    >
                      <FontAwesomeIcon icon="check" /> Save
                    </button>

                    <button type="button" className="hl-primary-btn m-l-10" disabled={loading}>
                      Cancel
                    </button>
                  </div>
                </div>
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

export default withNamespaces('toasts')(withRouter(BillingChangePlan));
