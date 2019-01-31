import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parse } from 'date-fns';

import { API_DATE_FORMAT } from 'lib/constants';
import Editable from 'components/Editable';
import LilyDate from 'components/Utils/LilyDate';
import TimeLogDisplay from 'components/Utils/TimeLogDisplay';
import TimeLogModal from 'components/TimeLogModal';
import StreamAvatar from './StreamAvatar';

class StreamTimeLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };
  }

  submit = args => {
    args.date = format(parse(args.date, 'dd/MM/yyyy', new Date()), API_DATE_FORMAT);

    this.props.submitCallback(this.props.item, args);
  };

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const { modalOpen } = this.state;
    const { item, deleteCallback } = this.props;

    return (
      <React.Fragment>
        <StreamAvatar object={item} field="user" />

        <div className="stream-item">
          <div className="stream-item-header">
            <LilyDate date={item.date} includeTime />
          </div>
          <div className="stream-item-title">
            <div>{item.user.fullName} logged time</div>

            <div>
              <button className="hl-primary-btn borderless" onClick={this.openModal}>
                <FontAwesomeIcon icon={['far', 'pencil-alt']} /> Edit
              </button>

              <button className="hl-primary-btn borderless" onClick={() => deleteCallback(item)}>
                <FontAwesomeIcon icon={['far', 'trash-alt']} /> Delete
              </button>
            </div>
          </div>

          <div className="stream-item-content is-timelog">
            <div className="stream-item-extra-info">
              <div>
                <strong className="m-l-5">Logged time:</strong>

                <TimeLogDisplay timeLogs={item} />
              </div>

              <div>
                <strong>Billable: </strong>

                {item.billable ? (
                  <React.Fragment>
                    <FontAwesomeIcon icon={['far', 'check']} className="green" /> Yes
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <FontAwesomeIcon icon={['far', 'times']} className="red" /> No
                  </React.Fragment>
                )}
              </div>
            </div>

            <div className="stream-item-body">
              <Editable
                type="textarea"
                object={item}
                field="content"
                submitCallback={this.submitTimeLog}
              />
            </div>
          </div>

          <TimeLogModal
            modalOpen={modalOpen}
            closeModal={this.closeModal}
            submitCallback={this.submit}
            timeLog={item}
            object={item}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default StreamTimeLog;
