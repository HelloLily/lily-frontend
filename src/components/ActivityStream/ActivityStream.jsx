import React, { Component } from 'react';

import RadioButtons from 'components/RadioButtons';

class ActivityStream extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: true, filter: 0 };
  }

  setSelection = value => {
    this.setState({ filter: value });
  };

  render() {
    const { loading } = this.state;
    const { object } = this.props;

    return (
      <div className="activity-stream">
        <div className="activity-stream-filter">
          <RadioButtons options={['All', 'Cases']} setSelection={this.setSelection} />
        </div>
      </div>
    );
  }
}

export default ActivityStream;
