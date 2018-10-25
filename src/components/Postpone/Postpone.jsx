import React, { Component } from 'react';
import { isBefore, format } from 'date-fns';
import DayPicker from 'react-day-picker';
import { withNamespaces } from 'react-i18next';

import { FORM_DATE_FORMAT, API_DATE_FORMAT } from 'lib/constants';
import updateModel from 'utils/updateModel';
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
      dateInput: date,
      submitting: false
    };
  }

  PostponeButton = ({ amount, children }) => {
    const { submitting } = this.state;
    const newDate = this.futureDate(amount);

    return (
      <button
        className={`hl-primary-btn borderless${submitting ? ' is-disabled' : ''}`}
        onClick={() => this.submitData(newDate)}
      >
        {children} (<LilyDate date={newDate} />)
      </button>
    );
  };

  toggleDatepicker = () => {
    this.setState({ datepickerOpen: !this.state.datepickerOpen });
  };

  formatDate = dateObject => format(dateObject, FORM_DATE_FORMAT);

  showMenu = () => {
    this.setState({ menuOpen: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  };

  closeMenu = event => {
    const postponeContainer = this.postponeContainer.current;

    if (postponeContainer && !postponeContainer.contains(event.target)) {
      this.setState({ menuOpen: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  };

  handleDate = event => {
    this.setState({ dateInput: event.target.value });
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
    const { date, menuOpen, datepickerOpen, dateInput, submitting } = this.state;
    const { field, t } = this.props;
    const { PostponeButton } = this;

    return (
      <React.Fragment>
        <div className="postpone" ref={this.postponeRef}>
          <button className="hl-primary-btn-link" data-tip={t('postpone')} onClick={this.showMenu}>
            <i className="lilicon hl-postpone-icon m-r-5" />

            <LilyDate date={date} />
          </button>

          <LilyTooltip />

          {menuOpen ? (
            <div className="postpone-container" ref={this.postponeContainer}>
              <div className="postpone-buttons">
                <div className="postpone-header">Postpone the {field} date</div>

                <PostponeButton>Set to today</PostponeButton>
                <PostponeButton amount={1}>Add 1 day</PostponeButton>
                <PostponeButton amount={2}>Add 2 days</PostponeButton>
                <PostponeButton amount={5}>Add 1 week</PostponeButton>

                <div className={`datepicker-input${submitting ? ' is-disabled' : ''}`}>
                  <div className="small">Pick a custom date</div>

                  <div className="input-addon">
                    <input
                      className="hl-input"
                      onChange={this.handleDate}
                      value={dateInput}
                      placeholder="Select a date"
                    />

                    <button
                      className="hl-primary-btn"
                      onClick={this.toggleDatepicker}
                      type="button"
                    >
                      <i className="lilicon hl-calendar-icon" />
                    </button>
                  </div>
                </div>
              </div>

              {datepickerOpen && (
                <DayPicker
                  showOutsideDays
                  disabledDays={[{ daysOfWeek: [0, 6] }]}
                  firstDayOfWeek={1}
                  onDayClick={this.submitData}
                  className={`${submitting ? 'is-disabled' : ''}`}
                  formatDate={this.formatDate}
                  value={dateInput}
                  selectedDays={new Date(date)}
                />
              )}
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default withNamespaces('tooltips')(Postpone);
