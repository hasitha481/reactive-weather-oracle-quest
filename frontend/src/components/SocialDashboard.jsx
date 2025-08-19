// FILE: frontend/src/components/SocialDashboard.jsx
import React, { useState } from 'react';
import WeatherVoting from './WeatherVoting';
import CooperativeQuests from './CooperativeQuests';
import Leaderboards from './Leaderboards';
import PlayerRegistration from './PlayerRegistration';

const SocialDashboard = ({
  // Player data
  isRegistered = false,
  playerData = null,
  userAddress = '',
  
  // Weather voting
  currentVote = null,
  onCreateVote,
  onVoteForWeather,
  onExecuteVote,
  hasVoted = false,
  
  // Cooperative quests
  coopQuests = [],
  onJoinQuest,
  onCreateQuest,
  currentWeather = 'Sunshine',
  
  // Leaderboards
  levelLeaderboard = [],
  experienceLeaderboard = [],
  questLeaderboard = [],
  achievements = [],
  userAchievements = [],
  
  // Registration
  onRegister,
  isLoading = false
}) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', name: 'Overview', icon: '🏠', color: '#4CAF50' },
    { id: 'voting', name: 'Weather Voting', icon: '🗳️', color: '#2196F3' },
    { id: 'coop', name: 'Cooperative Quests', icon: '👥', color: '#FF9800' },
    { id: 'leaderboards', name: 'Leaderboards', icon: '🏆', color: '#9C27B0' }
  ];

  // Mock data for demo purposes
  const mockCurrentVote = currentVote || {
    voteId: 1,
    proposedWeather: 'Storm',
    voteCount: 15,
    endTime: Math.floor(Date.now() / 1000) + 1200, // 20 minutes from now
    executed: false
  };

  const mockCoopQuests = coopQuests.length > 0 ? coopQuests : [
    {
      questId: 1,
      name: 'Lightning Rod Challenge',
      description: 'Work together to place lightning rods during the storm',
      requiredWeather: 'Storm',
      maxParticipants: 4,
      currentParticipants: 2,
      rewardPerPlayer: 200,
      duration: 1800,
      completed: false
    },
    {
      questId: 2,
      name: 'Solar Energy Harvest',
      description: 'Gather solar energy while the sun shines bright',
      requiredWeather: 'Sunshine',
      maxParticipants: 6,
      currentParticipants: 6,
      rewardPerPlayer: 150,
      duration: 3600,
      completed: true
    },
    {
      questId: 3,
      name: 'Fog Navigation Team',
      description: 'Navigate through mysterious fog to find hidden treasures',
      requiredWeather: 'Fog',
      maxParticipants: 3,
      currentParticipants: 1,
      rewardPerPlayer: 250,
      duration: 2400,
      completed: false
    }
  ];

  const getOnlinePlayers = () => {
    return Math.floor(Math.random() * 50) + 20; // Mock 20-70 online players
  };

  const getActiveQuests = () => {
    return mockCoopQuests.filter(q => !q.completed).length;
  };

  const getActiveVotes = () => {
    return mockCurrentVote && !mockCurrentVote.executed ? 1 : 0;
  };

  // If not registered, show registration
  if (!isRegistered) {
    return (
      <PlayerRegistration
        isRegistered={isRegistered}
        onRegister={onRegister}
        playerData={playerData}
        isLoading={isLoading}
      />
    );
  }

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
        🌐 Social Features & Community
      </h2>

      {/* Section Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              background: activeSection === section.id ? section.color : 'rgba(255,255,255,0.1)',
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
            <span>{section.icon}</span>
            {section.name}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Community Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: 'rgba(76, 175, 80, 0.1)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid #4CAF50',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
              <div style={{ fontSize: '2rem', color: '#4CAF50', fontWeight: 'bold' }}>
                {getOnlinePlayers()}
              </div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Players Online</div>
            </div>

            <div style={{
              background: 'rgba(33, 150, 243, 0.1)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid #2196F3',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗳️</div>
              <div style={{ fontSize: '2rem', color: '#2196F3', fontWeight: 'bold' }}>
                {getActiveVotes()}
              </div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Active Votes</div>
            </div>

            <div style={{
              background: 'rgba(255, 152, 0, 0.1)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid #FF9800',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
              <div style={{ fontSize: '2rem', color: '#FF9800', fontWeight: 'bold' }}>
                {getActiveQuests()}
              </div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Open Quests</div>
            </div>

            <div style={{
              background: 'rgba(156, 39, 176, 0.1)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid #9C27B0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ fontSize: '2rem', color: '#9C27B0', fontWeight: 'bold' }}>
                400K+
              </div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>TPS Network</div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '1.5rem',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.3rem' }}>
              📢 Recent Community Activity
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                background: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🌩️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: '0.9rem' }}>
                    Weather changed to <strong>Storm</strong> by community vote
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.8rem' }}>2 minutes ago</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                background: 'rgba(33, 150, 243, 0.1)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>👥</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: '0.9rem' }}>
                    <strong>StormMaster</strong> completed "Lightning Rod Challenge"
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.8rem' }}>5 minutes ago</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                background: 'rgba(255, 152, 0, 0.1)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🏆</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: '0.9rem' }}>
                    <strong>SunSeeker</strong> unlocked "Weather Master" achievement
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.8rem' }}>8 minutes ago</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                background: 'rgba(156, 39, 176, 0.1)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🗳️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: '0.9rem' }}>
                    New weather vote created: Change to <strong>Rain</strong>
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.8rem' }}>12 minutes ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <button
              onClick={() => setActiveSection('voting')}
              style={{
                background: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid #2196F3',
                borderRadius: '15px',
                padding: '1.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗳️</div>
              <h4 style={{ color: '#2196F3', margin: '0 0 0.5rem 0' }}>Vote on Weather</h4>
              <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
                Influence the game world by voting on weather changes
              </p>
            </button>

            <button
              onClick={() => setActiveSection('coop')}
              style={{
                background: 'rgba(255, 152, 0, 0.1)',
                border: '1px solid #FF9800',
                borderRadius: '15px',
                padding: '1.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
              <h4 style={{ color: '#FF9800', margin: '0 0 0.5rem 0' }}>Join Quests</h4>
              <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
                Team up with other players for cooperative adventures
              </p>
            </button>

            <button
              onClick={() => setActiveSection('leaderboards')}
              style={{
                background: 'rgba(156, 39, 176, 0.1)',
                border: '1px solid #9C27B0',
                borderRadius: '15px',
                padding: '1.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              <h4 style={{ color: '#9C27B0', margin: '0 0 0.5rem 0' }}>View Rankings</h4>
              <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
                See how you rank among the community leaders
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Weather Voting Section */}
      {activeSection === 'voting' && (
        <WeatherVoting
          currentVote={mockCurrentVote}
          onCreateVote={onCreateVote}
          onVoteForWeather={onVoteForWeather}
          onExecuteVote={onExecuteVote}
          userLevel={playerData?.level || 5}
          hasVoted={hasVoted}
        />
      )}

      {/* Cooperative Quests Section */}
      {activeSection === 'coop' && (
        <CooperativeQuests
          coopQuests={mockCoopQuests}
          currentWeather={currentWeather}
          onJoinQuest={onJoinQuest}
          onCreateQuest={onCreateQuest}
          userLevel={playerData?.level || 5}
        />
      )}

      {/* Leaderboards Section */}
      {activeSection === 'leaderboards' && (
        <Leaderboards
          levelLeaderboard={levelLeaderboard}
          experienceLeaderboard={experienceLeaderboard}
          questLeaderboard={questLeaderboard}
          achievements={achievements}
          userAddress={userAddress}
          userAchievements={userAchievements}
        />
      )}
    </div>
  );
};

export default SocialDashboard;