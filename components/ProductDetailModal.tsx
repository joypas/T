import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore, gradeProbabilities } from '@/store/gachaStore';
import { X, Sparkles, Box } from 'lucide-react';

const gradeBadges = {
  legendary: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white shadow-[0_0_12px_rgba(250,204,21,0.6)] border border-yellow-200',
  epic: 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)] border border-purple-300',
  rare: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-[0_0_8px_rgba(56,189,248,0.4)]',
  common: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
};

const gradeLabels = {
  legendary: '전설',
  epic: '영웅',
  rare: '희귀',
  common: '일반'
};

export default function ProductDetailModal() {
  const { selectedProduct, selectProduct } = useGachaStore();

  if (!selectedProduct) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[60] bg-[#FAF7F2] flex flex-col max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        {/* 상단 닫기 버튼 */}
        <button 
          onClick={() => selectProduct(null)}
          className="absolute top-4 right-4 z-[70] bg-black/40 text-white p-2 rounded-full backdrop-blur-md"
        >
          <X size={24} />
        </button>

        {/* 상단 거대 이미지 */}
        <div className="w-full h-[45%] bg-white relative">
          <img 
            src={selectedProduct.image} 
            alt={selectedProduct.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] to-transparent top-2/3" />
        </div>

        {/* 하단 상세 내용 */}
        <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 text-xs font-black tracking-widest rounded-full ${gradeBadges[selectedProduct.grade]}`}>
              {gradeLabels[selectedProduct.grade]} ({gradeProbabilities[selectedProduct.grade]}%)
            </span>
            <span className="text-gray-500 font-bold text-sm bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1">
              <Box size={14}/> 남은 재고 {selectedProduct.stock}개
            </span>
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 leading-tight mb-6 break-keep">
            {selectedProduct.name}
          </h2>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
            <div className="absolute -top-3 -right-3 text-yellow-100 text-6xl opacity-30"><Sparkles /></div>
            <h3 className="text-[#0A0A0C] font-black text-lg mb-2 flex items-center gap-1">
              <span className="text-[#FFEB00] text-xl">💡</span> 오타쿠 모드 ON
            </h3>
            <p className="text-gray-700 leading-relaxed font-medium break-keep">
              {selectedProduct.description}
            </p>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 mb-8">
            <h3 className="text-gray-500 font-bold text-xs tracking-wider mb-2">상세 스펙 (SPECS)</h3>
            <p className="text-gray-800 font-medium text-sm">
              {selectedProduct.specs}
            </p>
          </div>
        </div>

        {/* 하단 고정 CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2] to-transparent">
          <button 
            onClick={() => selectProduct(null)}
            className="w-full bg-[#0A0A0C] text-white font-black text-xl py-4 rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            뒤로 가기 (가챠 돌리러 가기)
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
