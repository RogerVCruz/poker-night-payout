import React, { useState, useEffect } from 'react';
import { Plus, Users, Calculator, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PlayerInput, { Player } from '../components/PlayerInput';
import BuyInSection from '../components/BuyInSection';
import GameSummary from '../components/GameSummary';
import HtmlExporter from '../components/HtmlExporter';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Index = () => {
  const { t } = useTranslation();
  
  // Helper function to convert to number for calculations
  const toNumber = (value: number | string, defaultValue = 0): number => {
    if (typeof value === 'string') {
      return value === '' ? defaultValue : parseFloat(value);
    }
    return value;
  };
  const [buyIn, setBuyIn] = useState<number | string>(10);
  const [chipsPerBuyIn, setChipsPerBuyIn] = useState<number | string>(400);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', entries: 1, finalChips: 0 },
    { id: 2, name: 'Player 2', entries: 1, finalChips: 0 },
    { id: 3, name: 'Player 3', entries: 1, finalChips: 0 },
    { id: 4, name: 'Player 4', entries: 1, finalChips: 0 },
  ]);
  const [nextId, setNextId] = useState(5);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('pokerCalculator');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setBuyIn(parsed.buyIn || 10);
        setChipsPerBuyIn(parsed.chipsPerBuyIn || 400);
        setPlayers(parsed.players || []);
        setNextId(parsed.nextId || 5);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      buyIn: toNumber(buyIn),
      chipsPerBuyIn: toNumber(chipsPerBuyIn),
      players,
      nextId,
    };
    localStorage.setItem('pokerCalculator', JSON.stringify(dataToSave));
  }, [buyIn, chipsPerBuyIn, players, nextId]);

  const addPlayer = () => {
    const newPlayer: Player = {
      id: nextId,
      name: `Player ${nextId}`,
      entries: 1,
      finalChips: 0,
    };
    setPlayers([...players, newPlayer]);
    setNextId(nextId + 1);
  };

  const removePlayer = (id: number) => {
    if (players.length > 1) {
      setPlayers(players.filter(player => player.id !== id));
    }
  };

  const clearAllData = () => {
    if (window.confirm(t('actions.clearConfirm'))) {
      setPlayers([
        { id: 1, name: 'Player 1', entries: 1, finalChips: 0 },
        { id: 2, name: 'Player 2', entries: 1, finalChips: 0 },
        { id: 3, name: 'Player 3', entries: 1, finalChips: 0 },
        { id: 4, name: 'Player 4', entries: 1, finalChips: 0 },
      ]);
      setBuyIn(10);
      setChipsPerBuyIn(400);
      setNextId(5);
    }
  };

  const updatePlayer = (id: number, field: keyof Player, value: string | number) => {
    setPlayers(players.map(player =>
      player.id === id ? { ...player, [field]: value } : player
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A472A] via-[#1a1a1a] to-[#4B382A] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5DC] mb-2 flex items-center justify-center gap-3">
            <Calculator className="text-[#FFD700]" size={48} />
            {t('app.title')}
          </h1>
        </div>

        {/* Buy-in Section */}
        <BuyInSection buyIn={buyIn} setBuyIn={setBuyIn} chipsPerBuyIn={chipsPerBuyIn} setChipsPerBuyIn={setChipsPerBuyIn} />

        {/* Players Section */}
        <div className="bg-[#1a1a1a] border-2 border-[#4B382A] rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Users className="text-[#B22222]" size={24} />
              <h2 className="text-2xl font-bold text-[#F5F5DC]">{t('players.title')}</h2>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={clearAllData}
                className="bg-[#4F4F4F] hover:bg-[#4B382A] text-[#F5F5DC] font-semibold py-2 px-3 sm:px-4 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors shadow-md text-sm sm:text-base flex-1 sm:flex-initial justify-center"
              >
                <Trash2 size={18} />
                <span className="whitespace-nowrap">{t('actions.clearAll')}</span>
              </button>
              <button
                onClick={addPlayer}
                className="bg-[#B22222] hover:bg-[#D46A6A] text-[#F5F5DC] font-semibold py-2 px-3 sm:px-4 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors shadow-md text-sm sm:text-base flex-1 sm:flex-initial justify-center"
              >
                <Plus size={18} />
                <span className="whitespace-nowrap">{t('players.addPlayer')}</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {players.map((player) => (
              <PlayerInput 
                key={player.id} 
                player={player} 
                buyIn={toNumber(buyIn)}
                updatePlayer={updatePlayer}
                removePlayer={removePlayer}
                playersLength={players.length}
              />
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <GameSummary players={players} buyIn={toNumber(buyIn)} chipsPerBuyIn={toNumber(chipsPerBuyIn)} />

        {/* Export Section */}
        {/* <div className="text-center mt-6">
          <HtmlExporter players={players} buyIn={buyIn} />
        </div> */}

        {/* Print Instructions */}
        {/* <div className="text-center mt-4 text-amber-200 text-sm">
          <p>💡 Tip: Use your browser's print function to save or print these results, or export as HTML for sharing</p>
        </div> */}
      </div>
    </div>
  );
};

export default Index;
