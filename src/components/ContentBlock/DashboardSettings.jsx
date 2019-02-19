import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { successToast, errorToast } from 'utils/toasts';
import camelToHuman from 'utils/camelToHuman';
import LilyTooltip from 'components/LilyTooltip';
import LilyModal from 'components/LilyModal';
import Settings from 'models/Settings';

export default function DashboardSettings() {
  const [newSettings, setSettings] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [t] = useTranslation(['tooltips', 'modals']);
  let initialSettings = {};

  const settings = new Settings();
  const blocks = ['myCases', 'myDeals', 'unassignedCases', 'unassignedDeals', 'unreadEmail'];

  async function getSettings() {
    const response = await settings.get();

    const state = {};

    blocks.forEach(block => {
      if (response.results[block]) {
        state[block] = response.results[block].status;
      } else {
        state[block] = 1;
      }
    });

    initialSettings = state;

    setSettings(state);
    setLoading(false);
  }

  async function saveSettings() {
    setLoading(true);

    const promises = [];

    Object.keys(newSettings).forEach(key => {
      if (initialSettings[key] !== newSettings[key]) {
        const data = {
          component: key,
          status: newSettings[key] ? 1 : 0
        };
        const promise = settings.store(data);
        promises.push(promise);
      }
    });

    await Promise.all(promises);

    window.location.reload();
  }

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function toggleBlock(key) {
    newSettings[key] = !newSettings[key];

    setSettings(newSettings);
  }

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <React.Fragment>
      <div className="widget-settings">
        <button
          className="hl-interface-btn"
          data-tip={t('tooltips:widgetSettings')}
          onClick={openModal}
        >
          <FontAwesomeIcon icon={['far', 'cog']} size="lg" />
        </button>

        <LilyTooltip />
      </div>

      <LilyModal modalOpen={modalOpen} closeModal={closeModal}>
        <div className="modal-header">
          <div className="modal-title">{t('modals:dashboardSettingsTitle')}</div>
        </div>

        <div className="modal-content">
          <p>{t('modals:dashboardSettings')}</p>

          <div className="m-t-15">
            <ul>
              {Object.keys(newSettings).map(key => {
                return (
                  <li key={key}>
                    <input
                      id={key}
                      type="checkbox"
                      defaultChecked={newSettings[key] !== 0}
                      onClick={() => toggleBlock(key)}
                    />

                    <label htmlFor={key} className="m-l-5">
                      {camelToHuman(key, true)}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className={`hl-primary-btn-blue${loading ? ' is-disabled' : ''}`}
            onClick={saveSettings}
          >
            Save settings
          </button>
        </div>
      </LilyModal>
    </React.Fragment>
  );
}
