import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { errorToast, successToast } from 'utils/toasts';
import SimpleContentBlock from 'components/ContentBlock/SimpleContentBlock';
import Integration from 'models/Integration';
import Moneybird from 'models/integrations/Moneybird';

const IntegrationsMoneybird = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [administrationId, setAdministrationId] = useState('');
  const [hasIntegration, setHasIntegration] = useState(false);
  const [autoSync] = useState(false);
  const [t] = useTranslation(['integrations', 'toasts']);

  async function getCredentials() {
    const response = await Integration.get('moneybird');

    if (response.hasIntegration) {
      setHasIntegration(true);
      setClientId(response.clientId);
      setClientSecret(response.clientSecret);
      setAdministrationId(response.administrationId);
    }
  }

  async function saveCredentials() {
    try {
      const integrationContext = { administrationId };
      await Integration.post('moneybird', { clientId, clientSecret, integrationContext });
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  }

  async function importContacts() {
    try {
      const response = await Moneybird.setupSync({ autoSync });

      if (response.importStarted) {
        successToast(t('toasts:moneybirdImportStart'));
      }
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  }

  useEffect(() => {
    getCredentials();
  }, []);

  return (
    <div className="integrations-page">
      <SimpleContentBlock title="Moneybird">
        <Tabs>
          <TabList>
            <Tab>Credentials</Tab>
            <Tab>Import contacts</Tab>
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

            <div className="m-b-20">
              <label htmlFor="administrationId">Administration ID</label>
              <input
                id="administrationId"
                className="hl-input"
                placeholder="Administration ID"
                value={administrationId}
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
            {hasIntegration ? (
              <React.Fragment>
                <p>{t('integrations:moneybirdContactImportInfo')}</p>

                <div className="m-t-25 m-b-5">
                  <input id="autoSync" type="checkbox" value={autoSync} className="m-r-5" />

                  <label htmlFor="autoSync">
                    {t('integrations:moneybirdContactImportCheckbox')}
                  </label>
                </div>

                <p className="m-t-15 m-b-15">
                  <strong>Note:</strong> {t('integrations:moneybirdContactImportNote')}
                  <br />
                  {t('integrations:moneybirdContactImportNoteTwo')}
                </p>

                <button className="hl-primary-btn" onClick={importContacts}>
                  Import Moneybird contacts
                </button>
              </React.Fragment>
            ) : (
              <p>
                {t('integrations:moneybirdContactImportNoCredentials')}
                <br />
                {t('integrations:moneybirdContactImportNoCredentialsSub')}
              </p>
            )}
          </TabPanel>
        </Tabs>
      </SimpleContentBlock>
    </div>
  );
};

export default IntegrationsMoneybird;
