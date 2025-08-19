// FILE: frontend/src/components/QuestBoard.jsx
// Weather-reactive quest system with individual loading states

import React from 'react';
import { Play, CheckCircle, Sun, Cloud, CloudRain, Snowflake, CloudDrizzle } from 'lucide-react';

const QuestBoard = ({ 
  currentWeather, 
  useBlockchain, 
  onCompleteQuest, 
  completingQuestId,  // Changed from isCompleting to track specific quest
  completedQuests, 
  isQuestCompleted 
}) => {
  // Weather-based quest data
  const questData = {
    Sunshine: [
      {
        id: 'sun_1',
        icon: Sun,
        title: 'Solar Collector',
        description: 'Gather solar energy using reflectors during sunshine',
        difficulty: 'EASY',
        reward: '15 $WEATHER',
        xp: '50 XP',
        duration: '2 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00008 STT'
      },
      {
        id: 'sun_2',
        icon: Sun,
        title: 'Bright Exploration',
        description: 'Discover 5 sunny locations and verify with weather oracle',
        difficulty: 'MEDIUM',
        reward: '25 $WEATHER',
        xp: '100 XP',
        duration: '8 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00012 STT'
      }
    ],
    Storm: [
      {
        id: 'storm_1',
        icon: Cloud,
        title: 'Lightning Rod Challenge',
        description: 'Place conductors strategically and avoid lightning strikes',
        difficulty: 'HARD',
        reward: '50 $WEATHER',
        xp: '200 XP',
        duration: '5 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00015 STT'
      },
      {
        id: 'storm_2',
        icon: Cloud,
        title: 'Storm Chaser',
        description: 'Follow storm patterns and collect atmospheric data',
        difficulty: 'EXTREME',
        reward: '75 $WEATHER',
        xp: '350 XP',
        duration: '12 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00020 STT'
      }
    ],
    Rain: [
      {
        id: 'rain_1',
        icon: CloudRain,
        title: 'Rainwater Collector',
        description: 'Set up collection systems during rainy weather',
        difficulty: 'EASY',
        reward: '20 $WEATHER',
        xp: '75 XP',
        duration: '4 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00010 STT'
      },
      {
        id: 'rain_2',
        icon: CloudRain,
        title: 'Puddle Jumper',
        description: 'Navigate through flooded areas and rescue supplies',
        difficulty: 'MEDIUM',
        reward: '30 $WEATHER',
        xp: '120 XP',
        duration: '6 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00012 STT'
      }
    ],
    Snow: [
      {
        id: 'snow_1',
        icon: Snowflake,
        title: 'Ice Sculptor',
        description: 'Create structures from snow and ice formations',
        difficulty: 'MEDIUM',
        reward: '35 $WEATHER',
        xp: '150 XP',
        duration: '7 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00013 STT'
      },
      {
        id: 'snow_2',
        icon: Snowflake,
        title: 'Avalanche Survivor',
        description: 'Navigate dangerous snowy terrain and reach safety',
        difficulty: 'HARD',
        reward: '60 $WEATHER',
        xp: '250 XP',
        duration: '10 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00018 STT'
      }
    ],
    Fog: [
      {
        id: 'fog_1',
        icon: CloudDrizzle,
        title: 'Mist Walker',
        description: 'Move through dense fog using only sound navigation',
        difficulty: 'MEDIUM',
        reward: '30 $WEATHER',
        xp: '130 XP',
        duration: '5 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00012 STT'
      },
      {
        id: 'fog_2',
        icon: CloudDrizzle,
        title: 'Hidden Treasure Hunt',
        description: 'Find valuable items concealed by thick fog',
        difficulty: 'HARD',
        reward: '45 $WEATHER',
        xp: '200 XP',
        duration: '8 min',
        gasRange: '8-12 gwei',
        gasCost: '0.00016 STT'
      }
    ]
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-400 bg-green-400/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/20';
      case 'HARD': return 'text-orange-400 bg-orange-400/20';
      case 'EXTREME': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Get current weather quests
  const currentQuests = questData[currentWeather] || questData.Sunshine;
  const availableQuestsCount = currentQuests.filter(quest => !isQuestCompleted(quest.id)).length;

  // Individual quest button component
  const QuestButton = ({ quest }) => {
    const isCompleted = isQuestCompleted(quest.id);
    const isLoading = completingQuestId === quest.id;
    const isDisabled = isLoading || isCompleted;

    return (
      <button
        onClick={() => onCompleteQuest(quest.id)}
        disabled={isDisabled}
        className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
            : isLoading
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Completing...</span>
          </>
        ) : isCompleted ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Start Quest</span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <Sun className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Active Weather: {currentWeather}</h2>
              <p className="text-gray-300 text-sm">
                {availableQuestsCount} quest{availableQuestsCount !== 1 ? 's' : ''} available for current conditions
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">{currentQuests.length}</div>
            <div className="text-xs text-gray-300">Total Quests</div>
          </div>
        </div>

        {/* Weather Icon Display */}
        <div className="flex items-center justify-center py-4">
          {currentWeather === 'Sunshine' && <Sun className="w-16 h-16 text-yellow-400" />}
          {currentWeather === 'Storm' && <Cloud className="w-16 h-16 text-purple-400" />}
          {currentWeather === 'Rain' && <CloudRain className="w-16 h-16 text-blue-400" />}
          {currentWeather === 'Snow' && <Snowflake className="w-16 h-16 text-cyan-400" />}
          {currentWeather === 'Fog' && <CloudDrizzle className="w-16 h-16 text-gray-400" />}
        </div>
      </div>

      {/* Available Quests */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Play className="w-5 h-5 text-purple-400" />
          <span>Available Quests</span>
        </h3>

        {currentQuests.map((quest) => {
          const IconComponent = quest.icon;
          const isCompleted = isQuestCompleted(quest.id);
          const isLoading = completingQuestId === quest.id;

          return (
            <div
              key={quest.id}
              className={`glass-effect rounded-xl p-6 transition-all duration-200 ${
                isCompleted ? 'bg-green-500/10 border border-green-500/30' : 
                isLoading ? 'bg-purple-500/10 border border-purple-500/30' :
                'hover:bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isCompleted ? 'bg-green-500/20' : 
                    isLoading ? 'bg-purple-500/20' : 'bg-blue-500/20'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      isCompleted ? 'text-green-400' : 
                      isLoading ? 'text-purple-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{quest.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(quest.difficulty)}`}>
                      {quest.difficulty}
                    </span>
                  </div>
                </div>
                {isCompleted && (
                  <div className="flex items-center space-x-1 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Complete</span>
                  </div>
                )}
                {isLoading && (
                  <div className="flex items-center space-x-1 text-purple-400">
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Processing...</span>
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-sm mb-4">{quest.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">{quest.reward}</div>
                  <div className="text-xs text-gray-300">Reward</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{quest.xp}</div>
                  <div className="text-xs text-gray-300">Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">{quest.duration}</div>
                  <div className="text-xs text-gray-300">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{quest.gasCost}</div>
                  <div className="text-xs text-gray-300">Transaction Cost</div>
                </div>
              </div>

              {/* Gas Optimization Info */}
              <div className="bg-black/20 rounded-lg p-3 mb-4">
                <h5 className="text-sm font-medium text-yellow-400 mb-1">⚡ Gas Optimization</h5>
                <p className="text-xs text-gray-300">
                  Gas Range: {quest.gasRange} • Optimized cost: {quest.gasCost}
                </p>
              </div>

              {/* Quest Action Button */}
              <QuestButton quest={quest} />
            </div>
          );
        })}
      </div>

      {/* Quest Progress */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quest Progress</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{availableQuestsCount}</div>
            <div className="text-sm text-gray-300">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {completedQuests.filter(questId => currentQuests.some(quest => quest.id === questId)).length}
            </div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">0</div>
            <div className="text-sm text-gray-300">Total XP</div>
          </div>
        </div>
      </div>

      {/* All Completed Message */}
      {availableQuestsCount === 0 && (
        <div className="glass-effect rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">All Quests Completed!</h3>
          <p className="text-gray-300 text-sm mb-4">
            You've completed all available quests for {currentWeather} conditions.
          </p>
          <p className="text-blue-400 text-sm">
            Change weather conditions or wait for new quests to unlock!
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestBoard;