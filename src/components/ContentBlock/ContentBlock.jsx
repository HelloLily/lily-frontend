import React, { Component } from 'react';
import cx from 'classnames';

import Settings from 'models/Settings';

const statusIcons = ['', 'hl-toggle-up-icon', 'hl-toggle-down-icon', 'hl-toggle-left-icon'];

const HIDDEN = 0;
const VISIBLE = 1;
const COLLAPSED = 2;
const EXPANDED_WIDTH = 3;

const DEFAULT_SETTINGS = {
  status: VISIBLE
};

class ContentBlock extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings(props.component);

    this.state = { loading: true, showFade: true };
  }

  componentDidMount = async () => {
    const settingsRequest = await this.settings.get();

    // Fill in any settings which aren't in the database yet.
    const settings = { ...DEFAULT_SETTINGS, ...settingsRequest.results };

    this.setState({ ...settings, loading: false });
  };

  heightToggle = async () => {
    const expandHeight = !this.state.expandHeight;

    await this.settings.store({ expandHeight });
    this.setState({ expandHeight });
  };

  removeContentBlock = async () => {
    const status = HIDDEN;

    await this.settings.store({ status });
    this.setState({ status });
  };

  toggleCollapse = async () => {
    const { status } = this.state;
    const { expandable } = this.props;

    let newStatus;

    if (status === COLLAPSED) {
      newStatus = expandable ? EXPANDED_WIDTH : VISIBLE;
    } else if (status === EXPANDED_WIDTH) {
      newStatus = VISIBLE;
    } else {
      newStatus = COLLAPSED;
    }

    await this.settings.store({ status: newStatus });
    this.setState({ status: newStatus });
  };

  handleScroll = event => {
    const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;

    this.setState({ showFade: !bottom });
  };

  render() {
    const { status, expandHeight, loading, showFade } = this.state;
    const { className, fullHeight } = this.props;

    const containerClass = cx('content-block-container', {
      expanded: status === EXPANDED_WIDTH,
      [className]: className
    });

    const bodyClass = cx('content-block-body', {
      'expanded-height': expandHeight,
      'height-100': fullHeight
    });

    return (
      <div className={containerClass}>
        {!loading && status !== HIDDEN ? (
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-title">{this.props.title}</div>
              <div className="content-block-extra">{this.props.extra}</div>
              <div className="content-block-tools">
                <button className="hl-interface-btn m-r-5" onClick={this.toggleCollapse}>
                  <i className={`lilicon ${statusIcons[status]}`} />
                </button>

                {this.props.closeable && (
                  <button className="close-btn" onClick={this.removeWidget}>
                    <i className="lilicon hl-close-icon" />
                  </button>
                )}
              </div>
            </div>
            {status !== COLLAPSED && (
              <React.Fragment>
                <div className={bodyClass} onScroll={this.handleScroll}>
                  {this.props.children}
                </div>

                {!fullHeight &&
                  showFade && (
                    <div
                      className="content-block-scroll-fade clickable"
                      onClick={this.heightToggle}
                    >
                      <i className={`lilicon hl-toggle-${expandHeight ? 'up' : 'down'}-icon`} />
                    </div>
                  )}
              </React.Fragment>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default ContentBlock;
