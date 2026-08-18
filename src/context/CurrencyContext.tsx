/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CurrencyRate } from '../types/index.js';
import { api } from '../services/api.js';

interface CurrencyContextType {
  preferredCurrency: string;
  rates: CurrencyRate[];
  availableRates: CurrencyRate[];
  isCurrencyModalOpen: boolean;
  isModalOpen?: boolean;
  openCurrencyModal: () => void;
  closeCurrencyModal: () => void;
  setPreferredCurrency: (currency: string) => void;
  setCurrency: (currency: string) => void;
  formatPrice: (amount: number, fromCurrency?: string) => string;
  convertPrice: (amount: number, fromCurrency?: string) => { amount: number; isEstimate: boolean; rate: number };
  activeRate: CurrencyRate;
  currentCurrency: CurrencyRate;
}

const DEFAULT_USD_RATE: CurrencyRate = {
  code: 'USD',
  name: 'US Dollar',
  symbol: '$',
  rateToUSD: 1.0,
  flag: '🇺🇸',
  country: 'United States',
  lastUpdated: new Date().toISOString(),
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [preferredCurrency, setPreferredCurrencyState] = useState<string>('USD');
  const [rates, setRates] = useState<CurrencyRate[]>([DEFAULT_USD_RATE]);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadRates();
    try {
      const saved = localStorage.getItem('enermind_preferred_currency');
      if (saved) setPreferredCurrencyState(saved.toUpperCase());
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  async function loadRates() {
    try {
      const data = await api.getCurrencyRates();
      if (data && Array.isArray(data.rates) && data.rates.length > 0) {
        setRates(data.rates);
      }
    } catch (err) {
      console.error('Failed to load currency rates:', err);
    }
  }

  function setPreferredCurrency(code: string) {
    if (!code) return;
    const uppercase = code.toUpperCase();
    setPreferredCurrencyState(uppercase);
    try {
      localStorage.setItem('enermind_preferred_currency', uppercase);
    } catch {
      // Ignore localStorage errors
    }
  }

  const safeRates = Array.isArray(rates) && rates.length > 0 ? rates : [DEFAULT_USD_RATE];

  const activeRate: CurrencyRate =
    safeRates.find((r) => r && r.code && r.code.toUpperCase() === (preferredCurrency || 'USD').toUpperCase()) ||
    safeRates[0] ||
    DEFAULT_USD_RATE;

  function convertPrice(amount: number, fromCurrency: string = 'USD') {
    const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    const fromCode = (fromCurrency || 'USD').toUpperCase();

    const fromRateObj =
      safeRates.find((r) => r && r.code && r.code.toUpperCase() === fromCode) || DEFAULT_USD_RATE;
    const toRateObj = activeRate || DEFAULT_USD_RATE;

    const fromRateToUSD = fromRateObj.rateToUSD || 1.0;
    const toRateToUSD = toRateObj.rateToUSD || 1.0;

    const amountInUSD = safeAmount / fromRateToUSD;
    const targetAmount = Number((amountInUSD * toRateToUSD).toFixed(2));
    const effectiveRate = Number((toRateToUSD / fromRateToUSD).toFixed(4));

    return {
      amount: targetAmount,
      isEstimate: (fromRateObj.code || 'USD') !== (toRateObj.code || 'USD'),
      rate: effectiveRate,
    };
  }

  function formatPrice(amount: number, fromCurrency: string = 'USD'): string {
    const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    const converted = convertPrice(safeAmount, fromCurrency);
    const symbol = activeRate?.symbol || '$';

    return `${symbol} ${converted.amount.toLocaleString(undefined, {
      minimumFractionDigits: converted.amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <CurrencyContext.Provider
      value={{
        preferredCurrency,
        rates: safeRates,
        availableRates: safeRates,
        isCurrencyModalOpen,
        isModalOpen: isCurrencyModalOpen,
        openCurrencyModal: () => setIsCurrencyModalOpen(true),
        closeCurrencyModal: () => setIsCurrencyModalOpen(false),
        setPreferredCurrency,
        setCurrency: setPreferredCurrency,
        formatPrice,
        convertPrice,
        activeRate,
        currentCurrency: activeRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
