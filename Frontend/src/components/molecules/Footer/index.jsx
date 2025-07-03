import React from "react";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('');

  return (
    <footer className="text-sm text-center py-6 text-base-100 border-base-300 dark:bg-boxdark-2">
      <div className="flex flex-col md:flex-row items-center justify-center mt-5 text-black dark:text-white">
        <p> {t('copyright')} </p>
      </div>
    </footer>
  );
};

export default Footer;
