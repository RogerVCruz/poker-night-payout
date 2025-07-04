
import React from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Player } from './PlayerInput';

/**
 * Props for the HtmlExporter component
 */
interface HtmlExporterProps {
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
 * HtmlExporter component for exporting game results as HTML
 */
const HtmlExporter: React.FC<HtmlExporterProps> = ({ players, buyIn }) => {
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
   * Calculates a player's result
   */
  const calculateResult = (player: Player): number => {
    const finalChips = toNumber(player.finalChips);
    const entries = toNumber(player.entries);
    
    return finalChips - (entries * buyIn);
  };

  const generateHtml = (): string => {
    const currentDate = new Date().toLocaleDateString();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Poker Night Results - ${currentDate}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #1e3a2e, #2d5a3d);
            color: #333;
            min-height: 100vh;
        }
        .container {
            background: #fef7e0;
            border: 3px solid #f59e0b;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1 {
            color: #166534;
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .date {
            text-align: center;
            color: #92400e;
            font-size: 1.1rem;
            margin-bottom: 30px;
        }
        .game-info {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #10b981;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
        }
        .summary-card.players {
            background: #dcfce7;
            color: #166534;
        }
        .summary-card.pot {
            background: #dbeafe;
            color: #1e40af;
        }
        .summary-card.chips {
            background: #ede9fe;
            color: #7c3aed;
        }
        .summary-card .value {
            font-size: 1.8rem;
            display: block;
        }
        .summary-card .label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        .results-section {
            margin-top: 30px;
        }
        .results-title {
            color: #166534;
            font-size: 1.5rem;
            margin-bottom: 20px;
            border-bottom: 2px solid #f59e0b;
            padding-bottom: 10px;
        }
        .player-result {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            margin: 10px 0;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .player-name {
            font-weight: bold;
            color: #166534;
            font-size: 1.1rem;
        }
        .player-details {
            font-size: 0.9rem;
            color: #6b7280;
            margin-top: 4px;
        }
        .player-amount {
            font-weight: bold;
            font-size: 1.2rem;
        }
        .profit {
            color: #059669;
        }
        .loss {
            color: #dc2626;
        }
        .break-even {
            color: #6b7280;
        }
        @media print {
            body {
                background: white;
                color: black;
            }
            .container {
                box-shadow: none;
                border: 2px solid #333;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎰 Poker Night Results</h1>
        <div class="date">Generated on ${currentDate}</div>
        
        <div class="game-info">
            <h3 style="margin: 0 0 10px 0; color: #166534;">Game Settings</h3>
            <p style="margin: 0;"><strong>Buy-in per entry:</strong> ${formatCurrency(buyIn)}</p>
        </div>

        <div class="summary-grid">
            <div class="summary-card players">
                <span class="value">${players.length}</span>
                <span class="label">Total Players</span>
            </div>
            <div class="summary-card pot">
                <span class="value">${formatCurrency(getTotalPot())}</span>
                <span class="label">Total Pot</span>
            </div>
            <div class="summary-card chips">
                <span class="value">${formatCurrency(getTotalChips())}</span>
                <span class="label">Total Chips</span>
            </div>
        </div>

        <div class="results-section">
            <h3 class="results-title">Final Results</h3>
            ${players.map(player => {
              const result = calculateResult(player);
              const resultClass = result > 0 ? 'profit' : result < 0 ? 'loss' : 'break-even';
              const resultSymbol = result > 0 ? '+' : '';
              
              return `
                <div class="player-result">
                    <div>
                        <div class="player-name">${player.name}</div>
                        <div class="player-details">
                            ${typeof player.entries === 'string' ? (player.entries === '' ? 0 : parseFloat(player.entries)) : player.entries} ${(typeof player.entries === 'string' ? (player.entries === '' ? 0 : parseFloat(player.entries)) : player.entries) === 1 ? 'entry' : 'entries'} • 
                            Final chips: ${formatCurrency(typeof player.finalChips === 'string' ? (player.finalChips === '' ? 0 : parseFloat(player.finalChips)) : player.finalChips)}
                        </div>
                    </div>
                    <div class="player-amount ${resultClass}">
                        ${resultSymbol}${formatCurrency(Math.abs(result))}
                    </div>
                </div>
              `;
            }).join('')}
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 0.9rem; color: #6b7280; border-top: 1px solid #d1d5db; padding-top: 20px;">
            <p>Generated by Poker Night Calculator</p>
        </div>
    </div>
</body>
</html>`;
  };

  const downloadHtml = () => {
    const html = generateHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `poker-night-results-${currentDate}.html`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadHtml}
      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-md"
    >
      <Download size={20} />
      {t('export.exportHtml')}
    </button>
  );
};

export default HtmlExporter;
