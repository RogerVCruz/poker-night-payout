
import React from 'react';
import { Calculator, Users, DollarSign, Coins } from 'lucide-react';
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
    <div className="bg-[#1a1a1a] border-2 border-[#4B382A] rounded-lg p-6 shadow-lg print:break-inside-avoid">
      <h2 className="text-2xl font-bold text-[#F5F5DC] mb-4 flex items-center gap-3">
        <Calculator className="text-[#B22222]" size={24} />
        {t('gameSummary.title')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A472A]/40 p-4 rounded-lg text-center">
          <div className="flex justify-center mb-1">
            <Users className="text-[#FFD700]" size={28} />
          </div>
          <div className="text-2xl font-bold text-[#F5F5DC]">{players.length}</div>
          <div className="text-sm text-[#a0a0a0]">{t('gameSummary.totalPlayers')}</div>
        </div>
        
        <div className="bg-[#B22222]/20 p-4 rounded-lg text-center">
          <div className="flex justify-center mb-1">
            <DollarSign className="text-[#FFD700]" size={28} />
          </div>
          <div className="text-2xl font-bold text-[#F5F5DC]">{formatCurrency(getTotalPot())}</div>
          <div className="text-sm text-[#a0a0a0]">{t('gameSummary.totalPot')}</div>
        </div>
        
        <div className="bg-[#4F4F4F]/30 p-4 rounded-lg text-center">
          <div className="flex justify-center mb-1">
            <Coins className="text-[#FFD700]" size={28} />
          </div>
          <div className="text-2xl font-bold text-[#F5F5DC]">{getTotalChips()}</div>
          <div className="text-sm text-[#a0a0a0]">{t('gameSummary.totalChips')}</div>
        </div>
      </div>

      <div className="mt-6 border-t-2 border-[#4B382A] pt-4">
        <h3 className="text-lg font-semibold text-[#F5F5DC] mb-3">{t('gameSummary.playerResults')}</h3>
        <div className="space-y-2">
          {players.map((player) => {
            const result = calculateResult(player);
            const isProfit = result > 0;
            const isLoss = result < 0;
            
            return (
              <div key={player.id} className="flex justify-between items-center py-2 px-3 bg-[#1A472A]/30 rounded border-l-4 border-l-[#B22222]">
                <span className="font-medium text-[#F5F5DC]">{player.name}</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    isProfit ? 'text-[#FFD700]' : isLoss ? 'text-[#D46A6A]' : 'text-[#F5F5DC]'
                  }`}
                >
                  {isProfit && <DollarSign size={16} />}
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
