// FILE: frontend/src/components/WeatherVoting.jsx
import React, { useState, useEffect } from 'react';

const WeatherVoting = ({ 
  currentVote, 
  onCreateVote, 
  onVoteForWeather,
  onExecuteVote,
  userLevel = 5,
  hasVoted = false 
}) => {
  const [selectedWeather, setSelectedWeather] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const weatherOptions = [
    { type: 'Storm', emoji: '⛈️', description: 'High-risk, high-reward quests' },
    { type: 'Sunshine', emoji: '☀️', description: 'Standard exploration quests' },
    { type: 'Fog', emoji: '🌫️', description: 'Stealth and mystery quests' },
    { type: 'Rain', emoji: '🌧️', description: 'Resource gathering bonuses' },
    { type: 'Snow', emoji: '❄️', description: 'Survival challenge quests' }
  ];

  // Timer for current vote
  useEffect(() => {
    if (currentVote && currentVote.endTime) {
      const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = currentVote.endTime - now;
        setTimeRemaining(Math.max(0, remaining));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentVote]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateVote = () => {
    if (selectedWeather && onCreateVote) {
      onCreateVote(selectedWeather);
      setShowCreateForm(false);
      setSelectedWeather('');
    }
  };

  const handleVote = () => {
    if (currentVote && onVoteForWeather) {
      onVoteForWeather(currentVote.voteId);
    }
  };

  const handleExecute = () => {
    if (currentVote && onExecuteVote) {
      onExecuteVote(currentVote.voteId);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '1.8rem' }}>🗳️ Community Weather Voting</h2>
        {userLevel >= 3 && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              background: '#2196F3',
              border: 'none',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {showCreateForm ? 'Cancel' : 'Create Vote'}
          </button>
        )}
      </div>

      {/* Current Active Vote */}
      {currentVote && !currentVote.executed && timeRemaining > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '1.5rem',
          border: '2px solid #4CAF50'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '3rem' }}>
                {weatherOptions.find(w => w.type === currentVote.proposedWeather)?.emoji || '🌤️'}
              </span>
              <div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
                  Vote for {currentVote.proposedWeather}
                </h3>
                <p style={{ color: '#ccc', margin: '0.5rem 0', fontSize: '1rem' }}>
                  {weatherOptions.find(w => w.type === currentVote.proposedWeather)?.description}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '1.5rem', 
                color: timeRemaining < 300 ? '#ff4444' : '#4CAF50',
                fontWeight: 'bold'
              }}>
                {formatTime(timeRemaining)}
              </div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>remaining</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#ccc', fontSize: '1rem' }}>
                Votes: {currentVote.voteCount || 0}
              </span>
              <div style={{
                background: '#4CAF50',
                height: '8px',
                borderRadius: '4px',
                width: `${Math.min((currentVote.voteCount || 0) * 10, 100)}px`,
                minWidth: '20px'
              }}></div>
            </div>

            {!hasVoted && timeRemaining > 0 && (
              <button
                onClick={handleVote}
                style={{
                  background: '#4CAF50',
                  border: 'none',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                Vote Now
              </button>
            )}

            {hasVoted && (
              <div style={{
                background: '#2196F3',
                padding: '1rem 2rem',
                borderRadius: '10px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                ✅ Voted
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vote Execution */}
      {currentVote && !currentVote.executed && timeRemaining === 0 && currentVote.voteCount >= 10 && (
        <div style={{
          background: 'rgba(255,165,0,0.2)',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '1.5rem',
          border: '2px solid #FF9800',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#FF9800', margin: '0 0 1rem 0' }}>Vote Ready for Execution!</h3>
          <p style={{ color: '#ccc', marginBottom: '1rem' }}>
            Voting period ended. Anyone can execute this vote to change the weather.
          </p>
          <button
            onClick={handleExecute}
            style={{
              background: '#FF9800',
              border: 'none',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Execute Vote
          </button>
        </div>
      )}

      {/* Create New Vote Form */}
      {showCreateForm && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Create Weather Vote</h3>
          <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Choose the weather type you want the community to vote on. Requires level 3+.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            {weatherOptions.map((weather) => (
              <div
                key={weather.type}
                onClick={() => setSelectedWeather(weather.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: selectedWeather === weather.type 
                    ? 'rgba(33, 150, 243, 0.3)' 
                    : 'rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: selectedWeather === weather.type 
                    ? '2px solid #2196F3' 
                    : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '2rem' }}>{weather.emoji}</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>
                    {weather.type}
                  </h4>
                  <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
                    {weather.description}
                  </p>
                </div>
                {selectedWeather === weather.type && (
                  <div style={{
                    background: '#2196F3',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.8rem'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleCreateVote}
              disabled={!selectedWeather}
              style={{
                background: selectedWeather ? '#4CAF50' : '#666',
                border: 'none',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '10px',
                cursor: selectedWeather ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                fontWeight: 'bold',
                flex: 1
              }}
            >
              Create Vote (30 min duration)
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setSelectedWeather('');
              }}
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

      {/* No Active Vote */}
      {(!currentVote || currentVote.executed || timeRemaining === 0) && !showCreateForm && (
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          color: '#ccc'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗳️</div>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>No Active Weather Vote</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Community members can create votes to change the weather democratically.
          </p>
          {userLevel >= 3 ? (
            <p style={{ color: '#4CAF50' }}>
              You can create a new weather vote! Click "Create Vote" above.
            </p>
          ) : (
            <p style={{ color: '#FF9800' }}>
              Reach level 3 to create weather votes. Current level: {userLevel}
            </p>
          )}
        </div>
      )}

      {/* Voting Info */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '1rem',
        borderRadius: '10px',
        marginTop: '1rem'
      }}>
        <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
          How Weather Voting Works:
        </h4>
        <ul style={{ color: '#ccc', fontSize: '0.9rem', margin: 0, paddingLeft: '1.5rem' }}>
          <li>Level 3+ players can create weather votes (30 min duration)</li>
          <li>Voting power = Player Level + (NFTs owned × 2)</li>
          <li>Minimum 10 votes required to execute weather change</li>
          <li>Anyone can execute a successful vote after time expires</li>
        </ul>
      </div>
    </div>
  );
};

export default WeatherVoting;