'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Gift, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  eventId: number | null;
}

const eventDetails = [
  {
    id: 0,
    title: '치이카와 블라인드 굿즈\n전면 등장!',
    subtitle: '신규 입고 💙',
    visualBg: 'bg-gradient-to-br from-blue-600 to-blue-400',
    emoji: '✨',
    date: '2026.04.24 ~ 소진 시까지',
    content: `
      오래 기다리셨습니다! 일본 현지에서도 구하기 힘든 **치이카와(먼작귀) 한정판 블라인드 굿즈**가 덕스가챠에 전면 입고되었습니다. 
      
      이번 라인업에는 시크릿 디자인 2종이 포함되어 있으며, 가챠 확률업 이벤트가 함께 진행됩니다. 치이카와, 하치와레, 우사기 등 귀여운 친구들을 지금 바로 만나보세요!
    `,
    notices: ['1인당 1일 최대 5회까지만 픽업 가능합니다.', '한정 수량으로 조기 품절될 수 있습니다.']
  },
  {
    id: 1,
    title: '이토준지 호러 컬렉션\n단독 픽업 중!',
    subtitle: '호러 특별전 🩸',
    visualBg: 'bg-gradient-to-br from-[#0A0A0C] to-gray-800',
    emoji: '👁️',
    date: '2026.04.20 ~ 2026.05.10',
    content: `
      여름이 오기 전, 미리 만나는 서늘한 공포! **이토준지 호러 컬렉션 단독 픽업**이 시작되었습니다.
      
      토미에 한정판 아크릴 스탠드부터 소이치 저주 인형까지, 당신의 등골을 오싹하게 만들 오리지널 굿즈들이 준비되어 있습니다. 기간 한정으로만 등장하는 기괴하고 매력적인 컬렉션을 절대 놓치지 마세요.
    `,
    notices: ['임산부 및 노약자는 가챠 시 주의가 필요합니다(?)', '픽업 기간 종료 후 일반 라인업으로 편입되지 않습니다.']
  },
  {
    id: 2,
    title: '혼다 NSX\n다이캐스트 입고!',
    subtitle: '재입고 완료 🏁',
    visualBg: 'bg-gradient-to-br from-red-600 to-orange-500',
    emoji: '🏎️',
    date: '상시 진행 (재고 소진 시까지)',
    content: `
      차쟁이들의 심장을 울리는 리얼 JDM의 전설! **Honda NSX 1:64 정밀 다이캐스트**가 드디어 재입고 되었습니다.
      
      지난 1차 입고 시 5분 만에 완판되었던 바로 그 전설의 아이템. 영롱한 호일 데칼과 완벽한 디테일을 자랑합니다. 이번 2차 입고 물량은 넉넉히 준비했으니, VTEC 엔진의 감성을 방구석에서 느껴보세요!
    `,
    notices: ['가챠 10회 연속 진행 시, 자동차 관련 굿즈 당첨 확률이 2배 증가합니다.', '실제 자동차는 드리지 않습니다.']
  }
];

export default function EventModal({ isOpen, onClose, eventId }: Props) {
  const event = eventId !== null ? eventDetails[eventId] : null;

  return (
    <AnimatePresence>
      {isOpen && event && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-[#FAF7F2] flex flex-col max-w-md mx-auto overflow-hidden"
        >
          {/* 닫기 버튼 */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] bg-black/40 text-white p-2 rounded-full backdrop-blur-md"
          >
            <X size={24} />
          </button>

          {/* 상단 비주얼 영역 (이벤트 느낌 강조) */}
          <div className={`w-full h-[45%] relative flex flex-col justify-center px-8 ${event.visualBg}`}>
            <div className="absolute right-0 bottom-0 text-[10rem] opacity-20 transform translate-x-10 translate-y-10 leading-none">
              {event.emoji}
            </div>
            <div className="relative z-10">
              <span className="inline-block bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-4">
                {event.subtitle}
              </span>
              <h2 className="text-3xl font-black text-white leading-tight drop-shadow-md whitespace-pre-line">
                {event.title}
              </h2>
            </div>
          </div>

          {/* 하단 텍스트(이벤트 내용) 영역 */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 mb-0.5">이벤트 기간</h3>
                <p className="text-sm font-bold text-gray-800">{event.date}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <Gift className="text-[#FFEB00]" /> 이벤트 상세 안내
              </h3>
              <div className="text-gray-700 leading-relaxed font-medium text-sm whitespace-pre-line space-y-4">
                {event.content}
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5">
              <h3 className="text-gray-500 font-bold text-xs tracking-wider mb-3 flex items-center gap-1.5">
                <AlertCircle size={14} /> 유의사항
              </h3>
              <ul className="list-disc pl-4 space-y-2 text-xs text-gray-600 font-medium break-keep">
                {event.notices.map((notice, idx) => (
                  <li key={idx}>{notice}</li>
                ))}
              </ul>
            </div>
            
            {/* 스크롤 여백 */}
            <div className="h-10" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
