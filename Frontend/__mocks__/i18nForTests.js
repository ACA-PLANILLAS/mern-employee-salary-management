/*export const withTranslation = () => (Component) => {
    Component.defaultProps = {
      ...Component.defaultProps,
      t: (key) => key,
    };
    return Component;
  };*/

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'es',
  fallbackLng: 'es',
  debug: false,
  initImmediate: false, // Esto hace que la inicialización sea sincrónica

  resources: {
    es: {
      common: {
        "welcomeLine1": "Bienvenida a",
        "welcomeLine2": "la plataforma SiPeKa",
        "description": "Una solución integral para mujeres conductoras",
        "login": "Iniciar sesión"
      }
    }
  },
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;