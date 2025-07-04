import React, { useState, useEffect } from 'react';
import { Plus, Users, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PlayerInput, { Player } from '../components/PlayerInput';
import BuyInSection from '../components/BuyInSection';
import GameSummary from '../components/GameSummary';
import HtmlExporter from '../components/HtmlExporter';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Index = () => {
  const { t } = useTranslation();
  const [buyIn, setBuyIn] = useState<number>(100);
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
        setBuyIn(parsed.buyIn || 100);
        setPlayers(parsed.players || []);
        setNextId(parsed.nextId || 5);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      buyIn,
      players,
      nextId,
    };
    localStorage.setItem('pokerCalculator', JSON.stringify(dataToSave));
  }, [buyIn, players, nextId]);

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

  const updatePlayer = (id: number, field: keyof Player, value: string | number) => {
    setPlayers(players.map(player =>
      player.id === id ? { ...player, [field]: value } : player
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-2 flex items-center justify-center gap-3">
            <Calculator className="text-amber-200" size={48} />
            {t('app.title')}
          </h1>
          <p className="text-amber-200 text-lg">{t('app.subtitle')}</p>
        </div>

        {/* Buy-in Section */}
        <BuyInSection buyIn={buyIn} setBuyIn={setBuyIn} />

        {/* Players Section */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="text-green-700" size={24} />
              <h2 className="text-2xl font-bold text-green-800">{t('players.title')}</h2>
            </div>
            
            <button
              onClick={addPlayer}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-md"
            >
              <Plus size={20} />
              {t('players.addPlayer')}
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {players.map((player) => (
              <PlayerInput 
                key={player.id} 
                player={player} 
                buyIn={buyIn}
                updatePlayer={updatePlayer}
                removePlayer={removePlayer}
                playersLength={players.length}
              />
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <GameSummary players={players} buyIn={buyIn} />

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
