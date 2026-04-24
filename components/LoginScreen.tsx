'use client';

import React, { useState } from 'react';
import { useGachaStore } from '@/store/gachaStore';
import { motion } from 'framer-motion';

export default function LoginScreen() {
  const login = useGachaStore((state) => state.login);
  const [duckId, setDuckId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duckId.trim() && password.trim()) {
      login(duckId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center p-6 text-white max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto bg-[#FFFF00] rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,0,0.2)]">
            <span className="text-5xl -ml-1 mt-1">🦆</span>
          </div>
          <h1 className="text-4xl font-black text-[#FFFF00] tracking-tighter">DUCKS CLUB</h1>
          <p className="text-gray-400 font-bold tracking-widest text-xs mt-2">가입하고 10,000P 받기!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">덕후아이디</label>
            <input 
              type="text" 
              value={duckId}
              onChange={(e) => setDuckId(e.target.value)}
              placeholder="예: ducks_fan"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFFF00] focus:ring-1 focus:ring-[#FFFF00] transition-all font-bold"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFFF00] focus:ring-1 focus:ring-[#FFFF00] transition-all font-bold"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#FFFF00] text-black font-black text-lg py-4 rounded-xl mt-6 hover:bg-[#E5E600] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(255,255,0,0.3)]"
          >
            입장하기
          </button>
        </form>
      </motion.div>
    </div>
  );
}
