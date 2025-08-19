import { useState, useEffect } from 'react';

export const useQuestState = () => {
  const [completedQuests, setCompletedQuests] = useState(() => {
    const saved = localStorage.getItem('completedQuests');
    return saved ? JSON.parse(saved) : [];
  });

  const [mintedNFTs, setMintedNFTs] = useState(() => {
    const saved = localStorage.getItem('userNFTs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
  }, [completedQuests]);

  useEffect(() => {
    localStorage.setItem('userNFTs', JSON.stringify(mintedNFTs));
  }, [mintedNFTs]);

  const markQuestCompleted = (questId) => {
    if (!completedQuests.includes(questId)) {
      setCompletedQuests(prev => [...prev, questId]);
    }
  };

  const isQuestCompleted = (questId) => {
    return completedQuests.includes(questId);
  };

  const addNFT = (nftData) => {
    const newNFT = {
      id: Date.now(),
      type: nftData.type || 'Sunshine',
      rarity: 'Dynamic (weather-reactive)',
      mintedAt: new Date().toISOString(),
      blockchain: nftData.isReal ? 'Somnia Testnet' : 'Demo Mode',
      ...nftData
    };
    setMintedNFTs(prev => [...prev, newNFT]);
  };

  const clearAll = () => {
    setCompletedQuests([]);
    setMintedNFTs([]);
    localStorage.removeItem('completedQuests');
    localStorage.removeItem('userNFTs');
  };

  return { 
    completedQuests, 
    markQuestCompleted, 
    isQuestCompleted,
    mintedNFTs,
    addNFT,
    clearAll
  };
};