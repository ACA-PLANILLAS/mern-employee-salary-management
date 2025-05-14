import { useTranslation } from "react-i18next";

export const useDisplayValue = () => {
  const { t } = useTranslation("catalogs");

  return (originalValue) => {
    if (originalValue === null || originalValue === undefined) return "";

    const normalized = String(originalValue)?.toLowerCase()?.trim();

    return t(normalized);
  };
};
