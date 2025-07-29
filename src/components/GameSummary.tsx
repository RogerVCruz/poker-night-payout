
import React from 'react';
import { Calculator, Users, DollarSign, Coins, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Player } from './PlayerInput';

/**
 * Props for the GameSummary component
 */
interface GameSummaryProps {
  players: Player[];
  buyIn: number;
  chipsPerBuyIn: number;
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
const GameSummary: React.FC<GameSummaryProps> = ({ players, buyIn, chipsPerBuyIn }) => {
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
   * Calculates the total number of buy-ins across all players
   */
  const getTotalBuyIns = (): number => {
    return players.reduce((sum, player) => {
      const entries = toNumber(player.entries);
      return sum + entries;
    }, 0);
  };

  /**
   * Calculates expected chips on table (chips per buy-in × total buy-ins)
   */
  const getExpectedChips = (): number => {
    return chipsPerBuyIn * getTotalBuyIns();
  };

  /**
   * Calculates the difference between actual and expected chips
   */
  const getChipsDifference = (): number => {
    return getTotalChips() - getExpectedChips();
  };

  /**
   * Checks if there's a discrepancy between actual and expected chips
   */
  const hasChipsDiscrepancy = (): boolean => {
    return getChipsDifference() !== 0;
  };

  /**
   * Calculates a player's investment (entries × buy-in)
   */
  const calculatePlayerInvestment = (player: Player): number => {
    const entries = toNumber(player.entries);
    return entries * buyIn;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        
        <div className={`p-4 rounded-lg text-center ${
          hasChipsDiscrepancy() 
            ? 'bg-[#B22222]/20 border-2 border-[#B22222]/50' 
            : 'bg-[#4F4F4F]/30'
        }`}>
          <div className="flex justify-center mb-1 gap-1">
            {!hasChipsDiscrepancy() && <Coins className={"text-[#FFD700]"} size={28} />}
            {hasChipsDiscrepancy() && <AlertTriangle className="text-[#D46A6A]" size={28} />}
          </div>
          <div className={`text-2xl font-bold ${hasChipsDiscrepancy() ? "text-[#D46A6A]" : "text-[#F5F5DC]"}`}>
            {getTotalChips()}
          </div>
          <div className="text-sm text-[#a0a0a0]">{t('gameSummary.totalChips')}</div>
          {hasChipsDiscrepancy() && (
            <div className={`text-xs mt-1 font-semibold ${
              getChipsDifference() > 0 ? 'text-[#FFD700]' : 'text-[#D46A6A]'
            }`}>
              {getChipsDifference() > 0 ? '+' : ''}{getChipsDifference()} {t('gameSummary.chipsUnit')}
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-lg text-center ${
          hasChipsDiscrepancy() 
            ? 'bg-[#4F4F4F]/50 border-2 border-[#4F4F4F]/70' 
            : 'bg-[#1A472A]/60 border-2 border-[#1A472A]/80'
        }`}>
          <div className="flex justify-center mb-1">
            <Coins className={hasChipsDiscrepancy() ? "text-[#a0a0a0]" : "text-[#FFD700]"} size={28} />
          </div>
          <div className={`text-2xl font-bold ${hasChipsDiscrepancy() ? "text-[#a0a0a0]" : "text-[#F5F5DC]"}`}>
            {getExpectedChips()}
          </div>
          <div className="text-sm text-[#a0a0a0]">{t('gameSummary.expectedChips')}</div>
        </div>
      </div>

      <div className="mt-6 border-t-2 border-[#4B382A] pt-4">
        <h3 className="text-lg font-semibold text-[#F5F5DC] mb-3">{t('gameSummary.playerResults')}</h3>
        <div className="space-y-2">
          {players.map((player) => {
            const result = calculateResult(player);
            const investment = calculatePlayerInvestment(player);
            const isProfit = result > 0;
            const isLoss = result < 0;
            
            return (
              <div key={player.id} className="py-3 px-4 bg-[#1A472A]/30 rounded border-l-4 border-l-[#B22222]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-[#F5F5DC] text-lg">{player.name}</span>
                  <span
                    className={`font-bold flex items-center gap-1 text-lg ${
                      isProfit ? 'text-[#FFD700]' : isLoss ? 'text-[#D46A6A]' : 'text-[#F5F5DC]'
                    }`}
                  >
                    {isProfit && <DollarSign size={16} />}
                    {formatCurrency(result)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#a0a0a0] flex items-center gap-1">
                    <DollarSign size={14} className="text-[#B22222]" />
                    {t('players.investment')}: {formatCurrency(investment)}
                  </span>
                  <span className="text-[#a0a0a0]">
                    {toNumber(player.entries)} {toNumber(player.entries) === 1 ? t('players.entry') : t('players.entriesPlural')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameSummary;
