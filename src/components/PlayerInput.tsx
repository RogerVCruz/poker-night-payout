
import React from 'react';
import { Minus } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  entries: number;
  finalChips: number;
}

interface PlayerInputProps {
  player: Player;
  buyIn: number;
  updatePlayer: (id: number, field: keyof Player, value: string | number) => void;
  removePlayer: (id: number) => void;
  playersLength: number;
}

const PlayerInput: React.FC<PlayerInputProps> = ({ 
  player, 
  buyIn, 
  updatePlayer, 
  removePlayer, 
  playersLength 
}) => {
  const calculateResult = (player: Player): number => {
    return  player.entries * buyIn;
  };

  const formatCurrency = (amount: number): string => {
    return `R$ ${amount.toFixed(2)}`;
  };

  const result = calculateResult(player);
  const isProfit = result > 0;
  const isLoss = result < 0;

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <input
          type="text"
          value={player.name}
          onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
          className="text-lg font-semibold bg-transparent border-b-2 border-amber-300 focus:border-amber-500 outline-none text-green-800"
          placeholder="Player Name"
        />
        <button
          onClick={() => removePlayer(player.id)}
          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
          disabled={playersLength <= 1}
        >
          <Minus size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Entries
          </label>
          <input
            type="number"
            min="1"
            value={player.entries}
            onChange={(e) => updatePlayer(player.id, 'entries', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Final Chips
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={player.finalChips}
            onChange={(e) => updatePlayer(player.id, 'finalChips', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div className="border-t-2 border-amber-200 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-green-700">Result:</span>
          <span
            className={`text-lg font-bold ${
              isProfit ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {formatCurrency(result)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerInput;
export type { Player };
