'use client';

import React, { useState, useEffect } from 'react';
import { useGachaStore } from '@/store/gachaStore';
import ProductCard from '@/components/ProductCard';
import DrawModal from '@/components/DrawModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import NotificationModal from '@/components/NotificationModal';
import ChargeModal from '@/components/ChargeModal';
import EventModal from '@/components/EventModal';
import LoginScreen from '@/components/LoginScreen';
import { Bell, LogOut, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { user, points, products, drawGacha, logout } = useGachaStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  
  // 무한 스크롤 상태
  const [visibleCount, setVisibleCount] = useState(6);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer 설정
  useEffect(() => {
    if (!isClient || !user) return;

    // 배너 롤링 타이머
    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 3);
    }, 3500);
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + 6, products.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
      clearInterval(bannerTimer);
    };
  }, [isClient, user, products.length]);

  // Hydration mismatch 방지용
  if (!isClient) return null;

  if (!user && !showSplash) {
    return <LoginScreen />;
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] pb-32 relative">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-[#0A0A0C] flex flex-col items-center justify-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center w-full px-8"
            >
              <motion.div 
                animate={{ y: [0, -8, 0] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto bg-[#FFFF00] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,255,0,0.3)]"
              >
                <span className="text-6xl transform -translate-x-1 translate-y-1">🦆</span>
              </motion.div>
              <h1 className="text-[3.5rem] font-black text-[#FFFF00] tracking-tighter leading-none mb-2">DUCKS<br/>CLUB</h1>
              <div className="h-1.5 w-16 bg-[#FFFF00] mx-auto my-6"></div>
              <p className="text-white font-bold tracking-[0.25em] text-xs opacity-90">SPECIAL GOODS CURATION</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-gray-200 px-5 py-4 flex items-center justify-between shadow-sm">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="bg-[#FFFF00] w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(255,255,0,0.6)]">
              <span className="text-lg -ml-0.5 mt-0.5 transform -translate-x-0.5">🦆</span>
            </div>
            <h1 className="text-[1.35rem] font-black italic tracking-tighter text-gray-900 leading-none">
              DUCKS<span className="text-[#FFEB00] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">CLUB</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-gray-500 tracking-wide">
              {user?.duckId || '게스트'}
            </p>
            <div 
              onClick={() => setShowChargeModal(true)}
              className="flex items-center gap-1 cursor-pointer hover:bg-yellow-50 px-1.5 py-0.5 rounded transition-colors"
            >
              <span className="text-xs font-bold text-yellow-600 tracking-wide">💰 {points.toLocaleString()}P</span>
              <button className="bg-[#FFEB00] text-yellow-900 rounded-full w-4 h-4 flex items-center justify-center font-black">
                <Plus size={12} strokeWidth={4} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <button onClick={() => setShowNotifications(true)} className="relative hover:bg-gray-200 p-1 rounded-full transition-colors">
            <Bell size={22} />
            <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button onClick={logout} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"><LogOut size={18} /></button>
        </div>
      </header>

      <div className="p-5">
        {/* Rolling Banner */}
        <section 
          onClick={() => setSelectedEventId(currentBanner)}
          className="mb-8 relative h-36 rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        >
          <AnimatePresence mode="wait">
            {currentBanner === 0 && (
              <motion.div
                key="banner1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 flex items-center justify-between"
              >
                <div>
                  <span className="text-blue-100 font-bold text-sm mb-1 block">신규 입고 💙</span>
                  <p className="text-2xl font-black leading-tight drop-shadow-sm">치이카와<br/>블라인드 굿즈 등장!</p>
                </div>
                <div className="text-6xl drop-shadow-md">✨</div>
              </motion.div>
            )}
            {currentBanner === 1 && (
              <motion.div
                key="banner2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C] to-gray-800 text-white p-6 flex items-center justify-between"
              >
                <div>
                  <span className="text-red-400 font-bold text-sm mb-1 block">호러 특별전 🩸</span>
                  <p className="text-2xl font-black leading-tight drop-shadow-sm text-red-50">이토준지 컬렉션<br/>단독 픽업 중!</p>
                </div>
                <div className="text-6xl drop-shadow-md">👁️</div>
              </motion.div>
            )}
            {currentBanner === 2 && (
              <motion.div
                key="banner3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 text-white p-6 flex items-center justify-between"
              >
                <div>
                  <span className="text-yellow-200 font-bold text-sm mb-1 block">재입고 완료 🏁</span>
                  <p className="text-2xl font-black leading-tight drop-shadow-sm">혼다 NSX<br/>다이캐스트 입고!</p>
                </div>
                <div className="text-6xl drop-shadow-md">🏎️</div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 배너 인디케이터 */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
            {[0, 1, 2].map(idx => (
              <div key={idx} className={`w-2 h-2 rounded-full transition-all ${currentBanner === idx ? 'bg-white w-4' : 'bg-white/50'}`} />
            ))}
          </div>
        </section>

        {/* Product List */}
        <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tight flex items-center gap-2">
          <span>🔥</span> 현재 진행중인 가챠
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* 무한 스크롤 옵저버 타겟 */}
        {visibleCount < products.length && (
          <div ref={observerTarget} className="w-full py-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#FFFF00]" />
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2] to-transparent pointer-events-none z-40">
        <button 
          onClick={drawGacha}
          disabled={points < 3000}
          className="w-full bg-gradient-to-r from-[#FFEB00] to-[#FFD500] pointer-events-auto text-black font-black text-[1.35rem] py-5 rounded-[2rem] shadow-[0_8px_0_#D9B300,0_15px_25px_rgba(255,213,0,0.4)] hover:shadow-[0_6px_0_#D9B300,0_10px_15px_rgba(255,213,0,0.4)] hover:translate-y-1 active:shadow-[0_0px_0_#D9B300] active:translate-y-2 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span className="text-3xl group-hover:animate-bounce">🎁</span> 
          <span>두근두근 선물상자 열기</span> 
          <span className="bg-black text-[#FFFF00] text-sm px-3 py-1 rounded-xl font-black ml-1 tracking-wider shadow-inner">3,000P</span>
        </button>
      </div>

      {/* Draw Modal */}
      <DrawModal />

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Notification Modal */}
      <NotificationModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Charge Modal */}
      <ChargeModal isOpen={showChargeModal} onClose={() => setShowChargeModal(false)} />

      {/* Event Modal */}
      <EventModal isOpen={selectedEventId !== null} onClose={() => setSelectedEventId(null)} eventId={selectedEventId} />
    </main>
  );
}
