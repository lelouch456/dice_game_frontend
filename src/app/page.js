"use client";
import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState("");
  const [revealedServerSeed, setRevealedServerSeed] = useState("");
  const [rollResult, setRollResult] = useState(null);
  const multiplier=2.00000;
  const [isDragging, setIsDragging] = useState(false);
  const winChance =49.500;
  const [profitOnWin, setProfitOnWin] = useState("0.00");


  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    handleBetAmountChange(newValue);
  };

  const calculatePosition = () => {
    return (betAmount / 1000) * 100;
  };
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const rollDice = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > balance) {
      alert("Invalid bet amount");
      return;
    }

    const clientSeed = crypto.randomUUID();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/roll-dice`, {
        betAmount: parseFloat(betAmount),
        clientSeed,
      });

      setRollResult(response.data.roll);
      setBalance(response.data.balance);
      setRevealedServerSeed(response.data.revealedServerSeed);
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  const handleBetAmountChange = (value) => {
    setProfitOnWin(value*2);
    setBetAmount(value);
  };

 

  return (
    <div className="bg-[#191B22] min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#2C2F36] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between mb-4">
          <div className="text-white text-sm">Balance: ₹{balance.toFixed(2)}</div>
        </div>

        <div className="mb-4">
          <input 
            type="text" 
            value={betAmount}
            onChange={(e) => handleBetAmountChange(e.target.value)}
            className="w-full bg-[#353945] text-white text-2xl p-3 rounded-md text-right"
            placeholder="0.00"
          />
          <div className="flex justify-center space-x-2 mt-2">
            <button className="bg-[#353945] text-white px-3 py-1 rounded-md text-sm">2×</button>
          </div>
        </div>

        <div className="mb-4">
          <input 
            type="text" 
            value={profitOnWin}
            readOnly
            className="w-full bg-[#353945] text-white text-xl p-3 rounded-md text-right"
            placeholder="0.00"
          />
        </div>

        <div className="p-8">
      <div className="relative mb-8">
        <input 
          type="range" 
          min="0" 
          max="1000" 
          value={betAmount}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer z-10"
        />
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-red-500 h-full"
            style={{ width: `${calculatePosition()}%` }}
          ></div>
          <div
            className="bg-green-500 h-full absolute top-0 right-0"
            style={{ width: `${100 - calculatePosition()}%` }}
          ></div>
        </div>
        <div
          className="absolute top-1/2 left-[68%] transform -translate-x-1/2 -translate-y-1/2 bg-white text-black px-2 py-1 rounded-md text-sm"
          style={{ left: `${calculatePosition()}%` }}
        >
          {betAmount}
        </div>
      </div>
      <div className="text-center mt-4">
        <p>Current Value: {betAmount}</p>
      </div>
    </div>
      
      
        <button 
          onClick={rollDice}
          className="w-full bg-green-500 text-white py-3 rounded-md text-xl font-bold hover:bg-green-600 transition"
        >
          Bet
        </button>

        {rollResult !== null && (
          <div className="mt-4 text-center">
            <p className={`text-2xl font-bold ${rollResult >= 4 ? 'text-green-500' : 'text-red-500'}`}>
              {rollResult >= 4 ? 'You Win!' : 'You Lose!'}
            </p>
            <p className="text-white">Roll Result: {rollResult}</p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-[#353945] p-2 rounded-md text-center">
            <div className="text-xs text-gray-400">Multiplier</div>
            <input 
              type="text" 
              value={multiplier.toFixed(5)} 
              readOnly 
              className="w-full bg-transparent text-white text-center"
            />

          </div>
          <div className="bg-[#353945] p-2 rounded-md text-center">
            <div className="text-xs text-gray-400">CreatedBy SahilPrasad</div>
            
          </div>
          <div className="bg-[#353945] p-2 rounded-md text-center">
            <div className="text-xs text-gray-400">Win Chance</div>
            <input 
              type="text" 
              value={`${winChance.toFixed(4)}%`}
              readOnly
              className="w-full bg-transparent text-white text-center"
            />
          </div>
        </div>
        <div className="text-center mt-4 text-xs">
        <p>Revealed Server Seed: {revealedServerSeed}</p>
      </div>
      </div>
      
    </div>
  );
}
