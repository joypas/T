'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore } from '@/store/gachaStore';
import { X, Truck, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShippingModal({ isOpen, onClose }: Props) {
  const { user, updateShippingAddress } = useGachaStore();
  const existingAddress = user?.shippingAddress;

  const [name, setName] = useState(existingAddress?.name || '');
  const [phone, setPhone] = useState(existingAddress?.phone || '');
  const [address, setAddress] = useState(existingAddress?.address || '');
  const [isEditing, setIsEditing] = useState(!existingAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateShippingAddress({ name, phone, address });
    setIsEditing(false);
    alert('배송지가 저장되었습니다. 상품이 준비되는 대로 배송됩니다!');
    onClose();
  };

  const handleConfirm = () => {
    alert('저장된 배송지로 배송 요청이 완료되었습니다!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="shipping-modal-wrapper" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="shipping-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-sm relative z-10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-[#FFEB00] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="text-yellow-900" size={20} />
                <h3 className="font-black text-gray-900">배송지 입력</h3>
              </div>
              <button onClick={onClose} className="text-yellow-900/60 hover:text-yellow-900">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 bg-[#FAF7F2]">
              {!isEditing && existingAddress ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-5 border border-yellow-200 shadow-sm relative">
                    <div className="absolute top-4 right-4 text-green-500">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="font-bold text-gray-500 text-xs mb-2">저장된 기본 배송지</h4>
                    <p className="font-black text-lg text-gray-900">{existingAddress.name}</p>
                    <p className="text-gray-600 text-sm mt-1">{existingAddress.phone}</p>
                    <p className="text-gray-800 font-medium text-sm mt-3 pt-3 border-t border-gray-100">
                      {existingAddress.address}
                    </p>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-3.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      변경하기
                    </button>
                    <button 
                      onClick={handleConfirm}
                      className="flex-1 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                    >
                      이 주소로 받기
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">수령인</label>
                    <input 
                      type="text" required
                      value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 font-medium text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">연락처</label>
                    <input 
                      type="tel" required
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 font-medium text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">상세 주소</label>
                    <textarea 
                      required rows={3}
                      value={address} onChange={(e) => setAddress(e.target.value)}
                      placeholder="배송 받을 주소를 입력하세요"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 font-medium text-gray-900 resize-none"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#FFEB00] text-black font-black text-lg rounded-xl mt-4 hover:bg-[#F4E100] transition-colors shadow-sm"
                  >
                    배송지 저장 완료
                  </button>
                  {existingAddress && (
                    <button 
                      type="button" onClick={() => setIsEditing(false)}
                      className="w-full py-3 text-gray-500 font-bold text-sm mt-2 hover:text-gray-800"
                    >
                      취소
                    </button>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
