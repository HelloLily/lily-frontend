import React, { Component } from 'react';
import { isBefore, format } from 'date-fns';
import { withNamespaces } from 'react-i18next';

import { FORM_DATE_FORMAT, API_DATE_FORMAT, ESCAPE_KEY } from 'lib/constants';
import updateModel from 'utils/updateModel';
import LilyDatePicker from 'components/Utils/LilyDatePicker';
import addBusinessDays from 'utils/addBusinessDays';
import LilyTooltip from 'components/LilyTooltip';
import LilyDate from 'components/Utils/LilyDate';

class Postpone extends Component {
  constructor(props) {
    super(props);

    this.postponeRef = React.createRef();
    this.postponeContainer = React.createRef();
    this.datepicker = React.createRef();
    this.appElement = document.getElementById('app');

    const date = props.object[props.field];

    this.state = {
      date: new Date(date),
      menuOpen: false,
      datepickerOpen: false,
      submitting: false
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.closeMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.closeMenu);
  }

  PostponeButton = ({ amount, children }) => {
    const { submitting } = this.state;
    const newDate = this.futureDate(amount);

    return (
      <button
        className={`hl-primary-btn borderless${submitting ? ' is-disabled' : ''}`}
        onClick={() => this.submitData(newDate)}
      >
        {children}

        <div className="text-muted float-right">
          (<LilyDate date={newDate} />)
        </div>
      </button>
    );
  };

  toggleDatepicker = () => {
    const { datepickerOpen } = this.state;
    this.setState({ datepickerOpen: !datepickerOpen });
  };

  formatDate = dateObject => format(dateObject, FORM_DATE_FORMAT);

  showMenu = () => {
    this.setState({ menuOpen: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  };

  closeMenu = event => {
    const postponeContainer = this.postponeContainer.current;
    const closeMenu =
      event.keyCode === ESCAPE_KEY ||
      (postponeContainer && !postponeContainer.contains(event.target));

    if (closeMenu) {
      this.setState({ menuOpen: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  };

  submitData = async date => {
    const { object, field } = this.props;

    this.setState({ submitting: true });

    const args = {
      id: object.id,
      [field]: format(date, API_DATE_FORMAT)
    };

    await updateModel(object, args);

    this.setState({
      date,
      menuOpen: false,
      datepickerOpen: false,
      submitting: false
    });
  };

  futureDate = amount => {
    const { object, field } = this.props;

    const date = object[field];
    const isPastDate = isBefore(new Date(date), new Date());
    const baseDate = isPastDate ? new Date() : new Date(date);

    return addBusinessDays(amount, baseDate);
  };

  render() {
    const { date, menuOpen, submitting } = this.state;
    const { object, field, t } = this.props;
    const { PostponeButton } = this;

    const tooltipId = `item-${object.id}-${field}`;

    return (
      <React.Fragment>
        <div className="postpone" ref={this.postponeRef}>
          <button
            className="hl-primary-btn-link"
            data-tip={t('postpone')}
            data-for={tooltipId}
            onClick={this.showMenu}
          >
            <i className="lilicon hl-postpone-icon m-r-5" />

            <LilyDate date={date} />
          </button>

          <LilyTooltip id={tooltipId} />

          {menuOpen ? (
            <div className="postpone-container" ref={this.postponeContainer}>
              <div className="postpone-buttons">
                <div className="postpone-header">{t(`${object.contentType.model}Postpone`)}</div>

                <PostponeButton>Set to today</PostponeButton>
                <PostponeButton amount={1}>Add 1 day</PostponeButton>
                <PostponeButton amount={2}>Add 2 days</PostponeButton>
                <PostponeButton amount={5}>Add 1 week</PostponeButton>
              </div>

              <div>
                <div className="postpone-header">{t('customPostponeDate')}</div>
                <LilyDatePicker
                  inline
                  date={date}
                  minDate={date}
                  onChange={this.submitData}
                  submitting={submitting}
                />
              </div>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default withNamespaces('tooltips')(Postpone);
