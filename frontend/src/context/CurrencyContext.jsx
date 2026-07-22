import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const RATES = {
  INR: 1.0,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0093,
  JPY: 1.85,
};

const SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');

  const formatAmount = (amountInInr) => {
    if (amountInInr === null || amountInInr === undefined) return '₹0';
    const rate = RATES[currency] || 1.0;
    const symbol = SYMBOLS[currency] || '₹';
    const val = Number(amountInInr) * rate;
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, availableCurrencies: Object.keys(RATES) }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
