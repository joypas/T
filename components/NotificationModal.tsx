'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore } from '@/store/gachaStore';
import { X, BellRing, Gift, Info, Star } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: Props) {
  const notifications = useGachaStore((state) => state.notifications);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const currentNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const getIcon = (type: string) => {
    switch(type) {
      case 'event': return <Star className="text-[#FFEB00] w-5 h-5" />;
      case 'reward': return <Gift className="text-blue-400 w-5 h-5" />;
      case 'notice': return <Info className="text-gray-400 w-5 h-5" />;
      default: return <BellRing className="text-gray-400 w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="noti-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()} // 백그라운드 클릭 방지
          >
            {/* Header */}
            <div className="bg-[#0A0A0C] text-white p-5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-[#FFFF00] opacity-10 text-6xl">
                <BellRing />
              </div>
              <div className="flex items-center gap-2">
                <BellRing size={20} className="text-[#FFFF00]" />
                <h2 className="text-lg font-black tracking-tight">내 소식</h2>
              </div>
              <button 
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
              {currentNotifications.length > 0 ? (
                <div className="space-y-2">
                  {currentNotifications.map((noti) => (
                    <div 
                      key={noti.id} 
                      className={`p-4 rounded-2xl bg-white border ${noti.isRead ? 'border-gray-100' : 'border-[#FFFF00]/50 shadow-sm'} flex gap-3`}
                    >
                      <div className="mt-0.5">{getIcon(noti.type)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`font-bold text-sm ${noti.isRead ? 'text-gray-700' : 'text-black'}`}>
                            {noti.title}
                          </h3>
                          {!noti.isRead && <span className="w-2 h-2 rounded-full bg-red-500 mt-1"></span>}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2 break-keep">
                          {noti.message}
                        </p>
                        <span className="text-[10px] font-bold text-gray-400">{noti.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-gray-400 font-medium text-sm">
                  새로운 알림이 없습니다.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white border-t border-gray-100 p-4 flex items-center justify-between">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  이전
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                        currentPage === idx + 1 
                        ? 'bg-[#0A0A0C] text-[#FFFF00]' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  다음
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
