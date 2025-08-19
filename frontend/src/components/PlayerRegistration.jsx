// FILE: frontend/src/components/PlayerRegistration.jsx
import React, { useState } from 'react';

const PlayerRegistration = ({ 
  isRegistered = false, 
  onRegister,
  playerData = null,
  isLoading = false 
}) => {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (username.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscore');
      return;
    }

    setError('');
    setIsRegistering(true);

    try {
      if (onRegister) {
        await onRegister(username);
      }
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (error) setError('');
  };

  // If player is already registered, show player dashboard
  if (isRegistered && playerData) {
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
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.8rem' }}>👋 Welcome Back!</h2>
          <div style={{
            background: '#4CAF50',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            ✅ Registered Player
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '1.5rem',
          borderRadius: '15px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #4CAF50, #2196F3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {playerData.username ? playerData.username[0].toUpperCase() : 'P'}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '1.8rem' }}>
                {playerData.username || 'Player'}
              </h3>
              <p style={{ color: '#ccc', margin: '0.5rem 0', fontSize: '1rem' }}>
                Level {playerData.level || 1} Weather Oracle
              </p>
              <div style={{ display: 'flex', gap: '1rem', color: '#ccc', fontSize: '0.9rem' }}>
                <span>Member since: {new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span>Last active: Just now</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#4CAF50', fontWeight: 'bold' }}>
                {playerData.level || 5}
              </div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Current Level</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#2196F3', fontWeight: 'bold' }}>
                {playerData.experience || 1250}
              </div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Total Experience</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#FF9800', fontWeight: 'bold' }}>
                {playerData.questsCompleted || 12}
              </div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Quests Completed</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#9C27B0', fontWeight: 'bold' }}>
                {playerData.weatherTokens || 450}
              </div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>$WEATHER Tokens</div>
            </div>
          </div>

          {/* Progress to next level */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: '#ccc', fontSize: '0.9rem' }}>Progress to Level {(playerData.level || 5) + 1}</span>
              <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
                {playerData.experience || 1250} / {((playerData.level || 5) + 1) * 300} XP
              </span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              height: '10px',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #4CAF50, #2196F3)',
                height: '100%',
                width: `${Math.min(((playerData.experience || 1250) % 300) / 300 * 100, 100)}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #4CAF50',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ color: '#4CAF50', fontWeight: 'bold', marginBottom: '0.3rem' }}>Ready for Quests</div>
            <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Complete weather-based challenges</div>
          </div>

          <div style={{
            background: 'rgba(33, 150, 243, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #2196F3',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🗳️</div>
            <div style={{ color: '#2196F3', fontWeight: 'bold', marginBottom: '0.3rem' }}>Community Voting</div>
            <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Influence weather changes</div>
          </div>

          <div style={{
            background: 'rgba(255, 152, 0, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #FF9800',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ color: '#FF9800', fontWeight: 'bold', marginBottom: '0.3rem' }}>Cooperative Play</div>
            <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Team up with other players</div>
          </div>
        </div>
      </div>
    );
  }

  // Registration form for new players
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      width: '100%'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌟</div>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '2rem', marginBottom: '0.5rem' }}>
          Join the Weather Oracle Quest
        </h2>
        <p style={{ color: '#ccc', fontSize: '1.1rem', margin: 0 }}>
          Register to start your adventure in the world's first weather-reactive blockchain game
        </p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '2rem',
        borderRadius: '15px',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            color: '#ccc',
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}>
            Choose Your Username
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username..."
            maxLength="20"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: error ? '2px solid #ff4444' : '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '1.1rem',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2196F3';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? '#ff4444' : 'rgba(255,255,255,0.2)';
            }}
          />
          {error && (
            <div style={{
              color: '#ff4444',
              fontSize: '0.9rem',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem', color: '#ccc', fontSize: '0.9rem' }}>
          <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Username Requirements:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>3-20 characters long</li>
            <li>Letters, numbers, and underscore only</li>
            <li>Must be unique across all players</li>
          </ul>
        </div>

        <button
          onClick={handleRegister}
          disabled={!username.trim() || isRegistering || isLoading}
          style={{
            width: '100%',
            padding: '1.2rem',
            borderRadius: '10px',
            border: 'none',
            background: (!username.trim() || isRegistering || isLoading) 
              ? '#666' 
              : 'linear-gradient(45deg, #4CAF50, #2196F3)',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: (!username.trim() || isRegistering || isLoading) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {isRegistering || isLoading ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Registering...
            </>
          ) : (
            <>
              <span>🚀</span>
              Start My Adventure
            </>
          )}
        </button>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>

      {/* Benefits Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          padding: '1.5rem',
          borderRadius: '15px',
          border: '1px solid #4CAF50',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛈️</div>
          <h4 style={{ color: '#4CAF50', margin: '0 0 0.5rem 0' }}>Weather-Reactive Gameplay</h4>
          <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
            Experience quests that change based on real-time weather conditions
          </p>
        </div>

        <div style={{
          background: 'rgba(33, 150, 243, 0.1)',
          padding: '1.5rem',
          borderRadius: '15px',
          border: '1px solid #2196F3',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <h4 style={{ color: '#2196F3', margin: '0 0 0.5rem 0' }}>Earn Real Rewards</h4>
          <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
            Collect $WEATHER tokens and evolving NFTs as you complete quests
          </p>
        </div>

        <div style={{
          background: 'rgba(156, 39, 176, 0.1)',
          padding: '1.5rem',
          borderRadius: '15px',
          border: '1px solid #9C27B0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h4 style={{ color: '#9C27B0', margin: '0 0 0.5rem 0' }}>Community Features</h4>
          <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
            Vote on weather changes and team up for cooperative quests
          </p>
        </div>
      </div>

      {/* Technical Info */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '1rem',
        borderRadius: '10px',
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
          ⚡ Powered by Somnia Network
        </h4>
        <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
          Sub-second finality • 400K+ TPS • Gas-optimized smart contracts
        </p>
      </div>
    </div>
  );
};

export default PlayerRegistration;