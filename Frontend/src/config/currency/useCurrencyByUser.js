import { useCurrency } from "./CurrencyContext";
import { getCurrentRate, getSymbol } from "./currencyStore";

const useCurrencyByUser = () => {
  const { currency } = useCurrency();

  const rate = getCurrentRate(currency);
  const symbol = getSymbol(currency);

  const parseNumber = (value) => {
    if (typeof value === "string") {
      value = value.replace(/,/g, "");
    }
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const toLocal = (usd) => {
    const num = parseNumber(usd);
    return +(num * rate).toFixed(2);
  };

  const toUSD = (local) => {
    const num = parseNumber(local);
    return +(num / rate).toFixed(2);
  };

  return { currency, symbol, rate, toLocal, toUSD };
};

export default useCurrencyByUser;
