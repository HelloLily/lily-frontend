import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

import tooltipsEn from 'lib/locales/en/tooltips.json';
import formsEn from 'lib/locales/en/forms.json';
import toastsEn from 'lib/locales/en/toasts.json';
import emptyStatesEn from 'lib/locales/en/empty_states.json';
import alertsEn from 'lib/locales/en/alerts.json';
import preferencesEn from 'lib/locales/en/preferences.json';

i18n.use(XHR).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      tooltips: tooltipsEn,
      forms: formsEn,
      toasts: toastsEn,
      emptyStates: emptyStatesEn,
      alerts: alertsEn,
      preferences: preferencesEn
    }
  },
  react: {
    wait: true
  }
});

export default i18n;
