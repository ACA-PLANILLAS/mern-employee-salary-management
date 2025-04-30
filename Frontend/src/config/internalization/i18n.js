import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonEN from '../../assets/locales/en/common.json'
import commonES from '../../assets/locales/es/common.json'
import commonId from '../../assets/locales/id/common.json'

import homeId from '../../assets/locales/id/home.json';
import homeEn from '../../assets/locales/en/home.json';
import homeEs from '../../assets/locales/es/home.json';

import loginId from '../../assets/locales/id/login.json';
import loginEn from '../../assets/locales/en/login.json';
import loginEs from '../../assets/locales/es/login.json';

import dashboardId from '../../assets/locales/id/dashboard.json';
import dashboardEn from '../../assets/locales/en/dashboard.json';
import dashboardEs from '../../assets/locales/es/dashboard.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: { common: commonId, home: homeId, login: loginId, dashboard: dashboardId },
      en: { common: commonEN, home: homeEn, login: loginEn, dashboard: dashboardEn },
      es: { common: commonES, home: homeEs, login: loginEs, dashboard: dashboardEs },
    },
    ns: ['common', 'home', "login", "dashboard"], // namespaces disponibles
    defaultNS: 'common',
    fallbackLng: 'en',
    debug: true,

    detection: {
      order: ['localStorage','navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'appLang',
    },

    interpolation: { escapeValue: false },
  })

export default i18n
