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
    console.log('closed');
  };

  render() {
    const { label, model } = this.state;
    const { type, field, suggestions, display, handleMerge } = this.props;

    return (
      <React.Fragment>
        {suggestions.length > 0 && display ? (
          <div className="form-suggestion">
            <div className="form-suggestion-title">
              <div>{`${label} found in existing ${type}`}</div>

              <button className="hl-interface-btn" onClick={this.close}>
                <i className="lilicon hl-close-icon" />
              </button>
            </div>

            <div className="form-suggestion-items">
              {suggestions.map(suggestion => {
                const item = suggestion[type];

                return (
                  <React.Fragment key={item.id}>
                    <div className="form-suggestion-item">
                      <span>{suggestion[field]} is used by </span>

                      <NavLink to={`/${model}/${item.id}`}>{item.name || item.fullName}</NavLink>
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
                  </React.Fragment>
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
