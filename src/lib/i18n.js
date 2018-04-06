import i18n from 'i18next';
import Fetch from 'i18next-fetch-backend';

i18n.use(Fetch).init({
  // debug: true,
  lng: 'nl',
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  fallbackLng: 'en',
  preload: false,
  ns: ['shared'],
  defaultNS: 'shared',
  fallbackNS: ['nav'],
  interpolation: {
    formatSeparator: ','
  },
  react: {
    wait: true
  }
});

export default i18n;
