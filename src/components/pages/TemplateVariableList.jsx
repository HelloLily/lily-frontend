import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import List from 'components/List';
import ListActions from 'components/List/ListActions';
import BlockUI from 'components/Utils/BlockUI';
import User from 'models/User';
import TemplateVariable from 'models/TemplateVariable';

class TemplateVariableList extends Component {
  constructor(props) {
    super(props);

    this.state = { variables: [], publicVariables: [], loading: true };
  }

  async componentDidMount() {
    const variableResponse = await TemplateVariable.query();

    const variables = variableResponse.custom.filter(variable => !variable.isPublic);
    const publicVariables = variableResponse.custom.filter(variable => variable.isPublic);

    this.setState({
      variables,
      publicVariables,
      loading: false
    });
  }

  render() {
    const { variables, publicVariables, loading } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <div className="list-title flex-grow">Your template variables</div>

            <button className="hl-primary-btn">
              <FontAwesomeIcon icon="plus" /> Template variable
            </button>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th className="w-60">Template name</th>
                <th className="float-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {variables.map((variable, index) => (
                <tr key={variable.id}>
                  <td>{variable.name}</td>
                  <td className="float-right">
                    <button className="hl-primary-btn small m-r-5">
                      <FontAwesomeIcon icon="eye" /> Preview
                    </button>

                    <button className="hl-primary-btn small m-r-5">
                      <i className="lilicon hl-edit-icon" />
                    </button>

                    <button className="hl-primary-btn small" onClick={() => this.delete(index)}>
                      <i className="lilicon hl-trashcan-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {variables.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan="2">No templates variables yet. You should create one!</td>
                </tr>
              </tbody>
            )}
          </table>
        </List>

        <div className="m-b-25" />

        <List>
          <div className="list-header">
            <div className="list-title flex-grow">Public template variables</div>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th className="w-60">Template name</th>
                <th className="float-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {publicVariables.map(variable => (
                <tr key={variable.id}>
                  <td>{variable.name}</td>
                  <td className="float-right">
                    <button className="hl-primary-btn small m-r-5">
                      <FontAwesomeIcon icon="eye" /> Preview
                    </button>

                    <button className="hl-primary-btn small m-r-5">
                      <i className="lilicon hl-edit-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {variables.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan="2">No templates variables yet. You should create one!</td>
                </tr>
              </tbody>
            )}
          </table>
        </List>
      </BlockUI>
    );
  }
}

export default TemplateVariableList;
