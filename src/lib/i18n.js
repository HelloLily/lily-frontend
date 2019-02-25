import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

import tooltipsEn from 'lib/locales/en/tooltips.json';
import formsEn from 'lib/locales/en/forms.json';
import toastsEn from 'lib/locales/en/toasts.json';
import emptyStatesEn from 'lib/locales/en/empty_states.json';
import modalsEn from 'lib/locales/en/modals.json';
import preferencesEn from 'lib/locales/en/preferences.json';
import integrationsEn from 'lib/locales/en/integrations.json';

i18n.use(XHR).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      tooltips: tooltipsEn,
      forms: formsEn,
      toasts: toastsEn,
      emptyStates: emptyStatesEn,
      modals: modalsEn,
      preferences: preferencesEn,
      integrations: integrationsEn
    }
  },
  react: {
    wait: true
  }
});

export default i18n;
