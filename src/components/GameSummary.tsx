
import React from 'react';
import { Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Player } from './PlayerInput';

/**
 * Props for the GameSummary component
 */
interface GameSummaryProps {
  players: Player[];
  buyIn: number;
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
 * GameSummary component for displaying game statistics
 */
const GameSummary: React.FC<GameSummaryProps> = ({ players, buyIn }) => {
  const { t } = useTranslation();
  
  /**
   * Formats a number as currency
   */
  const formatCurrency = (amount: number): string => {
    return `${t('currency')} ${amount.toFixed(2)}`;
  };

  /**
   * Calculates the total pot (sum of all buy-ins)
   */
  const getTotalPot = (): number => {
    return players.reduce((sum, player) => {
      const entries = toNumber(player.entries);
      return sum + (entries * buyIn);
    }, 0);
  };

  /**
   * Calculates the total chips in play
   */
  const getTotalChips = (): number => {
    return players.reduce((sum, player) => {
      const finalChips = toNumber(player.finalChips);
      return sum + finalChips;
    }, 0);
  };
  
  /**
   * Calculates a player's result based on chip value
   */
  const calculateResult = (player: Player): number => {
    const totalPot = getTotalPot();
    const totalChips = getTotalChips();
    
    if (totalChips === 0) return 0;
    
    const realChipValue = totalPot / totalChips;
    const finalChips = toNumber(player.finalChips);
    const entries = toNumber(player.entries);
    
    const playerCashValue = finalChips * realChipValue;
    const playerInvestment = entries * buyIn;
    
    return playerCashValue - playerInvestment;
  };

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 shadow-lg print:break-inside-avoid">
      <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-3">
        <Calculator className="text-green-700" size={24} />
        {t('gameSummary.title')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800">{players.length}</div>
          <div className="text-sm text-green-600">{t('gameSummary.totalPlayers')}</div>
        </div>
        
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-800">{formatCurrency(getTotalPot())}</div>
          <div className="text-sm text-blue-600">{t('gameSummary.totalPot')}</div>
        </div>
        
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-800">{getTotalChips()}</div>
          <div className="text-sm text-purple-600">{t('gameSummary.totalChips')}</div>
        </div>
      </div>

      <div className="mt-6 border-t-2 border-amber-200 pt-4">
        <h3 className="text-lg font-semibold text-green-800 mb-3">{t('gameSummary.playerResults')}</h3>
        <div className="space-y-2">
          {players.map((player) => {
            const result = calculateResult(player);
            const isProfit = result > 0;
            const isLoss = result < 0;
            
            return (
              <div key={player.id} className="flex justify-between items-center py-2 px-3 bg-white rounded border-l-4 border-l-amber-400">
                <span className="font-medium text-green-800">{player.name}</span>
                <span
                  className={`font-bold ${
                    isProfit ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {formatCurrency(result)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameSummary;
