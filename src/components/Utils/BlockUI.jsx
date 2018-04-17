import React, { Component } from 'react';

class BlockUI extends Component {
  static getDerivedStateFromProps = nextProps => ({ blocking: nextProps.blocking });

  constructor(props) {
    super(props);

    this.state = {
      blocking: false
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
