import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonEN from '../../assets/locales/en/common.json'
import commonES from '../../assets/locales/es/common.json'
import commonId from '../../assets/locales/es/common.json'

import homeId from '../../assets/locales/id/home.json';
import homeEn from '../../assets/locales/en/home.json';
import homeEs from '../../assets/locales/es/home.json';


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: { common: commonId, home: homeId },
      en: { common: commonEN, home: homeEn },
      es: { common: commonES, home: homeEs },
    },
    ns: ['common', 'home'], // namespaces disponibles
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
