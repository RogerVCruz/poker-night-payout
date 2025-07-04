
import React from 'react';
import { DollarSign } from 'lucide-react';

interface BuyInSectionProps {
  buyIn: number;
  setBuyIn: (value: number) => void;
}

const BuyInSection: React.FC<BuyInSectionProps> = ({ buyIn, setBuyIn }) => {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="text-green-700" size={24} />
        <h2 className="text-2xl font-bold text-green-800">Game Settings</h2>
      </div>
      
      <div className="max-w-md">
        <label className="block text-sm font-medium text-green-700 mb-2">
          Buy-in Value (per entry)
        </label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={buyIn}
          onChange={(e) => setBuyIn(parseFloat(e.target.value) || 0.01)}
          className="w-full px-4 py-3 text-lg border-2 border-amber-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  );
};

export default BuyInSection;
