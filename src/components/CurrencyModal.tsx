/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Check, Globe, X } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext.js';

export function CurrencyModal() {
  const {
    isCurrencyModalOpen,
    isModalOpen,
    closeCurrencyModal,
    rates = [],
    preferredCurrency = 'USD',
    setPreferredCurrency,
  } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');

  const isOpen = isCurrencyModalOpen || isModalOpen;
  if (!isOpen) return null;

  const query = (searchQuery || '').toLowerCase().trim();

  const filteredRates = (rates || []).filter((r) => {
    if (!r) return false;
    const codeMatch = r.code && r.code.toLowerCase().includes(query);
    const nameMatch = r.name && r.name.toLowerCase().includes(query);
    const countryMatch = r.country && r.country.toLowerCase().includes(query);
    return codeMatch || nameMatch || countryMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Select Display Currency</h3>
              <p className="text-[11px] text-slate-400">Multi-currency exchange engine (USD Base)</p>
            </div>
          </div>
          <button
            onClick={closeCurrencyModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search currency by country or code (KES, USD, GBP, NGN...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Currency List */}
        <div className="max-h-72 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {filteredRates.map((rate) => {
            const isSelected = rate.code === preferredCurrency;
            return (
              <button
                key={rate.code}
                onClick={() => {
                  setPreferredCurrency(rate.code);
                  closeCurrencyModal();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-blue-950/40 border border-blue-500/40 text-white'
                    : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{rate.flag || '🌐'}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{rate.code}</span>
                      <span className="text-xs text-slate-400">({rate.symbol})</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {rate.name} {rate.country ? `• ${rate.country}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    1 USD = {rate.rateToUSD?.toLocaleString() || 1} {rate.code}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
