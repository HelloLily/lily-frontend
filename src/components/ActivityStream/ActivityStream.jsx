import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getYear, getMonth } from 'date-fns';
import { toast } from 'react-toastify';
import cx from 'classnames';

import { patch, del } from 'lib/api';
import { successToast } from 'utils/toasts';
import LilyDate from 'components/Utils/LilyDate';
import Note from 'models/Note';
import setupActivityStream from './setupActivityStream';
import StreamCase from './StreamCase';
import StreamDeal from './StreamDeal';
import StreamEmail from './StreamEmail';
import StreamNote from './StreamNote';
import StreamCall from './StreamCall';
import StreamChange from './StreamChange';
import StreamTimeLog from './StreamTimeLog';

const components = {
  case: StreamCase,
  deal: StreamDeal,
  emailmessage: StreamEmail,
  note: StreamNote,
  callrecord: StreamCall,
  change: StreamChange,
  timelog: StreamTimeLog
};

class ActivityStream extends Component {
  constructor(props) {
    super(props);

    const note = {
      gfkObjectId: props.object.id,
      gfkContentType: props.object.contentType.id,
      content: ''
    };

    this.state = {
      note,
      activityStream: [],
      options: [],
      collapsed: [],
      loading: true,
      filter: null
    };
  }

  async componentDidMount() {
    const { object, dateStart, dateEnd } = this.props;

    const { activityStream, options } = await setupActivityStream(object, dateStart, dateEnd);

    this.setState({ activityStream, options, loading: false });
  }

  setSelection = option => {
    this.setState({ filter: option.id });
  };

  submitNote = async () => {
    const { t } = this.props;
    const { activityStream, note } = this.state;

    try {
      const response = await Note.post(note);
      response.activitySortDate = response.created;
      activityStream.unshift(response);

      const text = t('modelCreated', { model: 'note' });

      successToast(text);

      note.content = '';

      this.setState({ activityStream, note });
    } catch (e) {
      toast.error('Oopsie');
    }
  };

  submitItemNote = async (item, note) => {
    const { activityStream } = this.state;

    const response = await Note.post(note);
    const index = activityStream.findIndex(streamItem => streamItem.id === item.id);
    activityStream[index].notes.unshift(response);

    this.setState({ activityStream });
  };

  deleteItemNote = async (item, note) => {
    const { activityStream } = this.state;

    await Note.del(note.id);
    const index = activityStream.findIndex(streamItem => streamItem.id === item.id);
    const noteIndex = item.notes.findIndex(itemNote => itemNote.id === note.id);
    activityStream[index].notes.splice(noteIndex, 1);

    this.setState({ activityStream });
  };

  togglePinned = async args => {
    const { t } = this.props;
    const { activityStream } = this.state;

    await Note.patch(args);
    const index = activityStream.findIndex(streamItem => streamItem.id === args.id);
    activityStream[index].isPinned = args.isPinned;

    const text = t('modelUpdated', { model: 'note' });
    successToast(text);

    this.setState({ activityStream });
  };

  handleContent = event => {
    const { note } = this.state;

    note.content = event.target.value;

    this.setState({ note });
  };

  toggleCollapse = category => {
    const { collapsed } = this.state;
    const index = collapsed.findIndex(item => item === category);

    if (index === -1) {
      // The given category isn't collapsed, so add it to the array.
      collapsed.push(category);
    } else {
      // Otherwise remove it from the array.
      collapsed.splice(index, 1);
    }

    this.setState({ collapsed });
  };

  submitCallback = (item, args) => patch(`/${item.contentType.appLabel}/${item.id}/`, args);

  deleteCallback = async item => {
    const { activityStream } = this.state;

    await del(`/${item.contentType.appLabel}/${item.id}/`);
    // Find the given item and remove it from the activity stream;
    const index = activityStream.findIndex(streamItem => streamItem.id === item.id);
    activityStream.splice(index, 1);

    // TODO: Add notification on success.

    this.setState({ activityStream });
  };

  orderActivityStream = () => {
    const { activityStream } = this.state;

    const orderedActivityStream = {
      pinned: [],
      nonPinned: {},
      totalItems: activityStream.length
    };
    const parentObject = null;

    activityStream.forEach(item => {
      const parentObjectId = parentObject ? parentObject.id : null;

      if (item.isPinned) {
        // Pinned notes are shown separately and always on top.
        orderedActivityStream.pinned.push(item);
      } else {
        const date = new Date(item.activitySortDate);
        const key = `${getYear(date)}-${getMonth(date) + 1}`;

        if (!orderedActivityStream.nonPinned.hasOwnProperty(key)) {
          // Split the activity stream by year/month.
          orderedActivityStream.nonPinned[key] = { isVisible: true, items: [] };
        }

        item.shown = true;

        orderedActivityStream.nonPinned[key].items.push(item);
      }
    });

    return orderedActivityStream;
  };

  render() {
    const { note, options, collapsed, filter, loading } = this.state;
    const { object } = this.props;
    const activityStream = this.orderActivityStream(this.state.activityStream);
    const defaultProps = {
      object,
      submitCallback: this.submitCallback,
      deleteCallback: this.deleteCallback,
      submitItemNote: this.submitItemNote,
      deleteItemNote: this.deleteItemNote,
      togglePinned: this.togglePinned
    };

    return (
      <div className="activity-stream">
        {!loading ? (
          <React.Fragment>
            <div className="activity-stream-filter capitalize">
              <div className="radio-button-group">
                {options.map((option, index) => {
                  const isSelected = filter === option.id;
                  const radioId = `radio-activity-stream-${index}`;
                  const className = cx('radio-button', {
                    active: isSelected
                  });

                  return (
                    <label className={className} key={option.id} htmlFor={radioId}>
                      <input
                        type="radio"
                        id={radioId}
                        className="radio-button-input"
                        checked={isSelected}
                        onChange={() => this.setSelection(option)}
                      />

                      <span className={`radio-button-label is-${option.model}`}>
                        {isSelected && <span className="radio-button-checkmark" />}

                        {option.appLabel === 'timelogs' ? (
                          <span>Logged time</span>
                        ) : (
                          <span>{option.appLabel}</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="activity-stream-list">
              <div className="activity-stream-image">
                <i className="lilicon hl-note-icon" />
              </div>

              <div>
                <textarea
                  value={note.content}
                  onChange={this.handleContent}
                  className="hl-input"
                  placeholder="Write your note here"
                />

                <div className="float-right">
                  <button className="hl-primary-btn-blue" onClick={this.submitNote}>
                    Add note
                  </button>
                </div>
              </div>

              {activityStream.pinned.length > 0 && (
                <React.Fragment>
                  <div className="activity-stream-indicator" />

                  <div className="activity-stream-category">Pinned</div>

                  <React.Fragment>
                    {activityStream.pinned.map(item => {
                      const StreamComponent = components[item.contentType.model];

                      return (
                        <StreamComponent
                          item={item}
                          key={`${item.contentType.model}-${item.id}`}
                          {...defaultProps}
                        />
                      );
                    })}
                  </React.Fragment>
                </React.Fragment>
              )}

              {Object.keys(activityStream.nonPinned).map(key => {
                const category = activityStream.nonPinned[key];
                // Only show items which have the same content type as the selected filter.
                const items = filter
                  ? category.items.filter(item => item.contentType.id === filter)
                  : category.items;
                const isCollapsed = collapsed.includes(key);

                return items.length ? (
                  <React.Fragment key={key}>
                    <div className="activity-stream-indicator" />

                    <div
                      className="activity-stream-category"
                      onClick={() => this.toggleCollapse(key)}
                    >
                      <LilyDate date={key} format="MMMM y" />

                      <div>
                        <i
                          className={`lilicon ${
                            isCollapsed ? 'hl-toggle-down-icon' : 'hl-toggle-up-icon'
                          }`}
                        />
                      </div>
                    </div>

                    {!isCollapsed && (
                      <React.Fragment>
                        {items.map(item => {
                          const StreamComponent = components[item.contentType.model];

                          return (
                            <StreamComponent
                              item={item}
                              key={`${item.contentType.model}-${item.id}`}
                              {...defaultProps}
                            />
                          );
                        })}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : null;
              })}
            </div>
          </React.Fragment>
        ) : (
          <div className="inbox-loading">
            <div className="loading-header m-l-10">
              Loading activity stream
              <div className="text-center m-t-10">
                <FontAwesomeIcon icon="spinner-third" spin />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ActivityStream;
