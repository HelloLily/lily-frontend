import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import convertFromCamelCase from 'utils/convertFromCamelCase';
import Address from 'components/Utils/Address';
import camelToHuman from 'src/utils/camelToHuman';

const Suggestions = props => {
  const [showInfo, setShowInfo] = useState(false);

  const label = convertFromCamelCase(props.field);
  // Model is the plural version of the given type.
  const model = `${props.type}s`;
  const { object, type, field, suggestions, display, handleMerge } = props;

  const fields = [
    { field: 'primaryWebsite' },
    { field: 'accounts', display: 'name' },
    { field: 'emailAddresses', display: 'emailAddress' },
    { field: 'phoneNumbers', display: 'number' },
    { field: 'addresses' },
    { field: 'websites', display: 'website' },
    { field: 'tags', display: 'name' },
    { field: 'socialMedia', display: 'username' }
  ];

  function close() {
    props.handleClose(props.field);
  }

  return (
    <React.Fragment>
      {suggestions.length > 0 && display ? (
        <div className="form-suggestions">
          <div className="form-suggestion-title">
            <div>{`${label} found in existing ${type}`}</div>

            <button className="hl-interface-btn" onClick={close} type="button">
              <FontAwesomeIcon icon={['far', 'times']} />
            </button>
          </div>

          <div className="form-suggestion-items">
            {suggestions.map(suggestion => {
              const item = suggestion[type] || suggestion;
              const simpleDisplay = !suggestion.hasOwnProperty(type);
              const navLink = <Link to={`/${model}/${item.id}`}>{item.name || item.fullName}</Link>;

              return (
                <div className="form-suggestion-container" key={item.id}>
                  <div className="form-suggestion-row">
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
                      <button
                        type="button"
                        className="hl-primary-btn m-r-10"
                        onClick={() => setShowInfo(!showInfo)}
                      >
                        {showInfo ? 'Hide info' : 'Show info'}
                      </button>
                      {handleMerge ? (
                        <button
                          className="hl-primary-btn-blue"
                          onClick={() => handleMerge(item.id)}
                          type="button"
                        >
                          Merge with {type}
                        </button>
                      ) : (
                        <button className="hl-primary-btn" type="button">
                          Edit {type}
                        </button>
                      )}
                    </div>
                  </div>

                  {showInfo && (
                    <div className="change-log">
                      <table className="change-related">
                        <thead>
                          <tr>
                            <th />
                            <th>Current</th>
                            <th>After merge</th>
                          </tr>
                        </thead>

                        {fields.map(fieldRow => {
                          if (!object.hasOwnProperty(fieldRow.field)) return null;

                          const fieldName = camelToHuman(fieldRow.field, true);
                          // Suggestions for related fields contain different data.
                          let suggestionValue = suggestion.hasOwnProperty(type)
                            ? suggestion[type][fieldRow.field]
                            : suggestion[fieldRow.field];
                          let objectValue = object[fieldRow.field];

                          // No values, so don't bother showing anything.
                          if (!suggestionValue && !objectValue) return null;

                          if (suggestionValue) {
                            suggestionValue = suggestionValue.filter(
                              value => value[fieldRow.display]
                            );
                            objectValue = objectValue.filter(value => value[fieldRow.display]);

                            // No values, so don't bother showing anything.
                            if (suggestionValue.length === 0 && objectValue.length === 0)
                              return null;
                          }

                          const key = `suggestion-${suggestion.id}-${fieldRow.field}`;
                          const total = Array.isArray(suggestionValue)
                            ? suggestionValue.length + objectValue.length
                            : 0;
                          const suggestionValueRows = [];

                          if (Array.isArray(suggestionValue) && suggestionValue.length > 0) {
                            suggestionValue.forEach((row, valueIndex) => {
                              const rowKey = `${key}-related-${valueIndex}`;
                              const value =
                                fieldRow.field !== 'addresses' ? (
                                  row[fieldRow.display]
                                ) : (
                                  <Address address={row} />
                                );

                              if (value) {
                                suggestionValueRows.push(
                                  <div className="change-item" key={rowKey}>
                                    {value}
                                  </div>
                                );
                              }
                            });
                          }

                          const emptyRows = [];

                          if (suggestionValue.length < total) {
                            for (let i = suggestionValue.length; i < total; i++) {
                              const emptyKey = `${key}-${i}-empty`;
                              const element = (
                                <div className="change-item change-empty" key={emptyKey} />
                              );
                              // Ensure the whole table looks nice if
                              // there's a difference in the amount of items.
                              emptyRows.push(element);
                            }
                          }

                          return (
                            <tbody key={key}>
                              <tr>
                                <td>{fieldName}</td>
                                <td>
                                  {Array.isArray(suggestionValue) ? (
                                    <React.Fragment>
                                      {suggestionValueRows}

                                      {emptyRows}
                                    </React.Fragment>
                                  ) : (
                                    <div
                                      className={`change-item${!objectValue ? 'change-empty' : ''}`}
                                    >
                                      {objectValue}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {Array.isArray(suggestionValue) ? (
                                    <React.Fragment>{suggestionValueRows}</React.Fragment>
                                  ) : (
                                    <React.Fragment>
                                      {!objectValue && suggestionValue ? (
                                        <div className="change-item change-after">
                                          {objectValue}
                                        </div>
                                      ) : (
                                        <div
                                          className={`change-item${
                                            !objectValue ? 'change-empty' : ''
                                          }`}
                                        >
                                          {objectValue}
                                        </div>
                                      )}
                                    </React.Fragment>
                                  )}

                                  {Array.isArray(objectValue) && (
                                    <React.Fragment>
                                      {objectValue.length > 0 && (
                                        <React.Fragment>
                                          {objectValue.map((row, valueIndex) => {
                                            const rowKey = `${key}-related-${valueIndex}`;
                                            const value =
                                              fieldRow.field !== 'addresses' ? (
                                                row[fieldRow.display]
                                              ) : (
                                                <Address address={row} />
                                              );

                                            return value ? (
                                              <div
                                                className="change-item change-after"
                                                key={rowKey}
                                              >
                                                {value}
                                              </div>
                                            ) : null;
                                          })}
                                        </React.Fragment>
                                      )}
                                    </React.Fragment>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default Suggestions;
