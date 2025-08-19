import React, { useState, useEffect } from 'react';
import { Image, Star, Calendar, Zap, Shield, Sparkles, Award, TrendingUp, AlertCircle } from 'lucide-react';

const NFTInventory = ({ mintedNFTs = [], userAddress, blockchain }) => {
  const [nfts, setNfts] = useState(() => {
    const saved = localStorage.getItem('userNFTs');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedNFT, setSelectedNFT] = useState(null);

  // Update local state when props change
  useEffect(() => {
    if (mintedNFTs && mintedNFTs.length > 0) {
      setNfts(mintedNFTs);
    } else {
      // Load from localStorage
      const saved = localStorage.getItem('userNFTs');
      if (saved) {
        setNfts(JSON.parse(saved));
      }
    }
  }, [mintedNFTs]);

  const getWeatherIcon = (type) => {
    const icons = {
      'Storm Gear': <Zap className="w-8 h-8 text-purple-400" />,
      'Weather Collectible': <Star className="w-8 h-8 text-yellow-400" />,
      'Ancient Artifact': <Award className="w-8 h-8 text-orange-400" />,
      'Elemental Weapon': <Sparkles className="w-8 h-8 text-red-400" />,
      'Weather Tool': <Shield className="w-8 h-8 text-green-400" />,
      'Storm': <Zap className="w-8 h-8 text-purple-400" />,
      'Sunshine': <Star className="w-8 h-8 text-yellow-400" />,
      'Rain': <Star className="w-8 h-8 text-blue-400" />,
      'Snow': <Star className="w-8 h-8 text-cyan-400" />,
      'Fog': <Star className="w-8 h-8 text-gray-400" />
    };
    return icons[type] || <Star className="w-8 h-8 text-yellow-400" />;
  };

  const getTypeGradient = (type) => {
    const gradients = {
      'Storm Gear': 'from-purple-600 to-indigo-600',
      'Weather Collectible': 'from-yellow-500 to-orange-500',
      'Ancient Artifact': 'from-orange-600 to-red-600',
      'Elemental Weapon': 'from-red-500 to-pink-500',
      'Weather Tool': 'from-green-500 to-emerald-500',
      'Storm': 'from-purple-600 to-indigo-600',
      'Sunshine': 'from-yellow-500 to-orange-500',
      'Rain': 'from-blue-500 to-cyan-500',
      'Snow': 'from-cyan-300 to-blue-300',
      'Fog': 'from-gray-500 to-gray-600'
    };
    return gradients[type] || 'from-yellow-500 to-orange-500';
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'text-gray-400',
      'Uncommon': 'text-green-400',
      'Rare': 'text-blue-400',
      'Epic': 'text-purple-400',
      'Legendary': 'text-yellow-400',
      'Mythic': 'text-red-400',
      'Dynamic (Weather-reactive)': 'text-rainbow bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
    };
    return colors[rarity] || 'text-gray-400';
  };

  const getStatusBadge = (nft) => {
    if (nft.txHash && nft.blockNumber) {
      return (
        <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-medium flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          Live Blockchain
        </div>
      );
    } else if (nft.isDemo) {
      return (
        <div className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-medium flex items-center">
          <Sparkles className="w-3 h-3 mr-1" />
          Platform NFT
        </div>
      );
    } else {
      return (
        <div className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-medium">
          Preview Mode
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Image className="w-6 h-6 mr-3" />
          Your NFT Collection
        </h3>
        <div className="bg-white/10 px-3 py-1 rounded-full">
          <span className="text-white font-bold">{nfts.length}</span>
          <span className="text-gray-300 text-sm ml-1">NFTs</span>
        </div>
      </div>

      {/* Empty State */}
      {nfts.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-semibold text-white mb-2">No NFTs Yet</h4>
          <p className="text-gray-300 mb-4">Start your collection by minting weather NFTs!</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black/20 rounded-lg p-3">
              <Shield className="w-5 h-5 mx-auto mb-2 text-green-400" />
              <p className="text-green-400 font-medium">Dynamic Metadata</p>
              <p className="text-gray-400">Changes with weather</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <Zap className="w-5 h-5 mx-auto mb-2 text-blue-400" />
              <p className="text-blue-400 font-medium">Weather Reactive</p>
              <p className="text-gray-400">Unique game mechanics</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
            <p className="text-yellow-300 text-sm font-medium">Core Features</p>
            <p className="text-gray-300 text-xs mt-1">
              Weather-reactive NFTs that evolve based on real-world weather conditions and gameplay!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft, index) => (
              <div 
                key={nft.id || index} 
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedNFT(nft)}
              >
                <div className="text-center">
                  {/* NFT Icon */}
                  <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${getTypeGradient(nft.category || nft.type)} rounded-full flex items-center justify-center shadow-lg`}>
                    {getWeatherIcon(nft.category || nft.type)}
                  </div>

                  {/* NFT Info */}
                  <h4 className="text-lg font-bold text-white mb-1">
                    {nft.category || nft.type} NFT
                  </h4>
                  <p className={`text-sm mb-3 ${getRarityColor(nft.rarity)}`}>
                    {nft.rarity}
                  </p>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-xs">
                      <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                      <span className="text-gray-400">
                        {new Date(nft.mintedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Token ID */}
                    {nft.tokenId && (
                      <div className="text-xs text-gray-400">
                        ID: #{nft.tokenId}
                      </div>
                    )}

                    {/* Status Badge */}
                    {getStatusBadge(nft)}

                    {/* Staking Power */}
                    {nft.stakingPower && (
                      <div className="flex items-center justify-center text-xs">
                        <Sparkles className="w-3 h-3 mr-1 text-yellow-400" />
                        <span className="text-yellow-400">
                          {nft.stakingPower} Power
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Collection Stats */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Collection Analytics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{nfts.length}</div>
                <div className="text-xs text-gray-300">Total NFTs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {nfts.filter(nft => nft.txHash || nft.blockNumber).length}
                </div>
                <div className="text-xs text-gray-300">Live Blockchain</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {new Set(nfts.map(nft => nft.category || nft.type)).size}
                </div>
                <div className="text-xs text-gray-300">Unique Types</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {nfts.reduce((total, nft) => total + (nft.stakingPower || 0), 0)}
                </div>
                <div className="text-xs text-gray-300">Total Power</div>
              </div>
            </div>
          </div>

          {/* Platform Features Banner */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center mb-3">
              <Sparkles className="w-6 h-6 mr-3 text-purple-400" />
              <h4 className="text-white font-bold">Dynamic Weather Integration</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-gray-300">Real-time weather sync</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                <span className="text-gray-300">Adaptive metadata system</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-gray-300">Staking power mechanics</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${getTypeGradient(selectedNFT.category || selectedNFT.type)} rounded-full flex items-center justify-center shadow-lg`}>
                {getWeatherIcon(selectedNFT.category || selectedNFT.type)}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedNFT.category || selectedNFT.type} NFT
              </h3>
              
              <p className={`text-sm mb-4 ${getRarityColor(selectedNFT.rarity)}`}>
                {selectedNFT.rarity}
              </p>

              {/* Detailed Stats */}
              <div className="space-y-3 text-left">
                {selectedNFT.tokenId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token ID:</span>
                    <span className="text-white">#{selectedNFT.tokenId}</span>
                  </div>
                )}
                
                {selectedNFT.stakingPower && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Staking Power:</span>
                    <span className="text-yellow-400">{selectedNFT.stakingPower}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Evolution Stage:</span>
                  <span className="text-purple-400">{selectedNFT.evolutionStage || 1}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Weather Exposure:</span>
                  <span className="text-blue-400">{selectedNFT.weatherExposure || 0}</span>
                </div>

                {selectedNFT.txHash && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tx Hash:</span>
                    <span className="text-green-400 text-xs">{selectedNFT.txHash.slice(0, 10)}...</span>
                  </div>
                )}

                {selectedNFT.demoFeatures && (
                  <div>
                    <span className="text-gray-400 block mb-2">Platform Features:</span>
                    <div className="space-y-1">
                      {selectedNFT.demoFeatures.map((feature, index) => (
                        <div key={index} className="text-xs text-blue-300 flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedNFT(null)}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTInventory;