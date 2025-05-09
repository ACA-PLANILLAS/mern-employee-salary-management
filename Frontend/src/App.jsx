import React, { useState, useEffect } from 'react'
import { Routes, store } from './config';
import { Provider } from 'react-redux';
import { CurrencyProvider } from './config/currency/CurrencyContext';

function App() {
  const [loading, setLoading] = useState(true)
  const preloader = document.getElementById('preloader')

  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none'
      setLoading(false)
    }, 2000);
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])
  return (
    !loading && (
      <Provider store={store}>
        <CurrencyProvider>
          <Routes />
        </CurrencyProvider>
      </Provider>
    )
  )
}

export default App;
