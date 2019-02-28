import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import Textarea from 'react-textarea-autosize';

import withContext from 'src/withContext';
import { FORM_DATE_FORMAT } from 'lib/constants';
import LilyModal from 'components/LilyModal';
import LilyDatePicker from 'components/Utils/LilyDatePicker';

class TimeLogModal extends Component {
  constructor(props) {
    super(props);

    const { id, contentType } = props.object;

    const timeLogDefaults = {
      gfkContentType: contentType.id,
      gfkObjectId: id,
      date: new Date(),
      billable: props.currentUser.tenant.billingDefault,
      content: '',
      time: ''
    };

    let timeLog;

    if (props.timeLog) {
      timeLog = Object.assign({}, props.timeLog);

      const { hoursLogged } = timeLog;

      // Convert the logged hours back to human readable format.
      const time = parseFloat(hoursLogged);
      let hours = Math.floor(time);
      hours = hours ? `${hours}h ` : '';

      let minutes = Math.round((time % 1) * 60);
      minutes = minutes ? `${minutes}m` : '';

      timeLog.time = `${hours}${minutes}`;
      timeLog.date = format(parseISO(timeLog.date), FORM_DATE_FORMAT);
    } else {
      timeLog = Object.assign({}, timeLogDefaults);
    }

    this.state = {
      timeLog,
      error: ''
    };
  }

  handleTime = event => {
    const { timeLog } = this.state;

    timeLog.time = event.target.value;

    this.setState({ timeLog });
  };

  handleBillable = () => {
    const { timeLog } = this.state;

    timeLog.billable = !timeLog.billable;

    this.setState({ timeLog });
  };

  handleDate = date => {
    const { timeLog } = this.state;

    timeLog.date = date;

    this.setState({ timeLog });
  };

  handleContent = event => {
    const { timeLog } = this.state;

    timeLog.content = event.target.value;

    this.setState({ timeLog });
  };

  parseTime = () => {
    const { timeLog } = this.state;
    const { t } = this.props;

    // Make it easier to create a regex.
    let time = timeLog.time
      .replace('hours', 'h')
      .replace('hour', 'h')
      .replace('mins', 'm')
      .replace('min', 'm');

    // No number in the given time, so invalid input.
    if (!/[0-9]/i.test(time)) {
      this.setState({ error: t('timeLog.timeLogZeroError') });

      return false;
    }

    let hoursLogged = 0;

    const digitsRegex = /^[0-9]+(\.[0-9]+)?$/;
    if (digitsRegex.test(time)) {
      // No unit given, so default to hours.
      time += 'h';
    }

    const regex = /([\d]+h)?( ?[\d]+m)?/i;
    const match = time.match(regex);

    if (match[1]) {
      hoursLogged += parseFloat(match[1].replace('h', ''));
    }

    if (match[2]) {
      hoursLogged += parseFloat(match[2].replace('m', '')) / 60;
    }

    return hoursLogged;
  };

  submit = async () => {
    const { timeLog } = this.state;
    const { t } = this.props;

    const time = this.parseTime();

    if (time) {
      timeLog.hoursLogged = time;

      await this.props.submitCallback(timeLog);

      this.props.closeModal();
    } else {
      this.setState({ error: t('timeLog.timeLogInvalid') });
    }
  };

  render() {
    const { timeLog, error } = this.state;
    const { modalOpen, closeModal } = this.props;

    return (
      <LilyModal modalOpen={modalOpen} closeModal={closeModal}>
        <div className="modal-header">
          <div className="modal-title text-center flex-grow">Time logging</div>
        </div>

        <div className="modal-content">
          <form className="m-t-15 m-b-25">
            <div className="form-field">
              <div className="display-flex">
                <div className="w-60 m-r-25">
                  <label required>Worked</label>
                  <input
                    id="time"
                    type="text"
                    className="hl-input"
                    placeholder="e.g. 1h 30m"
                    value={timeLog.time}
                    onChange={this.handleTime}
                    onBlur={this.parseTime}
                  />
                </div>

                <div>
                  <label>Billable</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={!timeLog.billable}
                      onChange={this.handleBillable}
                    />
                    <div className="slider round" />
                  </label>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="form-field">
              <label required>Date</label>
              <LilyDatePicker withPortal date={timeLog.date} />
            </div>

            <div className="form-field">
              <label htmlFor="content">Description</label>
              <Textarea
                id="content"
                placeholder="Description"
                minRows={3}
                maxRows={20}
                value={timeLog.content}
                onChange={this.handleContent}
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="hl-primary-btn-blue" onClick={this.submit}>
            Log time
          </button>
          <button className="hl-primary-btn m-l-10" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </LilyModal>
    );
  }
}

export default withTranslation('modals')(withContext(TimeLogModal));
