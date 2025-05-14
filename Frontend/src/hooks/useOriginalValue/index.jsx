import { useTranslation } from "react-i18next";

export const useOriginalValue = () => {
  const { t, i18n } = useTranslation("catalogs");

  const currentLang = i18n.language;

  const translations = i18n.getResourceBundle(currentLang, "catalogs");

  return (translatedValue) => {
    const originalKey = Object.keys(translations).find(
      (key) => translations[key] === translatedValue
    );

    return originalKey || translatedValue;
  };
};
