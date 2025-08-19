import React, { useState, useEffect } from 'react';
import { Package, Star, Zap, Eye, Trash2, Info } from 'lucide-react';

const MockNFTInventory = ({ account, currentWeather }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredNFT, setHoveredNFT] = useState(null);

  const NFT_CATEGORIES = {
    0: { 
      name: 'Storm Gear', 
      icon: '⚡', 
      bgColor: 'from-yellow-500 via-yellow-400 to-yellow-600',
      desc: 'Lightning resistant equipment',
      borderColor: 'border-yellow-400/50',
      shadowColor: 'shadow-yellow-500/30'
    },
    1: { 
      name: 'Weather Collectible', 
      icon: '🌟', 
      bgColor: 'from-blue-500 via-blue-400 to-blue-600',
      desc: 'Magical weather items',
      borderColor: 'border-blue-400/50',
      shadowColor: 'shadow-blue-500/30'
    },
    2: { 
      name: 'Ancient Artifact', 
      icon: '🏺', 
      bgColor: 'from-purple-500 via-purple-400 to-purple-600',
      desc: 'Mystical ancient relics',
      borderColor: 'border-purple-400/50',
      shadowColor: 'shadow-purple-500/30'
    },
    3: { 
      name: 'Elemental Weapon', 
      icon: '⚔️', 
      bgColor: 'from-red-500 via-red-400 to-red-600',
      desc: 'Weather-powered weapons',
      borderColor: 'border-red-400/50',
      shadowColor: 'shadow-red-500/30'
    },
    4: { 
      name: 'Weather Tool', 
      icon: '🔧', 
      bgColor: 'from-green-500 via-green-400 to-green-600',
      desc: 'Climate control devices',
      borderColor: 'border-green-400/50',
      shadowColor: 'shadow-green-500/30'
    }
  };

  const RARITIES = {
    0: { name: 'Common', color: 'text-gray-200', glow: 'shadow-gray-400/40', bgGlow: 'bg-gray-400/20', border: 'border-gray-400' },
    1: { name: 'Rare', color: 'text-blue-200', glow: 'shadow-blue-400/50', bgGlow: 'bg-blue-400/30', border: 'border-blue-400' },
    2: { name: 'Epic', color: 'text-purple-200', glow: 'shadow-purple-400/50', bgGlow: 'bg-purple-400/30', border: 'border-purple-400' },
    3: { name: 'Legendary', color: 'text-yellow-200', glow: 'shadow-yellow-400/50', bgGlow: 'bg-yellow-400/30', border: 'border-yellow-400' },
    4: { name: 'Mythic', color: 'text-red-200', glow: 'shadow-red-400/50', bgGlow: 'bg-red-400/30', border: 'border-red-400' }
  };

  useEffect(() => {
    if (account) {
      const savedNFTs = localStorage.getItem(`weather_nfts_${account}`);
      if (savedNFTs) {
        setNfts(JSON.parse(savedNFTs));
      }
    }
  }, [account]);

  const saveNFTs = (newNFTs) => {
    setNfts(newNFTs);
    if (account) {
      localStorage.setItem(`weather_nfts_${account}`, JSON.stringify(newNFTs));
    }
  };

  const mintNFT = (category) => {
    setLoading(true);
    
    setTimeout(() => {
      const newNFT = {
        id: Date.now(),
        category,
        rarity: 0,
        powerLevel: 100 + Math.floor(Math.random() * 50),
        weatherExposure: 1,
        createdWeather: currentWeather?.weatherType || 0,
        lastUpdate: Date.now(),
        mintedAt: new Date().toLocaleString()
      };
      
      const updatedNFTs = [...nfts, newNFT];
      saveNFTs(updatedNFTs);
      setLoading(false);
      
      alert(`🎉 ${NFT_CATEGORIES[category].name} NFT Successfully Minted!\n\n⚡ Power Level: ${newNFT.powerLevel}\n🎭 Rarity: Common\n🌤️ Weather: ${currentWeather?.weatherType === 0 ? 'Clear' : currentWeather?.weatherType === 1 ? 'Rain' : currentWeather?.weatherType === 2 ? 'Storm' : currentWeather?.weatherType === 3 ? 'Snow' : 'Fog'}\n\n🔮 Ready to absorb weather energy!`);
    }, 1500);
  };

  const updateNFTWeather = (nftId) => {
    if (!currentWeather) {
      alert('⚠️ No weather data available!\n\n🌩️ Change weather first using controls above.');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const updatedNFTs = nfts.map(nft => {
        if (nft.id === nftId) {
          const weatherBonus = (currentWeather.weatherType + 1) * (currentWeather.intensity || 5);
          const newExposure = nft.weatherExposure + 1;
          const newPowerLevel = nft.powerLevel + weatherBonus;
          let newRarity = nft.rarity;
          
          if (newExposure >= 5 && newRarity === 0) newRarity = 1;
          if (newExposure >= 10 && newRarity === 1) newRarity = 2;
          if (newExposure >= 20 && newRarity === 2) newRarity = 3;
          if (newExposure >= 35 && newRarity === 3) newRarity = 4;
          
          const rarityUpgraded = newRarity > nft.rarity;
          
          if (rarityUpgraded) {
            setTimeout(() => {
              alert(`🌟✨ RARITY UPGRADE! ✨🌟\n\n🎭 ${RARITIES[nft.rarity].name} → ${RARITIES[newRarity].name}\n⚡ Power: ${newPowerLevel}\n🔥 NFT evolved!\n\n${newRarity >= 3 ? '👑 LEGENDARY+ NFT!' : '🎉 Congratulations!'}`);
            }, 500);
          }
          
          return {
            ...nft,
            powerLevel: newPowerLevel,
            weatherExposure: newExposure,
            rarity: newRarity,
            lastUpdate: Date.now()
          };
        }
        return nft;
      });
      
      saveNFTs(updatedNFTs);
      setLoading(false);
      
      const weatherNames = ['Clear', 'Rain', 'Storm', 'Snow', 'Fog'];
      alert(`⚡ NFT absorbed ${weatherNames[currentWeather.weatherType]}!\n\n🔋 Power: +${(currentWeather.weatherType + 1) * (currentWeather.intensity || 5)}\n🌩️ Intensity: ${currentWeather.intensity || 5}/10\n✨ Getting stronger!`);
    }, 1200);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden mb-6">
      
      {/* ENHANCED BEAUTIFUL HEADER SECTION */}
      <div className="relative p-8 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl blur opacity-30"></div>
              <div className="relative p-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-xl">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">
                Weather-Reactive NFT Collection
              </h2>
              <p className="text-gray-300 text-lg">Collectibles that evolve with weather conditions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
              <span className="text-cyan-300 font-bold text-lg">{nfts.length} NFTs</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 backdrop-blur-sm animate-pulse">
              <span className="text-green-300 font-bold">✨ Live Demo System</span>
            </div>
          </div>
        </div>
      </div>

      {/* ENHANCED CURRENT WEATHER DISPLAY */}
      {currentWeather && (
        <div className="p-6 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20 border-t border-gray-700/30">
          <div className="flex items-center justify-between p-6 bg-black/40 rounded-xl border border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur animate-pulse"></div>
                <div className="relative text-5xl animate-bounce">
                  {currentWeather.weatherType === 0 ? '☀️' : 
                   currentWeather.weatherType === 1 ? '🌧️' :
                   currentWeather.weatherType === 2 ? '⛈️' :
                   currentWeather.weatherType === 3 ? '❄️' : '🌫️'}
                </div>
              </div>
              <div>
                <span className="text-purple-300 text-sm font-medium uppercase tracking-wide">Current Weather</span>
                <div className="text-white font-bold text-2xl mt-1">
                  {currentWeather.weatherType === 0 ? 'Clear Skies' : 
                   currentWeather.weatherType === 1 ? 'Rainy Day' :
                   currentWeather.weatherType === 2 ? 'Thunderstorm' :
                   currentWeather.weatherType === 3 ? 'Snowfall' : 'Foggy Weather'}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="px-6 py-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30">
                <div className="text-yellow-300 text-sm font-medium uppercase tracking-wide">Intensity</div>
                <div className="text-yellow-400 font-bold text-3xl">{currentWeather.intensity || 5}/10</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENHANCED NFT MINT SECTION */}
      <div className="p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/60">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-4xl animate-pulse">⚡</span>
            <h3 className="text-2xl font-bold text-white">Mint Weather-Reactive NFT</h3>
            <Info className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-300">Choose your NFT category and mint unique collectibles</p>
        </div>
        
        {loading && (
          <div className="mb-8 text-center p-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-500/30 shadow-lg">
            <div className="text-yellow-300 text-xl mb-3 animate-pulse">⚡ Minting NFT...</div>
            <div className="text-yellow-200 text-sm mb-4">Blockchain transaction in progress...</div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full animate-pulse shadow-lg" style={{width: '70%'}}></div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.entries(NFT_CATEGORIES).map(([category, info]) => (
            <div
              key={category}
              onClick={() => mintNFT(parseInt(category))}
              onMouseEnter={() => setHoveredCategory(parseInt(category))}
              onMouseLeave={() => setHoveredCategory(null)}
              className="group relative cursor-pointer"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${info.bgColor} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300 scale-105`}></div>
              
              {/* Card */}
              <div className={`nft-mint-btn relative bg-gradient-to-br ${info.bgColor} rounded-2xl p-6 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 border-2 ${info.borderColor} group-hover:border-white/50 shadow-lg group-hover:shadow-xl ${info.shadowColor}`}>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                
                <div className="relative text-center text-white">
                  <div className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-300 filter drop-shadow-lg">
                    {info.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-2 drop-shadow-lg">{info.name}</h4>
                  <p className="text-sm text-white/90 mb-4 drop-shadow">{info.desc}</p>
                  <div className="px-4 py-2 bg-black/40 rounded-full border border-white/20 backdrop-blur-sm group-hover:bg-black/60 transition-all duration-300">
                    <span className="text-sm font-medium">
                      {hoveredCategory === parseInt(category) ? '🎯 Click to Mint!' : '⚡ Mint Now'}
                    </span>
                  </div>
                </div>
                
                {/* Pulse ring effect */}
                {hoveredCategory === parseInt(category) && (
                  <div className="absolute inset-0 border-2 border-white/60 rounded-2xl animate-ping"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center p-4 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700/30">
          <p className="text-gray-300">
            💡 Each NFT starts as <span className="text-yellow-400 font-bold">Common</span> rarity and evolves through weather exposure
          </p>
        </div>
      </div>

      {/* ENHANCED NFT COLLECTION */}
      {nfts.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700/50 m-8">
          <div className="text-9xl mb-8 animate-bounce filter drop-shadow-2xl">🎭</div>
          <h3 className="text-3xl font-bold text-white mb-4">Your NFT Collection Awaits</h3>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto text-lg">
            Click any category above to mint your first weather-reactive NFT and begin your journey!
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <span className="bg-gray-700/50 px-3 py-1 rounded-full">🌩️ Weather Effects</span>
            <span className="bg-gray-700/50 px-3 py-1 rounded-full">⚡ Power Growth</span>
            <span className="bg-gray-700/50 px-3 py-1 rounded-full">🌟 Rarity Evolution</span>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="flex items-center justify-between mb-8 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg">
            <h3 className="text-2xl font-bold text-white">Your Collection</h3>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
              Total Power: {nfts.reduce((sum, nft) => sum + nft.powerLevel, 0)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => {
              const category = NFT_CATEGORIES[nft.category];
              const rarity = RARITIES[nft.rarity];
              
              return (
                <div
                  key={nft.id}
                  onMouseEnter={() => setHoveredNFT(nft.id)}
                  onMouseLeave={() => setHoveredNFT(null)}
                  className={`nft-card bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border-2 transition-all duration-300 backdrop-blur-sm ${hoveredNFT === nft.id ? `border-cyan-400 ${rarity.glow}` : `${rarity.border} border-opacity-50`}`}
                >
                  {/* Animated background */}
                  <div className={`absolute inset-0 ${rarity.bgGlow} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-xl`}></div>
                  
                  {/* NFT Header with better contrast */}
                  <div className="relative z-10 flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                          {category?.icon}
                        </span>
                      </div>
                      <span className="text-white font-bold text-lg bg-black/30 px-2 py-1 rounded">#{nft.id.toString().slice(-4)}</span>
                    </div>
                    <div className={`${rarity.color} text-sm font-bold px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm border ${rarity.border} shadow-lg`}>
                      {rarity.name}
                    </div>
                  </div>

                  {/* Enhanced NFT Visual */}
                  <div className={`relative w-full h-40 bg-gradient-to-br ${category?.bgColor || 'from-gray-700 to-gray-800'} rounded-xl mb-5 flex items-center justify-center text-7xl overflow-hidden shadow-2xl border-2 border-white/20 group-hover:shadow-3xl transition-all duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-black/30"></div>
                    <span className="relative z-10 transform group-hover:scale-125 transition-transform duration-300 filter drop-shadow-2xl">
                      {category?.icon}
                    </span>
                    
                    {/* Enhanced rarity effects */}
                    {nft.rarity >= 2 && (
                      <div className="absolute top-3 right-3 text-yellow-300 animate-pulse text-2xl filter drop-shadow-lg">✨</div>
                    )}
                    {nft.rarity >= 4 && (
                      <div className="absolute bottom-3 left-3 text-red-300 animate-bounce text-2xl filter drop-shadow-lg">🔥</div>
                    )}
                    
                    {/* Mythic effects */}
                    {nft.rarity >= 3 && (
                      <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-6 left-6 text-yellow-200 animate-ping text-lg">⭐</div>
                        <div className="absolute bottom-6 right-6 text-yellow-200 animate-ping animation-delay-500 text-lg">⭐</div>
                      </div>
                    )}
                  </div>

                  {/* FIXED Stats Section with high contrast */}
                  <div className="relative z-10 space-y-4 mb-5 bg-black/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200 font-medium flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Power Level:
                      </span>
                      <span className="text-yellow-300 font-bold text-lg bg-yellow-900/30 px-3 py-1 rounded-lg">
                        {nft.powerLevel}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200 font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        Weather Exposure:
                      </span>
                      <span className="text-cyan-300 font-bold text-lg bg-cyan-900/30 px-3 py-1 rounded-lg">
                        {nft.weatherExposure}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-200 font-medium">Category:</span>
                      <span className="text-white font-bold bg-gray-700/50 px-3 py-1 rounded-lg">{category?.name}</span>
                    </div>
                    
                    {/* Enhanced Progress Bar */}
                    {nft.rarity < 4 && (
                      <div className="pt-2">
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                          <span>Next Rarity:</span>
                          <span className={`${RARITIES[nft.rarity + 1].color} font-bold`}>{RARITIES[nft.rarity + 1].name}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden shadow-inner">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 shadow-lg ${
                              nft.rarity === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                              nft.rarity === 1 ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                              nft.rarity === 2 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                            }`}
                            style={{
                              width: `${Math.min(100, (nft.weatherExposure / (
                                nft.rarity === 0 ? 5 :
                                nft.rarity === 1 ? 10 :
                                nft.rarity === 2 ? 20 : 35
                              )) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ENHANCED Action Button with perfect hover */}
                  <button
                    onClick={() => updateNFTWeather(nft.id)}
                    disabled={loading}
                    className="nft-absorb-btn relative z-10 w-full py-4 rounded-xl text-sm font-bold"
                  >
                    <span className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                      <Zap className="w-5 h-5 group-hover:animate-pulse" />
                      <span className="group-hover:text-white transition-colors">Absorb Current Weather</span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enhanced Info Section */}
      <div className="p-8 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 text-center shadow-2xl backdrop-blur-sm border-t border-gray-700/30">
        <p className="text-indigo-200 text-lg mb-4 font-medium">
          💡 <strong>Experience the Magic:</strong> Mint NFTs → Change Weather → Absorb Energy → Watch Evolution!
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-2xl mb-1">🎭</div>
            <div className="text-white font-bold">5 Categories</div>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-2xl mb-1">🌟</div>
            <div className="text-white font-bold">5 Rarities</div>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-white font-bold">Dynamic Power</div>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-2xl mb-1">🌩️</div>
            <div className="text-white font-bold">Weather Reactive</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockNFTInventory;