import { useTranslation } from "react-i18next";

export const useErrorMessage = () => {
  const { t } = useTranslation("databaseMessages");

  return (errorCode) => {

    console.log("Error code:", errorCode); // Debugging line

    const message = t(errorCode);
    return message === errorCode ? t("DEFAULT") : message;
  };
};
