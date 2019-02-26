import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SELECT_STYLES } from 'lib/constants';
import { errorToast, successToast } from 'utils/toasts';
import updateArray from 'utils/updateArray';
import SimpleContentBlock from 'components/ContentBlock/SimpleContentBlock';
import RadioButtons from 'components/RadioButtons';
import Integration from 'models/Integration';
import PandaDoc from 'models/integrations/PandaDoc';
import Deal from 'models/Deal';

const EMPTY_EVENT_ROW = {
  eventType: null,
  documentStatus: null,
  status: null,
  nextStep: null,
  extraDays: 0,
  setToToday: false,
  addNote: false
};

const IntegrationsPandaDoc = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [sharedKey, setSharedKey] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [nextSteps, setNextSteps] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [items, setItems] = useState([]);
  const [t] = useTranslation(['integrations', 'toasts']);

  const documentEvents = PandaDoc.documentEvents();
  const documentStatuses = PandaDoc.documentStatuses();

  async function getCredentials() {
    const statusResponse = await Deal.statuses();
    const nextStepResponse = await Deal.nextSteps();

    setStatuses(statusResponse.results);
    setNextSteps(nextStepResponse.results);

    const response = await Integration.get('pandadoc');
    const eventResponse = await PandaDoc.events();

    if (response.hasIntegration) {
      setClientId(response.clientId);
      setClientSecret(response.clientSecret);

      if (eventResponse.results.length > 0) {
        setItems(eventResponse.results);
      } else {
        setItems([EMPTY_EVENT_ROW]);
      }
    }
  }

  async function saveCredentials() {
    try {
      await Integration.auth('pandadoc', { clientId, clientSecret });
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  }

  function addRow() {
    items.push(EMPTY_EVENT_ROW);
    setItems(items);
  }

  async function saveSharedKey() {
    try {
      await PandaDoc.saveSharedKey({ sharedKey });
      successToast(t('toasts:sharedKeySuccess'));
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  }

  async function saveEvents() {
    try {
      await PandaDoc.saveEvents(items);
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  }

  function updateEvent(value, index, field) {
    const newItems = updateArray(items, value, index, field);
    setItems(newItems);
  }

  function getName(name) {
    // Clean up the name so it's human readable.
    // This means we remove the document_ and document. from the name.
    // Also replace any remaining underscores with spaces.
    const newName = name.replace(/document_|document\./g, '').replace('_', ' ');

    return newName.charAt(0).toUpperCase() + newName.slice(1);
  }

  function toggleInfo() {
    setShowInfo(!showInfo);
  }

  useEffect(() => {
    getCredentials();
  }, []);

  return (
    <div className="integrations-page">
      <SimpleContentBlock title="PandaDoc">
        <Tabs>
          <TabList>
            <Tab>Credentials</Tab>
            <Tab>Events</Tab>
          </TabList>

          <TabPanel>
            <div className="m-b-20">
              <label htmlFor="clientId">Client ID</label>
              <input
                id="clientId"
                className="hl-input"
                placeholder="Client ID"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
              />
            </div>

            <div className="m-b-20">
              <label htmlFor="clientSecret">Client secret</label>
              <input
                id="clientSecret"
                className="hl-input"
                placeholder="Client secret"
                value={clientSecret}
                onChange={e => setClientSecret(e.target.value)}
              />
            </div>

            <div>
              <button className="hl-primary-btn-blue" onClick={saveCredentials}>
                Save credentials
              </button>
            </div>
          </TabPanel>

          <TabPanel>
            <p>{t('integrations:pandaDocWebhooksIntro')}</p>

            <p>{t('integrations:pandaDocWebhooksIntroSub')}</p>
            <code>https://app.hellolily.com/api/integrations/documents/items/catch/</code>

            <div className="pandadoc-items">
              <div className="m-t-20 m-b-20 w-20">
                <label htmlFor="sharedKey">Shared key</label>
                <input
                  id="sharedKey"
                  className="hl-input"
                  placeholder="Shared key"
                  value={sharedKey}
                  onChange={e => setSharedKey(e.target.value)}
                />

                <div className="m-t-15">
                  <button className="hl-primary-btn-blue" onClick={saveSharedKey}>
                    Save shared key
                  </button>
                </div>
              </div>

              <div className="m-t-20 m-b-20">
                <div className="content-block-name">Events</div>

                {items.map((item, index) => {
                  const key = `event-${index}`;

                  return (
                    <div className="display-flex flex-content" key={key}>
                      <div className="m-r-10">
                        <div>Document event</div>
                        <Select
                          name="documentEvent"
                          placeholder="Select an event"
                          styles={SELECT_STYLES}
                          options={documentEvents}
                          value={item.eventType}
                          getOptionValue={option => option}
                          getOptionLabel={option => getName(option)}
                          menuPortalTarget={document.body}
                          onChange={selected => updateEvent(selected, index, 'eventType')}
                        />
                      </div>

                      <div className="m-r-10">
                        <div>Document status</div>
                        <Select
                          name="documentStatus"
                          placeholder="Select a status"
                          styles={SELECT_STYLES}
                          options={documentStatuses}
                          value={item.documentStatus}
                          getOptionLabel={option => getName(option)}
                          menuPortalTarget={document.body}
                          onChange={selected => updateEvent(selected, index, 'documentStatus')}
                        />
                      </div>

                      <div className="m-r-10">
                        <div>Deal status</div>
                        <Select
                          name="status"
                          placeholder="Select a status"
                          styles={SELECT_STYLES}
                          options={statuses}
                          value={item.status}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          menuPortalTarget={document.body}
                          onChange={selected => updateEvent(selected, index, 'status')}
                        />
                      </div>

                      <div className="m-r-10">
                        <div>Deal next step</div>
                        <Select
                          name="nextStep"
                          placeholder="Select what's next"
                          styles={SELECT_STYLES}
                          options={nextSteps}
                          value={item.nextStep}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          menuPortalTarget={document.body}
                          onChange={selected => updateEvent(selected, index, 'nextStep')}
                        />
                      </div>

                      <div className="m-r-10">
                        <label htmlFor="extraDays">Extra days</label>
                        <input
                          id="extraDays"
                          type="number"
                          className={`hl-input${item.setToToday ? ' is-disabled' : ''}`}
                          placeholder="Days"
                          value={item.extraDays}
                          onChange={e => updateEvent(e.target.value, index, 'extraDays')}
                        />
                      </div>

                      <div className="m-r-10">
                        <div>
                          <label htmlFor="setToToday">Set to today</label>
                        </div>
                        <input
                          id="setToToday"
                          type="checkbox"
                          value={item.setToToday}
                          onChange={() => updateEvent(!item.setToToday, index, 'setToToday')}
                        />
                      </div>

                      <div className="m-r-10">
                        <div>
                          <label>Add note</label>
                        </div>
                        <RadioButtons
                          options={['No', 'Yes']}
                          setSelection={value => updateEvent(value, index, 'addNote')}
                        />
                      </div>

                      <div className="form-related-actions">
                        <button
                          className="hl-primary-btn m-r-10"
                          onClick={() => this.toggleDelete(item, index)}
                          type="button"
                        >
                          {item.isDeleted ? (
                            <FontAwesomeIcon icon={['far', 'undo']} />
                          ) : (
                            <FontAwesomeIcon icon={['far', 'trash-alt']} />
                          )}
                        </button>

                        {index === items.length - 1 && (
                          <button className="hl-primary-btn" onClick={addRow} type="button">
                            <FontAwesomeIcon icon={['far', 'plus']} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="m-t-15">
                  <button className="hl-primary-btn-blue" onClick={saveEvents}>
                    Save items
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button className="hl-interface-btn no-padding" onClick={toggleInfo}>
                Toggle info
              </button>

              {showInfo && (
                <table className="hl-table w-50">
                  <tbody>
                    <tr>
                      <td>Document event</td>
                      <td>
                        <a
                          href="https://developers.pandadoc.com/v1/reference#section-webhook-items"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View info
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>Document status</td>
                      <td>
                        <a
                          // eslint-disable-next-line
                          href="https://developers.pandadoc.com/v1/reference#section-available-document-statuses"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View info
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>Deal status</td>
                      <td>{t('integrations:pandaDocWebhooksInstructionsOne')}</td>
                    </tr>
                    <tr>
                      <td>Deal next step</td>
                      <td>{t('integrations:pandaDocWebhooksInstructionsTwo')}</td>
                    </tr>
                    <tr>
                      <td>Extra days</td>
                      <td>{t('integrations:pandaDocWebhooksInstructionsThree')}</td>
                    </tr>
                    <tr>
                      <td>Set to today</td>
                      <td>{t('integrations:pandaDocWebhooksInstructionsFour')}</td>
                    </tr>
                    <tr>
                      <td>Add note</td>
                      <td>{t('integrations:pandaDocWebhooksInstructionsFive')}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </SimpleContentBlock>
    </div>
  );
};

export default IntegrationsPandaDoc;
