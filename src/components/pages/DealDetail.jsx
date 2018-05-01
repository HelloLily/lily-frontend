import React, { Component } from 'react';

import Editable from 'components/Editable';
import Deal from 'src/models/Deal';

class DealDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { deal: null };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const data = await Deal.get(id);

    this.setState({ deal: data });
  }

  submitCallback = args => Deal.patch(args);

  render() {
    const { deal } = this.state;

    return (
      <div>
        {deal ?
          (
            <div>
              <div>
                Deal detail
              </div>

              <strong>Select</strong>
              <Editable type="select" object={deal} field="type" submitCallback={this.submitCallback} />

              <strong>Icon select</strong>
              <Editable type="select" object={deal} field="nextStep" submitCallback={this.submitCallback} icon />

              <strong>Async select</strong>
              <Editable type="select" object={deal} field="assignedTo" submitCallback={this.submitCallback} async />

              <strong>Multi select</strong>
              <Editable type="select" object={deal} field="assignedToTeams" submitCallback={this.submitCallback} multi />
            </div>
          ) :
          (
            <div>
              Loading
            </div>
          )
        }
      </div>
    );
  }
}

export default DealDetail;
