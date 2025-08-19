// FILE: frontend/src/components/WalletConnect.jsx
// Beautiful professional wallet connection component

import React, { useState } from 'react';
import { Wallet, CheckCircle, AlertCircle, ExternalLink, Copy, Loader } from 'lucide-react';

const WalletConnect = ({ blockchain }) => {
  const [copied, setCopied] = useState(false);

  const {
    account,
    isConnected,
    balance,
    loading,
    error,
    connectWallet,
    disconnectWallet
  } = blockchain;

  // Copy address to clipboard
  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format balance for display
  const formatBalance = (bal) => {
    const numBalance = parseFloat(bal || 0);
    return numBalance.toFixed(4);
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 flex items-center space-x-2">
        <Loader className="w-4 h-4 text-white animate-spin" />
        <span className="text-white text-sm font-medium">Connecting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-2 flex items-center space-x-2">
        <AlertCircle className="w-4 h-4 text-red-400" />
        <span className="text-red-200 text-sm font-medium">Connection Failed</span>
        <button
          onClick={connectWallet}
          className="text-red-200 hover:text-white text-sm underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Balance Display */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-right">
        <div className="text-white font-bold text-sm">
          {formatBalance(balance)} STT
        </div>
        <div className="text-blue-200 text-xs">
          Somnia Testnet
        </div>
      </div>

      {/* Wallet Info Dropdown */}
      <div className="relative group">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl flex items-center space-x-2 cursor-pointer">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium text-sm">{formatAddress(account)}</span>
        </div>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-72 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Wallet Connected</h3>
                <p className="text-green-200 text-sm">Somnia Testnet</p>
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="text-blue-200 text-sm">Address</label>
              <div className="bg-black/20 rounded-lg p-3 flex items-center justify-between mt-1">
                <span className="text-white font-mono text-sm">{formatAddress(account)}</span>
                <button
                  onClick={copyAddress}
                  className="text-blue-300 hover:text-white transition-colors"
                  title="Copy address"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Balance */}
            <div className="mb-4">
              <label className="text-blue-200 text-sm">Balance</label>
              <div className="bg-black/20 rounded-lg p-3 mt-1">
                <div className="text-white font-bold">{formatBalance(balance)} STT</div>
                <div className="text-blue-200 text-xs">≈ $0.00 USD</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => window.open('https://shannon-explorer.somnia.network', '_blank')}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Explorer</span>
              </button>
              <button
                onClick={disconnectWallet}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;