import { useTranslation } from "react-i18next";

export const useDisplayValue = () => {
  const { t } = useTranslation("catalogs");

  return (originalValue) => {
    if (!originalValue) return "";

    const normalized = originalValue.toLowerCase().trim();

    return t(normalized);
  };
};
