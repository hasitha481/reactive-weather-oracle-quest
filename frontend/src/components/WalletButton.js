import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Wallet, Loader } from 'lucide-react';

const WalletButton = () => {
  const { account, isConnecting, connectWallet, disconnect, isConnected } = useWeb3();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">{formatAddress(account)}</span>
          </div>
        </div>
        <button
          onClick={disconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
    >
      {isConnecting ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  );
};

export default WalletButton;