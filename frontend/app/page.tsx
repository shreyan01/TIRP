'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Button } from '@web3modal/react';
import Image from 'next/image';

// Contract ABI - we'll need to add this after compiling the contract
const TIRP_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function maxBuyAmount() view returns (uint256)",
  "function isExcludedFromFees(address) view returns (bool)"
];

// Contract address from local deployment
const TIRP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [maxBuy, setMaxBuy] = useState('0');

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          updateBalance(accounts[0]);
        } else {
          setAccount('');
          setIsConnected(false);
          setBalance('0');
        }
      });
    }
  }, []);

  const updateBalance = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(TIRP_ADDRESS, TIRP_ABI, provider);
      const balance = await contract.balanceOf(address);
      setBalance(ethers.formatEther(balance));
      
      const maxBuyAmount = await contract.maxBuyAmount();
      setMaxBuy(ethers.formatEther(maxBuyAmount));
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Animated Title */}
        <div className="text-center mb-12 animate-bounce">
          <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
            TIRP
          </h1>
          <h2 className="text-4xl mt-4 font-mono text-yellow-400">
            This Is a Rug Pull
          </h2>
        </div>

        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-xl mb-12 transform hover:scale-105 transition-transform duration-300 shadow-lg">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-4xl">⚠️</span>
            <p className="text-2xl font-bold text-center">
              WARNING: This is a rug-pull experiment. You may lose all your money. Buy responsibly.
            </p>
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Connect Wallet Button */}
        <div className="flex justify-center mb-12">
          <div className="transform hover:scale-110 transition-transform duration-300">
            <Web3Button />
          </div>
        </div>

        {/* Wallet Info Card */}
        {isConnected && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl mb-12 transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <h3 className="text-3xl font-bold mb-6 text-yellow-400">Your Wallet</h3>
            <div className="space-y-4">
              <p className="font-mono text-lg">Address: {account}</p>
              <p className="text-2xl">Balance: <span className="text-green-400">{balance} TIRP</span></p>
              <p className="text-xl">Max Buy: <span className="text-red-400">{maxBuy} TIRP</span></p>
            </div>
          </div>
        )}

        {/* Tokenomics and Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-8 rounded-xl transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <h3 className="text-3xl font-bold mb-6 text-yellow-400">Tokenomics</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center">
                <span className="text-2xl mr-2">💰</span>
                Total Supply: 1,000,000,000 TIRP
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-2">💸</span>
                Transfer Fee: 0.5%
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-2">🦈</span>
                Max Buy: $500 per wallet
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-8 rounded-xl transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <h3 className="text-3xl font-bold mb-6 text-yellow-400">Anti-Whale Rules</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center">
                <span className="text-2xl mr-2">🚫</span>
                Maximum buy limit: $500 per wallet
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-2">💱</span>
                Transfer fees auto-swap to USDC
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-2">👑</span>
                Fees sent to owner wallet
              </li>
            </ul>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl transform hover:scale-105 transition-transform duration-300 shadow-lg">
          <h3 className="text-3xl font-bold mb-6 text-yellow-400">Price Chart</h3>
          <div className="h-96 flex items-center justify-center">
            <p className="text-2xl text-center">
              📈 Chart integration coming soon... 
              <br />
              <span className="text-sm text-gray-400">(Just like your profits)</span>
            </p>
          </div>
        </div>

        {/* Whitepaper Link */}
        <div className="mt-12 text-center">
          <a 
            href="/whitepaper" 
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold transform hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            📜 Read Our (Satirical) Whitepaper
          </a>
        </div>

        {/* Meme Footer */}
        <div className="mt-12 text-center text-gray-400">
          <p className="text-lg">🚀 To the moon! (or to zero, who knows?)</p>
          <p className="text-sm mt-2">Not financial advice. Actually, it&apos;s the opposite of financial advice.</p>
        </div>
      </div>
    </main>
  );
}
