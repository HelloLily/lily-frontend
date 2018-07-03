import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Suggestions extends Component {
  constructor(props) {
    super(props);

    // Convert camelCase to normal spaced word.
    let label = props.field.replace(/([A-Z])/g, ' $1').toLowerCase();
    // Uppercase the first letter.
    label = label.charAt(0).toUpperCase() + label.slice(1);

    // Model is the plural version of the given type.
    const model = `${props.type}s`;

    // ctrl.isSidebar = $scope.$parent.settings.email.sidebar.form;

    this.state = { label, model };
  }

  close = () => {
    this.props.handleClose(this.props.field);
  };

  render() {
    const { label, model } = this.state;
    const { type, field, suggestions, display, handleMerge } = this.props;

    return (
      <React.Fragment>
        {suggestions.length > 0 && display ? (
          <div className="form-suggestions">
            <div className="form-suggestion-title">
              <div>{`${label} found in existing ${type}`}</div>

              <button className="hl-interface-btn" onClick={this.close} type="button">
                <i className="lilicon hl-close-icon" />
              </button>
            </div>

            <div className="form-suggestion-items">
              {suggestions.map(suggestion => {
                const item = suggestion[type] || suggestion;
                const simpleDisplay = !suggestion.hasOwnProperty(type);
                const navLink = (
                  <NavLink to={`/${model}/${item.id}`}>{item.name || item.fullName}</NavLink>
                );

                return (
                  <div className="form-suggestion-row" key={item.id}>
                    <div className="form-suggestion-info">
                      {simpleDisplay ? (
                        <React.Fragment>Is this {navLink}?</React.Fragment>
                      ) : (
                        <React.Fragment>
                          {suggestion[field]} is used by {navLink}
                        </React.Fragment>
                      )}
                    </div>

                    <div className="form-suggestion-action">
                      {handleMerge ? (
                        <button className="hl-primary-btn" onClick={() => handleMerge(item.id)}>
                          Merge
                        </button>
                      ) : (
                        <button className="hl-primary-btn">Edit {type}</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Suggestions;
