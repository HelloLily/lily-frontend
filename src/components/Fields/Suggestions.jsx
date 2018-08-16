import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import convertFromCamelCase from 'utils/convertFromCamelCase';

class Suggestions extends Component {
  constructor(props) {
    super(props);

    const label = convertFromCamelCase(props.field);

    // Model is the plural version of the given type.
    const model = `${props.type}s`;

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
                  <Link to={`/${model}/${item.id}`}>{item.name || item.fullName}</Link>
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
