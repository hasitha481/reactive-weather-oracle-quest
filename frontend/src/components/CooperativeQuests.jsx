// FILE: frontend/src/components/CooperativeQuests.jsx
import React, { useState } from 'react';

const CooperativeQuests = ({ 
  coopQuests = [], 
  currentWeather = 'Sunshine',
  onJoinQuest,
  onCreateQuest,
  userLevel = 5 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuest, setNewQuest] = useState({
    name: '',
    description: '',
    requiredWeather: 'Sunshine',
    maxParticipants: 4,
    rewardPerPlayer: 100,
    duration: 1800 // 30 minutes
  });

  const weatherOptions = [
    { type: 'Storm', emoji: '⛈️', color: '#9C27B0' },
    { type: 'Sunshine', emoji: '☀️', color: '#FF9800' },
    { type: 'Fog', emoji: '🌫️', color: '#607D8B' },
    { type: 'Rain', emoji: '🌧️', color: '#2196F3' },
    { type: 'Snow', emoji: '❄️', color: '#00BCD4' }
  ];

  const getWeatherEmoji = (weather) => {
    return weatherOptions.find(w => w.type === weather)?.emoji || '🌤️';
  };

  const getWeatherColor = (weather) => {
    return weatherOptions.find(w => w.type === weather)?.color || '#4CAF50';
  };

  const handleCreateQuest = () => {
    if (newQuest.name && newQuest.description && onCreateQuest) {
      onCreateQuest(newQuest);
      setNewQuest({
        name: '',
        description: '',
        requiredWeather: 'Sunshine',
        maxParticipants: 4,
        rewardPerPlayer: 100,
        duration: 1800
      });
      setShowCreateForm(false);
    }
  };

  const handleJoinQuest = (questId) => {
    if (onJoinQuest) {
      onJoinQuest(questId);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const canJoinQuest = (quest) => {
    return quest.requiredWeather === currentWeather && 
           quest.currentParticipants < quest.maxParticipants && 
           !quest.completed;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '1.8rem' }}>👥 Cooperative Quests</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            background: '#4CAF50',
            border: 'none',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {showCreateForm ? 'Cancel' : 'Create Quest'}
        </button>
      </div>

      {/* Current Weather Indicator */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '1rem',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '2rem' }}>{getWeatherEmoji(currentWeather)}</span>
        <div>
          <h4 style={{ color: '#fff', margin: 0 }}>Current Weather: {currentWeather}</h4>
          <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
            Only quests matching current weather can be joined
          </p>
        </div>
      </div>

      {/* Create Quest Form */}
      {showCreateForm && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Create Cooperative Quest</h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                Quest Name
              </label>
              <input
                type="text"
                value={newQuest.name}
                onChange={(e) => setNewQuest({...newQuest, name: e.target.value})}
                placeholder="Enter quest name..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                Description
              </label>
              <textarea
                value={newQuest.description}
                onChange={(e) => setNewQuest({...newQuest, description: e.target.value})}
                placeholder="Describe what players need to do..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                  Required Weather
                </label>
                <select
                  value={newQuest.requiredWeather}
                  onChange={(e) => setNewQuest({...newQuest, requiredWeather: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                >
                  {weatherOptions.map(weather => (
                    <option key={weather.type} value={weather.type} style={{ background: '#333' }}>
                      {weather.emoji} {weather.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                  Max Participants
                </label>
                <select
                  value={newQuest.maxParticipants}
                  onChange={(e) => setNewQuest({...newQuest, maxParticipants: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                >
                  <option value={2} style={{ background: '#333' }}>2 Players</option>
                  <option value={3} style={{ background: '#333' }}>3 Players</option>
                  <option value={4} style={{ background: '#333' }}>4 Players</option>
                  <option value={5} style={{ background: '#333' }}>5 Players</option>
                  <option value={8} style={{ background: '#333' }}>8 Players</option>
                  <option value={10} style={{ background: '#333' }}>10 Players</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                  Reward per Player ($WEATHER)
                </label>
                <input
                  type="number"
                  value={newQuest.rewardPerPlayer}
                  onChange={(e) => setNewQuest({...newQuest, rewardPerPlayer: parseInt(e.target.value)})}
                  min="50"
                  max="1000"
                  step="50"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                  Duration
                </label>
                <select
                  value={newQuest.duration}
                  onChange={(e) => setNewQuest({...newQuest, duration: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                >
                  <option value={900} style={{ background: '#333' }}>15 minutes</option>
                  <option value={1800} style={{ background: '#333' }}>30 minutes</option>
                  <option value={3600} style={{ background: '#333' }}>1 hour</option>
                  <option value={7200} style={{ background: '#333' }}>2 hours</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={handleCreateQuest}
              disabled={!newQuest.name || !newQuest.description}
              style={{
                background: (newQuest.name && newQuest.description) ? '#4CAF50' : '#666',
                border: 'none',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '10px',
                cursor: (newQuest.name && newQuest.description) ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                fontWeight: 'bold',
                flex: 1
              }}
            >
              Create Quest
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              style={{
                background: 'transparent',
                border: '1px solid #666',
                color: '#ccc',
                padding: '1rem 2rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Quests */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {coopQuests.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            color: '#ccc'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>No Cooperative Quests Available</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Be the first to create a cooperative quest for the community!
            </p>
            <p style={{ color: '#4CAF50' }}>
              Click "Create Quest" to start a new multiplayer adventure.
            </p>
          </div>
        ) : (
          coopQuests.map((quest, index) => (
            <div key={index} style={{
              background: canJoinQuest(quest) 
                ? 'rgba(76, 175, 80, 0.1)' 
                : quest.completed 
                  ? 'rgba(96, 125, 139, 0.1)' 
                  : 'rgba(255,255,255,0.05)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: canJoinQuest(quest) 
                ? '2px solid #4CAF50' 
                : '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '2rem',
                      filter: quest.requiredWeather === currentWeather ? 'none' : 'grayscale(100%)'
                    }}>
                      {getWeatherEmoji(quest.requiredWeather)}
                    </span>
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '1.3rem' }}>
                      {quest.name}
                    </h4>
                    {quest.completed && (
                      <span style={{
                        background: '#4CAF50',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        Completed
                      </span>
                    )}
                  </div>
                  
                  <p style={{ color: '#ccc', margin: '0.5rem 0 1rem 0', fontSize: '1rem' }}>
                    {quest.description}
                  </p>

                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#4CAF50' }}>👥</span>
                      <span style={{ color: '#ccc' }}>
                        {quest.currentParticipants}/{quest.maxParticipants} players
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#FF9800' }}>🏆</span>
                      <span style={{ color: '#ccc' }}>
                        {quest.rewardPerPlayer} $WEATHER each
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#2196F3' }}>⏱️</span>
                      <span style={{ color: '#ccc' }}>
                        {formatDuration(quest.duration)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        color: getWeatherColor(quest.requiredWeather),
                        filter: quest.requiredWeather === currentWeather ? 'none' : 'grayscale(100%)'
                      }}>
                        {getWeatherEmoji(quest.requiredWeather)}
                      </span>
                      <span style={{ 
                        color: quest.requiredWeather === currentWeather ? '#4CAF50' : '#ff4444'
                      }}>
                        {quest.requiredWeather}
                        {quest.requiredWeather === currentWeather ? ' (Active)' : ' (Waiting)'}
                      </span>
                    </div>
                  </div>

                  {/* Participant Progress Bar */}
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.1)',
                      height: '8px',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        background: quest.completed ? '#4CAF50' : '#2196F3',
                        height: '100%',
                        width: `${(quest.currentParticipants / quest.maxParticipants) * 100}%`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                </div>

                {/* Join Button */}
                <div style={{ marginLeft: '1rem' }}>
                  {canJoinQuest(quest) ? (
                    <button
                      onClick={() => handleJoinQuest(quest.questId)}
                      style={{
                        background: '#4CAF50',
                        border: 'none',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        minWidth: '120px'
                      }}
                    >
                      Join Quest
                    </button>
                  ) : quest.completed ? (
                    <div style={{
                      background: '#607D8B',
                      padding: '1rem 2rem',
                      borderRadius: '10px',
                      color: 'white',
                      textAlign: 'center',
                      minWidth: '120px'
                    }}>
                      Completed
                    </div>
                  ) : quest.currentParticipants >= quest.maxParticipants ? (
                    <div style={{
                      background: '#FF9800',
                      padding: '1rem 2rem',
                      borderRadius: '10px',
                      color: 'white',
                      textAlign: 'center',
                      minWidth: '120px'
                    }}>
                      Full
                    </div>
                  ) : (
                    <div style={{
                      background: '#666',
                      padding: '1rem 2rem',
                      borderRadius: '10px',
                      color: '#ccc',
                      textAlign: 'center',
                      minWidth: '120px',
                      fontSize: '0.9rem'
                    }}>
                      Wrong Weather
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '1rem',
        borderRadius: '10px',
        marginTop: '1.5rem'
      }}>
        <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
          How Cooperative Quests Work:
        </h4>
        <ul style={{ color: '#ccc', fontSize: '0.9rem', margin: 0, paddingLeft: '1.5rem' }}>
          <li>Create quests that require specific weather conditions</li>
          <li>Players can only join when the required weather is active</li>
          <li>Quests auto-complete when max participants join</li>
          <li>All participants receive equal rewards upon completion</li>
          <li>Great way to earn $WEATHER tokens and make friends!</li>
        </ul>
      </div>
    </div>
  );
};

export default CooperativeQuests;