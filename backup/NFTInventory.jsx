import React, { useState, useEffect } from 'react';
import { Image, Star, Calendar, Zap, Shield } from 'lucide-react';

const NFTInventory = ({ mintedNFTs = [], userAddress }) => {
  const [nfts, setNfts] = useState(() => {
    const saved = localStorage.getItem('userNFTs');
    return saved ? JSON.parse(saved) : [];
  });

  // Update local state when props change
  useEffect(() => {
    if (mintedNFTs && mintedNFTs.length > 0) {
      setNfts(mintedNFTs);
    }
  }, [mintedNFTs]);

  const getWeatherIcon = (type) => {
    const icons = {
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
      'Storm': 'from-purple-600 to-indigo-600',
      'Sunshine': 'from-yellow-500 to-orange-500',
      'Rain': 'from-blue-500 to-cyan-500',
      'Snow': 'from-cyan-300 to-blue-300',
      'Fog': 'from-gray-500 to-gray-600'
    };
    return gradients[type] || 'from-yellow-500 to-orange-500';
  };

  return (
    <div className="space-y-6">
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
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft, index) => (
            <div key={nft.id || index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${getTypeGradient(nft.type)} rounded-full flex items-center justify-center shadow-lg`}>
                  {getWeatherIcon(nft.type)}
                </div>
                
                <h4 className="text-lg font-bold text-white mb-1">{nft.type} NFT</h4>
                <p className="text-sm text-gray-300 mb-3">{nft.rarity}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-xs">
                    <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                    <span className="text-gray-400">
                      {new Date(nft.mintedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-medium">
                    Demo Mode
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {nfts.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-2">Collection Stats</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{nfts.length}</div>
              <div className="text-xs text-gray-300">Total NFTs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {nfts.filter(nft => nft.blockchain === 'Somnia Testnet').length}
              </div>
              <div className="text-xs text-gray-300">Real Blockchain</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {new Set(nfts.map(nft => nft.type)).size}
              </div>
              <div className="text-xs text-gray-300">Weather Types</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTInventory;