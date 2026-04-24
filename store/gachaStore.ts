import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Grade = 'legendary' | 'epic' | 'rare' | 'common';

export const gradeProbabilities: Record<Grade, number> = {
  legendary: 2,
  epic: 13,
  rare: 30,
  common: 55
};

export interface Product {
  id: string;
  name: string;
  grade: Grade;
  price: number;
  stock: number;
  image: string; 
  description?: string;
  specs?: string;
}

interface User {
  duckId: string;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'notice' | 'reward' | 'event';
}

interface GachaState {
  user: User | null;
  points: number;
  products: Product[];
  selectedProduct: Product | null;
  drawResult: Product | null;
  isDrawing: boolean;
  login: (duckId: string) => void;
  logout: () => void;
  selectProduct: (product: Product | null) => void;
  setPoints: (points: number) => void;
  chargePoints: (points: number) => void;
  updateShippingAddress: (address: { name: string; phone: string; address: string }) => void;
  drawGacha: () => void;
  resetDraw: () => void;
}

const baseProducts: Product[] = [
  { 
    id: 'base-1', name: '이토준지♡산리오 도트백', grade: 'legendary', price: 8000, stock: 200, image: '/images/image1.jpg',
    specs: '크기: 35x40cm / 재질: 캔버스 100% / 제조: 산리오 공식 콜라보',
    description: '이토준지의 기괴함과 산리오의 큐트함이 만난 혼종의 끝판왕! 들고 다니는 순간 홍대 길거리 시선 강탈, 내 안의 흑염룡이 눈을 뜬다... 진정한 광기의 덕후라면 무조건 소장해야 할 레전더리 아이템! 👁️🎀'
  },
  { 
    id: 'base-2', name: 'Honda 호일 키홀더 NSX', grade: 'epic', price: 7000, stock: 200, image: '/images/image2.jpg',
    specs: '크기: 4.5cm / 재질: 다이캐스트 메탈 / 공식 라이선스 제품',
    description: 'VTEC 엔진 소리가 들리지 않나요? 차쟁이들의 심장을 울리는 리얼 JDM 갬성. 밋밋한 에어팟 케이스에 이거 하나 달아주면 내 방구석이 스즈카 서킷이 되는 마법. 마력 10 상승 체감 보장! 🏎️💨'
  },
  { 
    id: 'base-3', name: '하이큐!! 라이트업 포스터', grade: 'rare', price: 6000, stock: 200, image: '/images/image3.jpg',
    specs: '크기: A3 / 특징: LED 백라이트 내장 (건전지 미포함)',
    description: '카라스노의 비상이 내 방에서 펼쳐진다! 밤에 불을 끄고 포스터를 켜는 순간, 그날의 땀과 눈물이 눈앞에 스쳐지나갑니다. 오타쿠의 심장을 찢는 영롱함에 매일 밤 눈물 흘릴 준비 완료 ㅠㅠ 🏐✨'
  },
  { 
    id: 'base-4', name: '버블탕 블루록', grade: 'rare', price: 6000, stock: 200, image: '/images/image4.jpg',
    specs: '입욕제 1구 + 랜덤 미니 피규어 1종 / 향: 아쿠아 마린',
    description: '에고이스트들의 뜨거운 열기가 내 집 욕조로! 피로에 찌든 나를 씻겨주는 11인의 스트라이커들. 욕조에서 피규어 튀어나올 때 도파민 터지는 거 아시죠? 이거 없으면 목욕 못함 ㄹㅇ 🛁⚽'
  },
  { 
    id: 'base-5', name: '산리오 헬로키티 피규어', grade: 'common', price: 4000, stock: 200, image: '/images/image5.jpg',
    specs: '크기: 6cm / 재질: PVC',
    description: '근본 중의 근본! 방구석 한편에 올려두면 그곳이 바로 하라주쿠. 쳐다볼 때마다 내 안의 핑크빛 소녀 감성이 1000% 충전되는 절대 힐링템. 헬로키티는 배신하지 않습니다. 🎀💖'
  },
  { 
    id: 'base-6', name: '단다단 러버 스트랩', grade: 'common', price: 4000, stock: 100, image: '/images/image6.jpg',
    specs: '크기: 5.5cm / 재질: 고무(러버) / 볼체인 포함',
    description: '요괴와 외계인이 공존하는 미친 세계관을 내 가방에! 이걸 달면 당장이라도 오컬트 현상이 일어날 것만 같은 심장 쫄깃한 아이템. 2026년 폼 미친 단다단, 덕력 수직 상승 확정템! 👽👻'
  },
];

const mockProducts: Product[] = Array.from({ length: 30 }).map((_, i) => {
  const base = baseProducts[i % 6];
  return {
    ...base,
    id: `DKS-${String(i + 1).padStart(3, '0')}`,
    name: i < 6 ? base.name : `${base.name} (Vol.${Math.floor(i / 6) + 1})`
  };
});

const mockNotifications: NotificationItem[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `noti-${i}`,
  title: i === 0 ? '🎉 회원가입 환영!' : i % 3 === 0 ? '✨ 신규 가챠 오픈' : i % 3 === 1 ? '🎁 출석 포인트 지급' : '⚠️ 공지사항',
  message: i === 0 
    ? '덕스클럽 가챠 시스템에 오신 것을 환영합니다! 가입 축하 10,000P가 지급되었습니다.'
    : i % 3 === 0 
      ? '치이카와 블라인드 굿즈가 새로 입고되었습니다. 지금 바로 가챠를 돌려보세요!'
      : i % 3 === 1 
        ? '오늘도 방문해주셨군요! 보너스 500P가 지급되었습니다.'
        : '안정적인 서비스 제공을 위해 점검이 진행될 예정입니다. (추후 공지)',
  date: `2026-04-${String(24 - Math.floor(i / 2)).padStart(2, '0')}`,
  isRead: i > 2, // 처음 3개는 안읽음 처리
  type: i === 0 ? 'reward' : i % 3 === 0 ? 'event' : i % 3 === 1 ? 'reward' : 'notice'
}));

export const useGachaStore = create<GachaState>()(
  persist(
    (set, get) => ({
      user: null,
      points: 0,
      products: mockProducts,
      notifications: mockNotifications,
      selectedProduct: null,
      drawResult: null,
      isDrawing: false,
      login: (duckId) => {
        // Mock register/login: gives 10000 points on fresh login
        set({ user: { duckId }, points: 10000 });
      },
      logout: () => set({ user: null, points: 0, drawResult: null }),
      selectProduct: (product) => set({ selectedProduct: product }),
      setPoints: (points) => set({ points }),
      chargePoints: (pointsToAdd) => set((state) => ({ points: state.points + pointsToAdd })),
      updateShippingAddress: (address) => set((state) => ({ 
        user: state.user ? { ...state.user, shippingAddress: address } : null 
      })),
      drawGacha: () => {
        const state = get();
        if (state.points < 3000) return; // 1회 3000P 고정으로 가정

        set({ isDrawing: true, points: state.points - 3000 });

        // Probability logic using gradeProbabilities
        const r = Math.random() * 100;
        let selectedGrade: Grade = 'common';
        if (r < gradeProbabilities.legendary) selectedGrade = 'legendary';
        else if (r < gradeProbabilities.legendary + gradeProbabilities.epic) selectedGrade = 'epic';
        else if (r < gradeProbabilities.legendary + gradeProbabilities.epic + gradeProbabilities.rare) selectedGrade = 'rare';

        const candidates = state.products.filter(p => p.grade === selectedGrade);
        const result = candidates[Math.floor(Math.random() * candidates.length)] || state.products[0];

        // Simulate network and animation delay
        setTimeout(() => {
          set({ drawResult: result, isDrawing: false });
        }, 2000);
      },
      resetDraw: () => set({ drawResult: null })
    }),
    {
      name: 'ducksgacha-storage',
      // We don't need to persist isDrawing or drawResult
      partialize: (state) => ({ user: state.user, points: state.points }),
    }
  )
);
