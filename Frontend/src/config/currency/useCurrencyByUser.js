import { useCurrency } from "./CurrencyContext";
import { getCurrentRate, getSymbol } from "./currencyStore";

const useCurrencyByUser = () => {
  const { currency } = useCurrency();

  const rate = getCurrentRate(currency);
  const symbol = getSymbol(currency);

  const toLocal = (usd) => +(usd * rate).toFixed(2);
  const toUSD = (local) => +(local / rate).toFixed(2);

  return { currency, symbol, rate, toLocal, toUSD };
};

export default useCurrencyByUser;