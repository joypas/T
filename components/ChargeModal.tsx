'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore } from '@/store/gachaStore';
import { X, Sparkles, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const chargeProducts = [
  { id: 'p1', points: 3000, price: 3000, bonus: 0, tag: '' },
  { id: 'p2', points: 11000, price: 10000, bonus: 10, tag: '10% 보너스' },
  { id: 'p3', points: 35000, price: 30000, bonus: 16, tag: '인기' },
  { id: 'p4', points: 60000, price: 50000, bonus: 20, tag: '혜자!' },
  { id: 'p5', points: 130000, price: 100000, bonus: 30, tag: '최고 효율 👑', highlight: true },
];

export default function ChargeModal({ isOpen, onClose }: Props) {
  const { points, chargePoints } = useGachaStore();

  const handleCharge = (product: typeof chargeProducts[0]) => {
    // 실제 결제 로직 대신 바로 충전 처리 (Mock)
    chargePoints(product.points);
    alert(`결제가 완료되었습니다!\n${product.points.toLocaleString()}P가 충전되었습니다.`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="charge-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#FFEB00] text-black p-5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-white opacity-40 text-6xl">
                <Sparkles />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">포인트 상점</h2>
                <p className="text-xs font-bold text-yellow-800 mt-1">보유 포인트: {points.toLocaleString()}P</p>
              </div>
              <button 
                onClick={onClose}
                className="bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors relative z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chargeProducts.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => handleCharge(p)}
                  className={`relative flex items-center p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] ${
                    p.highlight 
                    ? 'bg-gradient-to-r from-gray-900 to-black text-white border-2 border-[#FFFF00] shadow-[0_0_15px_rgba(255,235,0,0.3)] hover:shadow-[0_0_20px_rgba(255,235,0,0.5)]' 
                    : 'bg-white border-2 border-transparent hover:border-yellow-300 shadow-sm'
                  }`}
                >
                  {/* 태그 영역 */}
                  {p.tag && (
                    <div className={`absolute -top-3 left-4 px-2.5 py-0.5 text-[10px] font-black rounded-full shadow-sm ${
                      p.highlight ? 'bg-[#FFFF00] text-black' : 'bg-red-500 text-white'
                    }`}>
                      {p.tag}
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner ${
                      p.highlight ? 'bg-white/20' : 'bg-yellow-100'
                    }`}>
                      💰
                    </div>
                    <div>
                      <h3 className={`text-lg font-black tracking-tight ${p.highlight ? 'text-[#FFFF00]' : 'text-gray-900'}`}>
                        {p.points.toLocaleString()}P
                      </h3>
                      <p className={`text-xs font-bold ${p.highlight ? 'text-gray-400' : 'text-gray-500'}`}>
                        {p.bonus > 0 && <span className="text-red-500 mr-1">(+{p.bonus}%)</span>}
                        기본 포인트
                      </p>
                    </div>
                  </div>

                  <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
                    p.highlight ? 'bg-[#FFFF00] text-black' : 'bg-gray-100 text-gray-900'
                  }`}>
                    ₩{p.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 break-keep">
                본 상점은 테스트용 Mock 상점입니다.<br/>실제 결제가 이루어지지 않습니다.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
