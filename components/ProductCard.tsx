import React from 'react';
import { Grade, Product, useGachaStore, gradeProbabilities } from '@/store/gachaStore';

const gradeStyles: Record<Grade, { border: string; badge: string; shadow: string }> = {
  legendary: { 
    border: 'border-[3px] border-yellow-400 bg-gradient-to-b from-yellow-50 to-white', 
    badge: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white shadow-[0_0_12px_rgba(250,204,21,0.8)] border border-yellow-200',
    shadow: 'shadow-[0_4px_15px_rgba(250,204,21,0.2)] hover:shadow-[0_8px_25px_rgba(250,204,21,0.4)] hover:-translate-y-1.5'
  },
  epic: { 
    border: 'border-[3px] border-purple-400 bg-gradient-to-b from-purple-50 to-white', 
    badge: 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)] border border-purple-300',
    shadow: 'shadow-[0_4px_12px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:-translate-y-1'
  },
  rare: { 
    border: 'border-2 border-blue-400 bg-gradient-to-b from-blue-50 to-white', 
    badge: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-[0_0_8px_rgba(56,189,248,0.4)]',
    shadow: 'shadow-sm hover:shadow-[0_8px_15px_rgba(56,189,248,0.2)] hover:-translate-y-1'
  },
  common: { 
    border: 'border border-gray-300 bg-white', 
    badge: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
    shadow: 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
  }
};

const gradeLabels: Record<Grade, string> = {
  legendary: '전설',
  epic: '영웅',
  rare: '희귀',
  common: '일반'
};

export default function ProductCard({ product }: { product: Product }) {
  const selectProduct = useGachaStore(state => state.selectProduct);
  const style = gradeStyles[product.grade];

  return (
    <div 
      onClick={() => selectProduct(product)}
      className={`rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 ${style.border} ${style.shadow}`}
    >
      <div className={`aspect-square w-full flex items-center justify-center bg-white relative`}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-2.5 py-1 text-[10px] font-black tracking-widest rounded-full ${style.badge}`}>
            {gradeLabels[product.grade]} ({gradeProbabilities[product.grade]}%)
          </span>
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <h3 className="font-bold text-sm text-gray-900 mb-1 leading-tight line-clamp-2">{product.name}</h3>
        <p className="text-yellow-600 font-black tracking-tighter text-sm mt-auto">
          {product.price.toLocaleString()}P
        </p>
      </div>
    </div>
  );
}
