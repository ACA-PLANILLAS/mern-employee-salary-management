import { setCurrentRates } from "./currencyStore";

export const fetchRates = async () => {
  try {
    const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json");
    const data = await res.json();

    const currencies = ["crc", "idr", "eur"];
    const rates = {};

    for (const code of currencies) {
      rates[code.toUpperCase()] = data.usd?.[code] || null;
    }

    setCurrentRates(rates);
    console.log("✔️ Rates loaded from API", rates);
  } catch (error) {
    console.warn("⚠️ Could not fetch rates, using backup");
  }
};
