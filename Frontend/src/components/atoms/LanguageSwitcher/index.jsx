import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const languages = [
    { code: 'en', name: 'English', countryCode: 'us' },
    { code: 'es', name: 'Español', countryCode: 'es' },
    { code: 'id', name: 'Indonesio', countryCode: 'id' },
  ];

  const raw = i18n.language;                      // e.g. "es-419"
  const code = raw.includes('-') 
    ? raw.split('-')[0]                            // => "es"
    : raw;
  const current = languages.find(l => l.code === code) || languages[0];

  const toggleOpen = () => setOpen(o => !o);
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  // Cerrar cuando clicas fuera
  useEffect(() => {
    const handleOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Construye la URL de la bandera (32×24 PNG)
  const flagUrl = countryCode =>
    `https://flagcdn.com/32x24/${countryCode}.png`;

  return (
    <li className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <img
          src={flagUrl(current.countryCode)}
          alt={current.name}
          className="w-6 h-4 object-cover"
        />
        <span className="uppercase font-medium">{current.code}</span>
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
          {languages.map(({ code, name, countryCode }) => (
            <li key={code}>
              <button
                onClick={() => changeLanguage(code)}
                className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700
                  ${i18n.language === code ? 'font-semibold' : ''}
                `}
              >
                <img
                  src={flagUrl(countryCode)}
                  alt={name}
                  className="w-6 h-4 object-cover"
                />
                <span>{name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default LanguageSwitcher;
