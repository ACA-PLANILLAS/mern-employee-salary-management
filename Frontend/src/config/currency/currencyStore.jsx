import currencyConfig from "./currency_config.json";

let currentRates = {};


export const getCurrencyList = () => {
  return Object.keys(currencyConfig.currencies);
};

export const getBackupRate = (currencyCode) => {
  return currencyConfig.currencies?.[currencyCode]?.backup_rate || 1;
};

export const getSymbol = (currencyCode) => {
  return currencyConfig.currencies?.[currencyCode]?.symbol || "$";
};

export const setCurrentRates = (rates) => {
  currentRates = { ...rates };
};

export const getCurrentRate = (currencyCode) => {
  return currentRates[currencyCode] || getBackupRate(currencyCode);
};
