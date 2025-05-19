import React, { useState, useEffect, useRef } from 'react';
import currencyConfig from "../../../config/currency/currency_config.json";
import { useCurrency } from "../../../config/currency/CurrencyContext";

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  const currencies = Object.entries(currencyConfig.currencies); // [["USD", {...}], ["CRC", {...}]...]

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdown.current &&
        !dropdown.current.contains(event.target) &&
        !trigger.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar con ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-[6px] rounded hover:bg-gray-100 dark:hover:bg-gray-700 border border-strokedark/30 text-sm"
      >
        💱 <span className="font-medium">{currency}</span>
      </button>

      <div
        ref={dropdown}
        className={`absolute right-0 mt-2 w-44 rounded shadow-lg border border-gray-200 dark:border-strokedark bg-white dark:bg-boxdark z-50 ${
          dropdownOpen ? 'block' : 'hidden'
        }`}
      >
        <ul>
          {currencies.map(([code, data]) => (
            <li key={code}>
              <button
                onClick={() => {
                  setCurrency(code);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-meta-4 ${
                  currency === code ? 'font-semibold' : ''
                }`}
              >
                {code} - {data.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurrencySwitcher;
