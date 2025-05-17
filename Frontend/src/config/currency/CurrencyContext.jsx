import { createContext, useContext, useState, useEffect } from "react";
import { fetchRates } from "./fetchRates";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("preferredCurrency") || "USD";
  });

  useEffect(() => {
    localStorage.setItem("preferredCurrency", currency);
  }, [currency]);

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
