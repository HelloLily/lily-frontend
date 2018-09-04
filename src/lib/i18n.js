import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

function loadLocales(url, options, callback) {
  try {
    const waitForLocale = require(`./locales/${url}.json`);
    waitForLocale(locale => {
      callback(locale, { status: '200' });
    });
  } catch (e) {
    callback(null, { status: '404' });
  }
}

i18n.use(XHR).init({
  // debug: true,
  lng: 'en',
  fallbackLng: 'en',
  preload: false,
  ns: ['common'],
  defaultNS: 'common',
  backend: {
    loadPath: '{{lng}}/{{ns}}',
    parse: data => data,
    ajax: loadLocales
  },
  interpolation: {
    formatSeparator: ','
  },
  react: {
    wait: true
  }
});

export default i18n;
