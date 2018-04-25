import React, { Component } from 'react';

import Settings from 'models/Settings';

const statusIcons = [
  '',
  'hl-toggle-up-icon',
  'hl-toggle-down-icon',
  'hl-toggle-left-icon'
];

const HIDDEN = 0;
const VISIBLE = 1;
const COLLAPSED = 2;
const EXPANDED_WIDTH = 3;

class Widget extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings(props.component);

    this.state = {
      status: VISIBLE,
      expandHeight: false
    };
  }

  componentDidMount = async () => {
    const settings = await this.settings.get();

    this.setState({ ...settings.results });
  }

  heightToggle = () => {
    const expandHeight = !this.state.expandHeight;

    this.settings.store({ expandHeight }).then(() => {
      this.setState({ expandHeight });
    });
  }

  removeWidget = () => {
    const status = HIDDEN;

    this.settings.store({ status }).then(() => {
      this.setState({ status });
    });
  }

  toggleCollapse = () => {
    const { status } = this.state;

    let newStatus;

    if (status === COLLAPSED) {
      newStatus = EXPANDED_WIDTH;
    } else if (status === EXPANDED_WIDTH) {
      newStatus = VISIBLE;
    } else {
      newStatus = COLLAPSED;
    }

    this.settings.store({ status: newStatus }).then(() => {
      this.setState({ status: newStatus });
    });
  }

  render() {
    const { status, expandHeight } = this.state;

    const widgetBodyClassName = `widget-body${expandHeight ? ' expanded-height' : ''}`;

    return (
      <React.Fragment>
        {status !== HIDDEN ?
          (
            <div className={`widget ${status === EXPANDED_WIDTH ? 'w-100' : 'w-50'}`}>
              <div className="widget-header">
                <div className="widget-title">
                  {this.props.title}
                </div>
                <div className="widget-filters">
                  {this.props.filters}
                </div>
                <div className="widget-tools m-r-10">
                  <button className="hl-interface-btn m-r-5" onClick={this.toggleCollapse}>
                    <i className={`lilicon ${statusIcons[status]}`} />
                  </button>
                  <button className="close-btn" ng-if="vm.widgetCloseable" onClick={this.removeWidget}>
                    <i className="lilicon hl-close-icon" />
                  </button>
                </div>
              </div>
              {status !== COLLAPSED &&
                <React.Fragment>
                  <div className={widgetBodyClassName}>
                    {this.props.children}
                  </div>

                  <div className="widget-scroll-fade clickable" onClick={this.heightToggle}>
                    <i className={`lilicon hl-toggle-${expandHeight ? 'up' : 'down'}-icon`} />
                  </div>
                </React.Fragment>
              }
            </div>
          ) :
          (
            null
          )
        }
      </React.Fragment>
    );
  }
}

export default Widget;
