import React, { Component } from 'react';

class BlockUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blocking: false
    };
  }

  static getDerivedStateFromProps = nextProps => ({ blocking: nextProps.blocking });

  render() {
    const className = this.state.blocking ? 'block-overlay' : '';

    return <span className={className}>{this.props.children}</span>;
  }
}

export default BlockUI;
