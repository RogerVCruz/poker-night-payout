
import React from 'react';
import { DollarSign, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the BuyInSection component
 */
interface BuyInSectionProps {
  buyIn: number;
  setBuyIn: (value: number) => void;
}

/**
 * Converts a potentially string value to a number
 * @param value - The value to convert
 * @param defaultValue - Default value if empty string (defaults to 0)
 * @returns The numeric value
 */
const toNumber = (value: number | string, defaultValue = 0): number => {
  if (typeof value === 'string') {
    return value === '' ? defaultValue : parseFloat(value);
  }
  return value;
};

/**
 * BuyInSection component for managing buy-in amount
 */
const BuyInSection: React.FC<BuyInSectionProps> = ({ buyIn, setBuyIn }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#1a1a1a] border-2 border-[#4B382A] rounded-lg p-6 mb-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="text-[#B22222]" size={24} />
        <h2 className="text-2xl font-bold text-[#F5F5DC]">{t('gameSettings.title')}</h2>
      </div>
      
      <div className="max-w-md">
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2 flex items-center gap-2">
          <Coins className="text-[#FFD700]" size={18} />
          {t('gameSettings.buyIn')}
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
            <DollarSign className="text-[#FFD700] opacity-70" size={18} />
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            value={buyIn}
            onChange={(e) => {
              const value = e.target.value === '' ? '' : parseFloat(e.target.value);
              setBuyIn(toNumber(value));
            }}
            onFocus={(e) => e.target.select()}
            className="w-full px-4 py-3 pl-10 text-lg border-2 border-[#4B382A] rounded-md focus:ring-2 focus:ring-[#FFD700] focus:border-transparent bg-[#1A472A]/30 text-[#F5F5DC]"
            required
          />
        </div>
        <div className="mt-3 flex justify-between">
          <button 
            onClick={() => setBuyIn(Math.max(0, buyIn - 5))} 
            className="px-3 py-1 bg-[#4F4F4F]/30 hover:bg-[#4F4F4F]/50 rounded-md text-[#F5F5DC] transition-colors flex items-center gap-1"
          >
            <span>-5</span>
            <Coins size={14} className="text-[#FFD700]" />
          </button>
          <button 
            onClick={() => setBuyIn(buyIn + 5)} 
            className="px-3 py-1 bg-[#B22222]/20 hover:bg-[#B22222]/40 rounded-md text-[#F5F5DC] transition-colors flex items-center gap-1"
          >
            <span>+5</span>
            <Coins size={14} className="text-[#FFD700]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyInSection;
