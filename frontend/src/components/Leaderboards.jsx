// FILE: frontend/src/components/Leaderboards.jsx
import React, { useState } from 'react';

const Leaderboards = ({ 
  levelLeaderboard = [], 
  experienceLeaderboard = [], 
  questLeaderboard = [],
  achievements = [],
  userAddress = '',
  userAchievements = []
}) => {
  const [activeTab, setActiveTab] = useState('level');

  const tabs = [
    { id: 'level', name: 'Level Rankings', icon: '🏆', color: '#4CAF50' },
    { id: 'experience', name: 'Experience', icon: '⭐', color: '#2196F3' },
    { id: 'quests', name: 'Quest Masters', icon: '🎯', color: '#FF9800' },
    { id: 'achievements', name: 'Achievements', icon: '🏅', color: '#9C27B0' }
  ];

  const getCurrentLeaderboard = () => {
    switch (activeTab) {
      case 'level': return levelLeaderboard;
      case 'experience': return experienceLeaderboard;
      case 'quests': return questLeaderboard;
      default: return [];
    }
  };

  const getPlayerPosition = (playerAddress, leaderboard) => {
    const position = leaderboard.findIndex(player => player.address === playerAddress);
    return position >= 0 ? position + 1 : null;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return { emoji: '🥇', color: '#FFD700', name: 'Champion' };
      case 2: return { emoji: '🥈', color: '#C0C0C0', name: 'Master' };
      case 3: return { emoji: '🥉', color: '#CD7F32', name: 'Expert' };
      default: return { emoji: '🏅', color: '#666', name: `#${rank}` };
    }
  };

  const mockLeaderboardData = {
    level: [
      { address: '0x1234...5678', username: 'StormMaster', level: 12, experience: 5420, questsCompleted: 34 },
      { address: '0x2345...6789', username: 'SunSeeker', level: 11, experience: 4890, questsCompleted: 28 },
      { address: '0x3456...7890', username: 'FogWalker', level: 10, experience: 4320, questsCompleted: 25 },
      { address: userAddress || '0x4567...8901', username: 'You', level: 5, experience: 1250, questsCompleted: 12 },
      { address: '0x5678...9012', username: 'RainDancer', level: 9, experience: 3850, questsCompleted: 22 }
    ],
    experience: [
      { address: '0x1234...5678', username: 'StormMaster', level: 12, experience: 5420, questsCompleted: 34 },
      { address: '0x2345...6789', username: 'SunSeeker', level: 11, experience: 4890, questsCompleted: 28 },
      { address: '0x3456...7890', username: 'FogWalker', level: 10, experience: 4320, questsCompleted: 25 },
      { address: '0x5678...9012', username: 'RainDancer', level: 9, experience: 3850, questsCompleted: 22 },
      { address: userAddress || '0x4567...8901', username: 'You', level: 5, experience: 1250, questsCompleted: 12 }
    ],
    quests: [
      { address: '0x1234...5678', username: 'StormMaster', level: 12, experience: 5420, questsCompleted: 34 },
      { address: '0x2345...6789', username: 'SunSeeker', level: 11, experience: 4890, questsCompleted: 28 },
      { address: '0x3456...7890', username: 'FogWalker', level: 10, experience: 4320, questsCompleted: 25 },
      { address: '0x5678...9012', username: 'RainDancer', level: 9, experience: 3850, questsCompleted: 22 },
      { address: userAddress || '0x4567...8901', username: 'You', level: 5, experience: 1250, questsCompleted: 12 }
    ]
  };

  const mockAchievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your first quest',
      icon: '👶',
      rarity: 'Common',
      reward: 100,
      unlocked: true
    },
    {
      id: 2,
      name: 'Weather Master',
      description: 'Experience all 5 weather types',
      icon: '🌦️',
      rarity: 'Rare',
      reward: 500,
      unlocked: true
    },
    {
      id: 3,
      name: 'Storm Chaser',
      description: 'Complete 10 quests during storms',
      icon: '⛈️',
      rarity: 'Epic',
      reward: 1000,
      unlocked: false
    },
    {
      id: 4,
      name: 'Social Butterfly',
      description: 'Complete 5 cooperative quests',
      icon: '🦋',
      rarity: 'Uncommon',
      reward: 300,
      unlocked: true
    },
    {
      id: 5,
      name: 'Vote Master',
      description: 'Create 3 successful weather votes',
      icon: '🗳️',
      rarity: 'Rare',
      reward: 750,
      unlocked: false
    },
    {
      id: 6,
      name: 'NFT Collector',
      description: 'Own 10 different weather NFTs',
      icon: '🖼️',
      rarity: 'Epic',
      reward: 1500,
      unlocked: false
    }
  ];

  const currentLeaderboard = getCurrentLeaderboard().length > 0 ? getCurrentLeaderboard() : mockLeaderboardData[activeTab];
  const currentAchievements = achievements.length > 0 ? achievements : mockAchievements;

  const getStatValue = (player, tab) => {
    switch (tab) {
      case 'level': return player.level;
      case 'experience': return player.experience;
      case 'quests': return player.questsCompleted;
      default: return 0;
    }
  };

  const getStatLabel = (tab) => {
    switch (tab) {
      case 'level': return 'Level';
      case 'experience': return 'XP';
      case 'quests': return 'Quests';
      default: return '';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return '#4CAF50';
      case 'Uncommon': return '#2196F3';
      case 'Rare': return '#9C27B0';
      case 'Epic': return '#FF9800';
      case 'Legendary': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      width: '100%'
    }}>
      <h2 style={{ color: '#fff', margin: '0 0 1.5rem 0', fontSize: '1.8rem' }}>
        🏆 Leaderboards & Achievements
      </h2>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Leaderboard Content */}
      {activeTab !== 'achievements' ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* Leaderboard Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr 100px 100px',
            gap: '1rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            color: '#ccc',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            <div>Rank</div>
            <div>Player</div>
            <div>Level</div>
            <div>{getStatLabel(activeTab)}</div>
          </div>

          {/* Leaderboard Entries */}
          {currentLeaderboard.map((player, index) => {
            const rank = index + 1;
            const badge = getRankBadge(rank);
            const isUser = player.address === userAddress;
            
            return (
              <div
                key={player.address}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 100px 100px',
                  gap: '1rem',
                  padding: '1rem',
                  background: isUser 
                    ? 'rgba(33, 150, 243, 0.2)' 
                    : 'rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  border: isUser ? '2px solid #2196F3' : '1px solid rgba(255,255,255,0.1)',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Rank */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.2rem'
                }}>
                  <span>{badge.emoji}</span>
                  <span style={{ color: badge.color, fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {rank}
                  </span>
                </div>

                {/* Player Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${badge.color}, ${badge.color}80)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    {player.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>
                      {player.username}
                      {isUser && <span style={{ color: '#2196F3', marginLeft: '0.5rem' }}>(You)</span>}
                    </div>
                    <div style={{ color: '#ccc', fontSize: '0.8rem' }}>
                      {player.address.slice(0, 6)}...{player.address.slice(-4)}
                    </div>
                  </div>
                </div>

                {/* Level */}
                <div style={{
                  textAlign: 'center',
                  color: '#4CAF50',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  {player.level}
                </div>

                {/* Stat Value */}
                <div style={{
                  textAlign: 'center',
                  color: tabs.find(t => t.id === activeTab)?.color || '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  {formatNumber(getStatValue(player, activeTab))}
                </div>
              </div>
            );
          })}

          {/* User Position (if not in top 10) */}
          {currentLeaderboard.length >= 10 && !currentLeaderboard.some(p => p.address === userAddress) && (
            <div style={{
              padding: '1rem',
              background: 'rgba(33, 150, 243, 0.1)',
              borderRadius: '10px',
              border: '1px solid #2196F3',
              textAlign: 'center',
              color: '#ccc'
            }}>
              <div style={{ marginBottom: '0.5rem', color: '#2196F3', fontWeight: 'bold' }}>
                Your Position
              </div>
              <div>You are ranked #{getPlayerPosition(userAddress, currentLeaderboard) || '100+'} in {activeTab}</div>
            </div>
          )}
        </div>
      ) : (
        /* Achievements Tab */
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ color: '#ccc' }}>
              {currentAchievements.filter(a => a.unlocked).length} of {currentAchievements.length} unlocked
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              color: '#4CAF50',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              Total Rewards: {currentAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward, 0)} $WEATHER
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {currentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                style={{
                  background: achievement.unlocked 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(255,255,255,0.05)',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  border: achievement.unlocked 
                    ? '2px solid #4CAF50' 
                    : '1px solid rgba(255,255,255,0.1)',
                  opacity: achievement.unlocked ? 1 : 0.6,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    fontSize: '3rem',
                    filter: achievement.unlocked ? 'none' : 'grayscale(100%)'
                  }}>
                    {achievement.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ 
                        color: achievement.unlocked ? '#fff' : '#999', 
                        margin: 0,
                        fontSize: '1.2rem'
                      }}>
                        {achievement.name}
                      </h4>
                      {achievement.unlocked && (
                        <span style={{
                          background: '#4CAF50',
                          color: 'white',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          ✓ UNLOCKED
                        </span>
                      )}
                    </div>
                    
                    <p style={{ 
                      color: achievement.unlocked ? '#ccc' : '#666', 
                      margin: '0.5rem 0',
                      fontSize: '0.9rem'
                    }}>
                      {achievement.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{
                        background: getRarityColor(achievement.rarity),
                        color: 'white',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {achievement.rarity}
                      </span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#FF9800', fontSize: '1.2rem' }}>🏆</span>
                        <span style={{ 
                          color: achievement.unlocked ? '#4CAF50' : '#666',
                          fontWeight: 'bold'
                        }}>
                          {achievement.reward} $WEATHER
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '1rem',
        borderRadius: '10px',
        marginTop: '2rem'
      }}>
        <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
          Ranking System:
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', color: '#ccc', fontSize: '0.9rem' }}>
          <div>
            <strong>Level Rankings:</strong> Based on player experience points and quest completion
          </div>
          <div>
            <strong>Experience:</strong> Total XP earned from quests, voting, and achievements
          </div>
          <div>
            <strong>Quest Masters:</strong> Number of successful quest completions
          </div>
          <div>
            <strong>Achievements:</strong> Special milestones with $WEATHER rewards
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;