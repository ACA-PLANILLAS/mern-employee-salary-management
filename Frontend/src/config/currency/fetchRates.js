import { setCurrentRates } from "./currencyStore";
import currencyConfig from "./currency_config.json";

export const fetchRates = async () => {
  const currencyList = Object.keys(currencyConfig.currencies);
  const currencyListLower = currencyList.map((c) => c.toLowerCase());

  const rates = {};

  // CoinGecko
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=eur,svc`
    );
    const data = await res.json();
    const apiRates = data?.usd || {};

    for (const code of currencyList) {
      const lowerCode = code.toLowerCase();
      const rate = apiRates[lowerCode];
      if (rate != null) {
        rates[code] = rate;
      }
    }

    console.log("Tasas desde CoinGecko:", rates);
    setCurrentRates(rates);
    return;
  } catch (error) {
    console.log("CoinGecko falló, intentando con Fawaz...");
  }

  // Fawaz
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
    );
    const data = await res.json();
    const apiRates = data?.usd || {};

    for (const code of currencyList) {
      const lowerCode = code.toLowerCase();
      const rate = apiRates[lowerCode];
      if (rate != null) {
        rates[code] = rate;
      }
    }

    console.log("Tasas desde Fawaz:", rates);
    setCurrentRates(rates);
    return;
  } catch (error) {
    console.log("Fawaz falló, usando backup_rate");
  }

  // backup_rate
  for (const code of currencyList) {
    const backupRate = currencyConfig.currencies[code]?.backup_rate || 1;
    rates[code] = backupRate;
  }

  console.log("Usando backup_rate:", rates);
  setCurrentRates(rates);
};
