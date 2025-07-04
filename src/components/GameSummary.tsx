
import React from 'react';
import { Calculator } from 'lucide-react';
import { Player } from './PlayerInput';

interface GameSummaryProps {
  players: Player[];
  buyIn: number;
}

const GameSummary: React.FC<GameSummaryProps> = ({ players, buyIn }) => {
  const formatCurrency = (amount: number): string => {
    return `R$ ${amount.toFixed(2)}`;
  };

  const calculateResult = (player: Player): number => {
    const totalPot = getTotalPot();
    const totalChips = getTotalChips();
    
    if (totalChips === 0) return 0;
    
    const realChipValue = totalPot / totalChips;
    const playerCashValue = player.finalChips * realChipValue;
    const playerInvestment = player.entries * buyIn;
    
    return playerCashValue - playerInvestment;
  };

  const getTotalPot = (): number => {
    return players.reduce((sum, player) => sum + (player.entries * buyIn), 0);
  };

  const getTotalChips = (): number => {
    return players.reduce((sum, player) => sum + player.finalChips, 0);
  };

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 shadow-lg print:break-inside-avoid">
      <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-3">
        <Calculator className="text-green-700" size={24} />
        Game Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800">{players.length}</div>
          <div className="text-sm text-green-600">Total Players</div>
        </div>
        
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-800">{formatCurrency(getTotalPot())}</div>
          <div className="text-sm text-blue-600">Total Pot</div>
        </div>
        
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-800">{getTotalChips()}</div>
          <div className="text-sm text-purple-600">Total Chips</div>
        </div>
      </div>

      <div className="mt-6 border-t-2 border-amber-200 pt-4">
        <h3 className="text-lg font-semibold text-green-800 mb-3">Final Results</h3>
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
