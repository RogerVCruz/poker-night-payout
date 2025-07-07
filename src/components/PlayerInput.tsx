
import React from 'react';
import { Minus, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Player data structure
 */
interface Player {
  id: number;
  name: string;
  entries: number | string;
  finalChips: number | string;
}

/**
 * Props for the PlayerInput component
 */
interface PlayerInputProps {
  player: Player;
  buyIn: number;
  updatePlayer: (id: number, field: keyof Player, value: string | number) => void;
  removePlayer: (id: number) => void;
  playersLength: number;
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
 * PlayerInput component for managing individual player data
 */
const PlayerInput: React.FC<PlayerInputProps> = ({ 
  player, 
  buyIn, 
  updatePlayer, 
  removePlayer, 
  playersLength 
}) => {
  const { t } = useTranslation();
  
  /**
   * Calculates the player's result based on entries and buy-in
   */
  const calculateResult = (player: Player): number => {
    const entries = toNumber(player.entries);
    return entries * buyIn;
  };

  /**
   * Formats a number as currency
   */
  const formatCurrency = (amount: number): string => {
    return `${t('currency')} ${amount.toFixed(2)}`;
  };

  const result = calculateResult(player);
  const isProfit = result > 0;
  const isLoss = result < 0;

  return (
    <div className="bg-white border-2 border-[#f9bf71] rounded-lg p-4 shadow-md">
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-[#a2503d]">
            {t('players.playerName')}
          </label>
          <button
            onClick={() => removePlayer(player.id)}
            className="text-[#793c47] hover:text-[#4f4340] p-1 rounded hover:bg-[#f9bf71]/20 transition-colors"
            disabled={playersLength <= 1}
            aria-label={t('players.removePlayer')}
          >
            <Minus size={18} />
          </button>
        </div>
        <div className="w-full">
          <div className="flex items-center border border-[#f9bf71] rounded-md focus-within:ring-2 focus-within:ring-[#ff873f] focus-within:border-transparent hover:border-[#f9bf71] transition-colors group">
            <input
              type="text"
              value={player.name}
              onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
              onFocus={(e) => e.target.select()}
              className="flex-grow px-3 py-2 text-lg font-semibold bg-transparent outline-none text-[#4f4340] rounded-md"
              placeholder={t('players.playerName')}
              aria-label={t('players.editPlayerName')}
            />
            <Edit2 size={16} className="mr-3 text-[#ff873f] opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium text-[#a2503d] mb-1">
            {t('players.entries')}
          </label>
          <input
            type="number"
            min="0"
            value={player.entries}
            onChange={(e) => {
              const value = e.target.value === '' ? '' : parseInt(e.target.value);
              updatePlayer(player.id, 'entries', value);
            }}
            onFocus={(e) => e.target.select()}
            className="w-full px-3 py-2 border border-[#f9bf71] rounded-md focus:ring-2 focus:ring-[#ff873f] focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#a2503d] mb-1">
            {t('players.finalChips')}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={player.finalChips}
            onChange={(e) => {
              const value = e.target.value === '' ? '' : parseFloat(e.target.value);
              updatePlayer(player.id, 'finalChips', value);
            }}
            onFocus={(e) => e.target.select()}
            className="w-full px-3 py-2 border border-[#f9bf71] rounded-md focus:ring-2 focus:ring-[#ff873f] focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div className="border-t-2 border-[#f9bf71] pt-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#a2503d]">{t('players.result')}:</span>
          <span
            className={`text-lg font-bold ${
              isProfit ? 'text-[#ff873f]' : isLoss ? 'text-[#793c47]' : 'text-[#4f4340]'
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
