/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Building2,
  Check,
  Minus,
  ShieldCheck,
  Navigation,
  DollarSign,
  BedDouble,
  Heart,
} from 'lucide-react';
import { AccommodationListing } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';

interface AccommodationComparisonModalProps {
  properties: AccommodationListing[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onSelectProperty: (property: AccommodationListing) => void;
}

export function AccommodationComparisonModal({
  properties,
  isOpen,
  onClose,
  onRemove,
  onSelectProperty,
}: AccommodationComparisonModalProps) {
  const { activeRate, convertPrice } = useCurrency();

  if (!isOpen || properties.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="accommodation-comparison-modal"
        className="relative w-full max-w-5xl bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#171923]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Accommodation Comparison Matrix</h2>
              <p className="text-xs text-white/40">Comparing {properties.length} campus housing options side-by-side</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-x-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 w-40 text-white/40 font-mono uppercase text-[10px]">Criteria</th>
                {properties.map((p) => (
                  <th key={p.id} className="p-3 min-w-[200px] align-top">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-mono text-[#50E3C2]">{p.propertyType.replace('_', ' ')}</span>
                        <button
                          type="button"
                          onClick={() => onRemove(p.id)}
                          className="text-white/40 hover:text-rose-400 p-1"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div
                        onClick={() => onSelectProperty(p)}
                        className="font-bold text-white hover:text-[#50E3C2] cursor-pointer line-clamp-1"
                      >
                        {p.title}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {/* Monthly Price */}
              <tr>
                <td className="p-3 font-semibold text-white/60 font-mono">Monthly Rent</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 font-bold text-white">
                    <div className="text-sm text-[#50E3C2]">
                      {activeRate.symbol} {convertPrice(p.price, p.currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      Orig: {p.currency} {p.price.toLocaleString()}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Room Layout */}
              <tr>
                <td className="p-3 font-semibold text-white/60 font-mono">Room Type</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 capitalize">{p.roomType.replace('_', ' ')}</td>
                ))}
              </tr>

              {/* Distance to Campus */}
              <tr>
                <td className="p-3 font-semibold text-white/60 font-mono">Campus Distance</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 font-semibold text-white">
                    {p.distanceFromCampusKm !== undefined ? `${p.distanceFromCampusKm} km` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Verified Badge */}
              <tr>
                <td className="p-3 font-semibold text-white/60 font-mono">Verified Status</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.verificationBadge ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-white/40">Standard</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Available Beds */}
              <tr>
                <td className="p-3 font-semibold text-white/60 font-mono">Availability</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    <span
                      className={`font-semibold ${
                        p.availableUnits > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {p.availableUnits} of {p.totalUnits} available
                    </span>
                  </td>
                ))}
              </tr>

              {/* Furnished */}
              <tr>
                <td className="p-3 font-semibold text-white/60 font-mono">Furnished</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.isFurnished ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Minus className="w-4 h-4 text-white/20" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Bills Included */}
              <tr>
                <td className="p-3 font-semibold text-white/60 font-mono">Bills / Utilities</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.utilitiesIncluded ? (
                      <span className="text-emerald-400 font-semibold">Included</span>
                    ) : (
                      <span className="text-white/40">Excluded</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Gender Preference */}
              <tr>
                <td className="p-3 font-semibold text-white/60 font-mono">Gender Policy</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 capitalize">
                    {p.genderPreference ? p.genderPreference.replace('_', ' ') : 'Mixed'}
                  </td>
                ))}
              </tr>

              {/* Key Amenities */}
              <tr>
                <td className="p-3 font-semibold text-white/60 font-mono">Amenities</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    <div className="space-y-1">
                      {p.amenities.slice(0, 4).map((a, i) => (
                        <div key={i} className="text-[11px] text-white/70 truncate">• {a}</div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
