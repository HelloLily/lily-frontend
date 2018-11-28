import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getYear, getMonth } from 'date-fns';
import { withNamespaces } from 'react-i18next';
import Textarea from 'react-textarea-autosize';
import cx from 'classnames';

import { successToast, errorToast } from 'utils/toasts';
import updateModel from 'utils/updateModel';
import LilyDate from 'components/Utils/LilyDate';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
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

    this.mounted = false;

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
    this.mounted = true;

    const { object, dateStart, dateEnd, parentObject } = this.props;

    const { activityStream, options } = await setupActivityStream(
      object,
      dateStart,
      dateEnd,
      parentObject
    );

    if (this.mounted) {
      this.setState({ activityStream, options, loading: false });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setSelection = option => {
    this.setState({ filter: option.id });
  };

  submitNote = async () => {
    const { activityStream, note } = this.state;
    const { t } = this.props;

    try {
      const response = await Note.post(note);
      response.activitySortDate = response.created;
      activityStream.unshift(response);

      const text = t('modelCreated', { model: 'note' });
      successToast(text);

      note.content = '';

      this.setState({ activityStream, note });
    } catch (e) {
      errorToast(t('error'));
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
    const { t } = this.props;

    try {
      await Note.del(note.id);
      const index = activityStream.findIndex(
        streamItem =>
          streamItem.id === item.id && streamItem.contentType.model === item.contentType.model
      );
      const noteIndex = item.notes.findIndex(itemNote => itemNote.id === note.id);
      activityStream[index].notes.splice(noteIndex, 1);

      const text = t('modelDeleted', { model: 'note' });
      successToast(text);

      this.setState({ activityStream });
    } catch (error) {
      errorToast(t('error'));
    }
  };

  togglePinned = async args => {
    const { activityStream } = this.state;
    const { t } = this.props;

    await Note.patch(args);
    const index = activityStream.findIndex(
      streamItem => streamItem.id === args.id && streamItem.contentType.model === 'note'
    );
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

  submitCallback = async (item, args) => {
    await updateModel(item, args);
  };

  deleteCallback = async item => {
    const { activityStream } = this.state;

    // Find the given item and remove it from the activity stream;
    const index = activityStream.findIndex(
      streamItem =>
        streamItem.id === item.id && streamItem.contentType.model === item.contentType.model
    );
    activityStream.splice(index, 1);

    this.setState({ activityStream });
  };

  orderActivityStream = () => {
    const { activityStream } = this.state;

    const orderedActivityStream = {
      pinned: [],
      nonPinned: {},
      totalItems: activityStream.length
    };

    activityStream.forEach(item => {
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
    const { note, options, collapsed, filter, loading, activityStream } = this.state;
    const { object, parentObject } = this.props;

    const orderedActivityStream = this.orderActivityStream(activityStream);
    const defaultProps = {
      object,
      submitCallback: this.submitCallback,
      deleteCallback: this.deleteCallback,
      submitItemNote: this.submitItemNote,
      deleteItemNote: this.deleteItemNote,
      togglePinned: this.togglePinned
    };
    const { model } = object.contentType;

    return (
      <div className="activity-stream">
        {!loading ? (
          <React.Fragment>
            {parentObject && (
              <div className="activity-stream-title">{`Latest ${model} activity`}</div>
            )}
            <div className="activity-stream-filter capitalize">
              <div className="radio-button-group">
                {options.map((option, index) => {
                  const isSelected = filter === option.id;
                  const radioId = `radio-activity-${model}-${index}`;
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
                <Textarea
                  value={note.content}
                  onChange={this.handleContent}
                  className="hl-input"
                  placeholder="Write your note here"
                  minRows={3}
                  maxRows={15}
                />

                <div className="float-right">
                  <button className="hl-primary-btn-blue" onClick={this.submitNote}>
                    Add note
                  </button>
                </div>
              </div>

              {orderedActivityStream.pinned.length > 0 && (
                <React.Fragment>
                  <div className="activity-stream-indicator" />

                  <div className="activity-stream-category">Pinned</div>

                  <React.Fragment>
                    {orderedActivityStream.pinned.map(item => {
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

              {Object.keys(orderedActivityStream.nonPinned).map(key => {
                const category = orderedActivityStream.nonPinned[key];
                // Only show items which have the same content type as the selected filter.
                const items = filter
                  ? category.items.filter(item => item.contentType.id === filter)
                  : category.items;
                const isCollapsed = collapsed.includes(key);

                return items.length ? (
                  <React.Fragment key={key}>
                    <div className="activity-stream-indicator" />

                    <button
                      className="activity-stream-category"
                      onClick={() => this.toggleCollapse(key)}
                      type="button"
                    >
                      <LilyDate date={key} format="MMMM y" />

                      <div>
                        <i
                          className={`lilicon ${
                            isCollapsed ? 'hl-toggle-down-icon' : 'hl-toggle-up-icon'
                          }`}
                        />
                      </div>
                    </button>

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

              {activityStream.length === 0 && (
                <React.Fragment>
                  <div className="activity-stream-image">
                    <FontAwesomeIcon icon="hourglass-start" />
                  </div>

                  <div className="stream-item">
                    <div className="stream-item-header">Until now</div>
                    <div className="stream-item-title">
                      <span className="flex-grow">
                        <span className="text-capitalize">{model} </span>
                        was created
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        ) : (
          <LoadingIndicator>Loading activity stream</LoadingIndicator>
        )}
      </div>
    );
  }
}

export default withNamespaces('toasts')(ActivityStream);
