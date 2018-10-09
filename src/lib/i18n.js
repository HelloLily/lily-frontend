import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

import commonEn from 'lib/locales/en/common.json';
import tooltipsEn from 'lib/locales/en/tooltips.json';
import formsEn from 'lib/locales/en/forms.json';
import toastsEn from 'lib/locales/en/toasts.json';

i18n.use(XHR).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  resources: {
    en: {
      common: commonEn,
      tooltips: tooltipsEn,
      forms: formsEn,
      toasts: toastsEn
    }
  },
  react: {
    wait: true
  }
});

export default i18n;
