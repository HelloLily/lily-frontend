import React, { Component } from 'react';

class BlockUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blocking: false
    }
  }

  static getDerivedStateFromProps = nextProps => {
    return {
      blocking: nextProps.blocking
    };
  }

  render() {
    const className = this.state.blocking ? 'block-overlay' : '';

    return (
      <div className={className}>
        {this.props.children}
      </div>
    );
  }
}

export default BlockUI;
