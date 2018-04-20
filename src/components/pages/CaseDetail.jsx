import React, { Component } from 'react';

import Editable from 'components/Editable';
import Case from 'src/models/Case';

class CaseDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { caseObj: null };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const data = await Case.get(id);

    this.setState({ caseObj: data });
  }

  submitCallback = args => Case.patch(args);

  render() {
    const { caseObj } = this.state;

    return (
      <div>
        {
          caseObj ?
            (
              <div>
                <div>
                  Case detail
                </div>

                <strong>Select</strong>
                <Editable type="select" object={caseObj} field="assignedTo" submitCallback={this.submitCallback} />

                <strong>Multi select</strong>
                <Editable type="select" object={caseObj} field="assignedToTeams" submitCallback={this.submitCallback} multi />
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

export default CaseDetail;
