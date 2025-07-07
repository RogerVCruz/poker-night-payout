
import React from 'react';
import { DollarSign } from 'lucide-react';
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
    <div className="bg-white border-2 border-[#f9bf71] rounded-lg p-6 mb-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="text-[#a2503d]" size={24} />
        <h2 className="text-2xl font-bold text-[#4f4340]">{t('gameSettings.title')}</h2>
      </div>
      
      <div className="max-w-md">
        <label className="block text-sm font-medium text-[#a2503d] mb-2">
          {t('gameSettings.buyIn')}
        </label>
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
          className="w-full px-4 py-3 text-lg border-2 border-[#f9bf71] rounded-md focus:ring-2 focus:ring-[#ff873f] focus:border-transparent"
          required
        />
      </div>
    </div>
  );
};

export default BuyInSection;
