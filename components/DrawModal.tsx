'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore } from '@/store/gachaStore';
import { X, Share2, Package } from 'lucide-react';
import ShippingModal from '@/components/ShippingModal';

export default function DrawModal() {
  const { isDrawing, drawResult, resetDraw } = useGachaStore();
  const [showShipping, setShowShipping] = useState(false);

  if (!isDrawing && !drawResult) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        {isDrawing && !drawResult && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 1.1, 1, 1.3, 1.1, 1.5, 1.2, 1.8], 
              rotate: [0, -15, 15, -20, 20, -25, 25, 0] 
            }}
            transition={{ duration: 2, ease: "easeIn" }}
            className="text-center relative z-10"
          >
            <div className="text-[8rem] mb-6 filter drop-shadow-[0_0_30px_rgba(255,255,255,1)]">🎁</div>
            <h2 className="text-3xl font-black text-white tracking-widest drop-shadow-lg animate-pulse">OPENING...</h2>
          </motion.div>
        )}

        {drawResult && (
          <>
            {/* 터지는 효과 (화이트 플래시) */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 bg-white z-[60] pointer-events-none"
            />
            
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col items-center relative overflow-hidden shadow-2xl z-50"
            >
            {drawResult.grade === 'legendary' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/50 to-transparent animate-pulse pointer-events-none" />
            )}
            
            <button onClick={resetDraw} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6">당첨을 축하합니다!</h3>
            
            <motion.div 
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className={`w-40 h-40 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner mb-6 border-4 ${
                drawResult.grade === 'legendary' ? 'border-yellow-400 bg-white' :
                drawResult.grade === 'epic' ? 'border-purple-400 bg-white' :
                drawResult.grade === 'rare' ? 'border-blue-400 bg-white' :
                'border-gray-300 bg-white'
              }`}
            >
              <img src={drawResult.image} alt={drawResult.name} className="w-full h-full object-cover" />
            </motion.div>

            <div className="text-center mb-8">
              <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full mb-2 ${
                drawResult.grade === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                drawResult.grade === 'epic' ? 'bg-purple-100 text-purple-700' :
                drawResult.grade === 'rare' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {drawResult.grade.toUpperCase()}
              </span>
              <h2 className="text-2xl font-black text-gray-900 break-keep">{drawResult.name}</h2>
            </div>

            <div className="w-full space-y-3">
              <button className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                <Share2 size={20} /> 인스타 스토리 공유하기
              </button>
              <div className="flex gap-3">
                <button onClick={resetDraw} className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  선물 하나 더 열기
                </button>
                <button onClick={() => setShowShipping(true)} className="flex-1 py-3 bg-[#FFEB00] text-black rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-[#F4E100] transition-colors">
                  <Package size={18} /> 배송지 입력
                </button>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </div>

      <ShippingModal isOpen={showShipping} onClose={() => setShowShipping(false)} />
    </AnimatePresence>
  );
}
