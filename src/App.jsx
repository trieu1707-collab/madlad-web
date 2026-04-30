import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Calendar, MapPin, Phone, CheckCircle, 
  MonitorPlay, Gamepad2, Bath, ChevronRight, Info,
  Bike, Map, AlertTriangle, Sparkles, ArrowUpRight,
  ShoppingCart, Plus, Minus, Trash2, UtensilsCrossed, ArrowLeft, ArrowRight, BedDouble, Clock, QrCode, User, Search, Shirt,
  Filter, ChevronDown, UploadCloud, ImageIcon, Settings, Lock, Edit, PlayCircle
} from 'lucide-react';

// --- FIREBASE CLOUD STORAGE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// ============================================================================
// 🏦 CẤU HÌNH TÀI KHOẢN NGÂN HÀNG (VIETQR / SEPAY)
// ============================================================================
const ROOM_BANK_NAME = 'VietinBank'; // Ngân hàng nhận tiền ĐẶT PHÒNG
const ROOM_BANK_ACC = '106003101665'; // Số tài khoản nhận tiền ĐẶT PHÒNG
const ROOM_BANK_OWNER = 'NGUYEN THI MINH CHI'; // Tên chủ tài khoản (Viết HOA không dấu)

const FOOD_BANK_NAME = 'BIDV'; // Ngân hàng nhận tiền ĐỒ ĂN
const FOOD_BANK_ACC = '8858095547'; // Số tài khoản nhận tiền ĐỒ ĂN
const FOOD_BANK_OWNER = 'HO KINH DOANH MAD STATION'; // Tên chủ tài khoản (Viết HOA không dấu)
// ============================================================================

// --- KHỞI TẠO CLOUD DATABASE ---
let db, auth, appId;
try {
  const LOCAL_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBsYRhkHpybjB822e9viDxS_gFb-YQedow",
    authDomain: "madlad-space.firebaseapp.com",
    projectId: "madlad-space",
    storageBucket: "madlad-space.firebasestorage.app",
    messagingSenderId: "826338141212",
    appId: "1:826338141212:web:a72fec438e972178792bd9"
  };

  const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config
    ? JSON.parse(__firebase_config) 
    : LOCAL_FIREBASE_CONFIG;

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  appId = typeof __app_id !== 'undefined' ? __app_id : 'madlad-space-local';
} catch (error) {
  console.error('Lỗi khởi tạo hệ thống Cloud:', error);
}

// --- LIQUID BACKGROUND ---
const LiquidBackground = ({ opacity }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 300; const h = canvas.height = 300;
    const blobs = [
      { x: w * 0.3, y: h * 0.4, r: 80, dx: 0.5, dy: 0.3, color: '#111' },
      { x: w * 0.7, y: h * 0.3, r: 60, dx: -0.4, dy: 0.5, color: '#1a1a1a' },
      { x: w * 0.5, y: h * 0.8, r: 100, dx: 0.3, dy: -0.4, color: '#111' }
    ];

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      blobs.forEach(b => {
        b.x += b.dx; b.y += b.dy;
        if (b.x < -b.r || b.x > w + b.r) b.dx *= -1;
        if (b.y < -b.r || b.y > h + b.r) b.dy *= -1;
        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        gradient.addColorStop(0, b.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, transition: 'opacity 0.7s ease', opacity: opacity }} className="pointer-events-none">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', filter: 'blur(50px) scale(1.1)', transformOrigin: 'center' }} />
    </div>
  );
};

// --- DATA MẶC ĐỊNH ĐÃ ĐƯỢC KHÔI PHỤC HOÀN TOÀN ---
const DEFAULT_ROOMS = [
  {
    id: 'studio', order: 1, name: 'HẠNG STUDIO', concept: 'Vũ trụ & Giải trí', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', priceFrom: '500.000 - 600.000',
    features: ['Máy chiếu 4K, app phim độc quyền', 'Phòng tắm riêng, bàn ủi', 'Board game đa dạng', 'Bếp riêng đầy đủ đồ'],
    description: 'Không gian giải trí đỉnh cao với tiện ích chung gồm máy chiếu, bếp riêng và board game.',
    subRooms: [
      { 
        id: 'studio-sun', name: 'Phòng Sun', price: '500.000 - 600.000', bed: '2 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Game Nintendo, bồn tắm, ban công', 'Diện tích 20m2', 'Máy chiếu Netflix, Youtube Premium...', 'Bếp riêng: gia vị, xoong nồi, bếp từ...', 'Phòng tắm riêng, máy sấy tóc, bàn ủi', 'Board Game: Drinking Card, Cá sấu...'],
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      { 
        id: 'studio-pluto', name: 'Phòng Pluto', price: '500.000 - 600.000', bed: '2 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1598928506311-c55dd1b31526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Game PS4, Bàn bida, Vô lăng giả lập', 'Diện tích 25m2', 'Máy chiếu Netflix, Youtube Premium...', 'Bếp riêng: gia vị, xoong nồi, bếp từ...', 'Phòng tắm riêng, máy sấy tóc, bàn ủi', 'Board Game: Drinking Card, Cá sấu...'],
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 'concept-plus', order: 2, name: 'HẠNG CONCEPT PLUS', concept: 'Nghệ thuật & Mở rộng', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', priceFrom: '400.000',
    features: ['Máy chiếu FullHD', 'App phim độc quyền', 'Bếp mini riêng', 'Ghế sofa, Máy PS4'],
    description: 'Sự nâng cấp tuyệt vời với không gian rộng rãi hơn, trang bị máy chiếu FullHD, app phim rạp độc quyền, bếp mini và máy game PS4 giải trí cực đã.',
    subRooms: [
      { 
        id: 'cplus-mercury', name: 'Phòng Mercury', price: '400.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa, Máy PS4'],
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 'concept', order: 3, name: 'HẠNG CONCEPT', concept: 'Ấm áp & Chữa lành', image: 'https://images.unsplash.com/photo-1598928506311-c55dd1b31526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', priceFrom: '300.000 - 350.000',
    features: ['Máy chiếu FullHD', 'App phim chiếu rạp', 'Bếp riêng mini', 'Diện tích 13-15m2'],
    description: 'Một trạm dừng chân ấm áp. Tận hưởng trọn vẹn tiện ích từ máy chiếu FullHD, app phim độc quyền, bếp mini riêng và board game trong không gian từ 13m2 - 15m2.',
    subRooms: [
      { 
        id: 'concept-jupiter', name: 'Phòng Jupiter', price: '300.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game', 'Kích thước phòng: 13m2'],
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      { 
        id: 'concept-mars', name: 'Phòng Mars', price: '350.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa', 'Kích thước phòng: 15m2'],
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      { 
        id: 'concept-moon', name: 'Phòng Moon', price: '350.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa', 'Kích thước phòng: 15m2'],
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      { 
        id: 'concept-venus', name: 'Phòng Venus', price: '350.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa', 'Kích thước phòng: 15m2'],
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      { 
        id: 'concept-uranus', name: 'Phòng Uranus', price: '300.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game', 'Kích thước phòng: 13m2'],
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 'basic', order: 4, name: 'HẠNG PHÒNG BASIC', concept: 'Tối giản & Tiện nghi', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', priceFrom: '270.000',
    features: ['Máy chiếu HD', 'Netflix & Youtube', 'NVS riêng, máy sấy', 'Kích thước 13m2'],
    description: 'Sự lựa chọn hoàn hảo cho những chuyến lưu trú ngắn ngày.',
    subRooms: [
      { 
        id: 'basic-earth', name: 'Phòng Earth', price: '270.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu HD', 'App phim Netflix và Youtube', 'Nhà vệ sinh riêng, máy sấy tóc', 'Kích thước phòng: 13m2'],
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  }
];

const DEFAULT_SNACKS = [
  { id: 'sb1', category: 'Snack bịch', name: 'Snack Khoai Tây O\'Star', desc: 'Khoai tây chiên giòn vị tự nhiên', price: 20000, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'sb2', category: 'Snack bịch', name: 'Snack Bắp Ngọt Swing', desc: 'Giòn rụm, vị bắp bơ sữa thơm lừng', price: 20000, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 's12-1', category: 'Snack 12k', name: 'Đậu Phộng Tân Tân', desc: 'Hạt giòn béo ngậy, nhắm bia cực cuốn', price: 12000, image: 'https://images.unsplash.com/photo-1600115504107-1604a112cd53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const SERVICES = [
  { title: 'Order đồ ăn tận phòng', desc: 'Menu đa dạng, order trực tiếp trên web và được nhân viên mang lên tận phòng nhanh chóng.', icon: UtensilsCrossed, isClickable: true },
  { title: 'Thuê xe di chuyển', desc: 'Xe số: 120k/ngày — Xe ga: 150k/ngày. Giao nhận tận nơi.', icon: Bike },
  { title: 'Decor Anniversary, Sinh nhật', desc: 'Hỗ trợ setup không gian lãng mạn, sinh nhật, kỷ niệm theo yêu cầu.', icon: Sparkles },
  { title: 'Dịch vụ giặt sấy', desc: '20.000vnđ/kg. Xử lý nhanh chóng, sấy khô thơm tho, giao tận phòng.', icon: Shirt },
];

const RULES = [
  { fee: '150K', text: 'Nếu check out không rửa chén' },
  { fee: '50K+', text: 'Tháo dỡ, di chuyển đồ đạc. Đền bù nếu làm hư hỏng.' },
  { fee: '100K+', text: 'Vết bẩn khó giặt trên ga, gối. Đền mới nếu rách, cháy.' },
  { fee: '500K', text: 'Tự ý dẫn thêm bạn ở qua đêm không báo trước' },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours24 = Math.floor(i / 2);
  const h24Str = hours24.toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return { value: `${h24Str}:${m}`, label: `${h24Str}:${m}` };
});

const generateBookingCode = () => 'MDL' + Math.floor(10000 + Math.random() * 90000).toString();

const generatePasscode = (dob) => {
  if (!dob) return Math.floor(1000 + Math.random() * 9000).toString() + '#';
  const cleanDob = dob.replace(/\D/g, ''); 
  if (cleanDob.length === 8) {
    // Lấy Ngày Tháng + Năm sinh (bỏ đi số thứ 2) => DDMM Y(Y)YY => 1707 2(0)00 => 1707200#
    return `${cleanDob.slice(0,4)}${cleanDob[4]}${cleanDob.slice(6,8)}#`;
  }
  return Math.floor(1000 + Math.random() * 9000).toString() + '#';
};

const getNextDay = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

// --- COMPONENT THÔNG BÁO PASSCODE HIỆU LỰC ---
const PasscodeStatus = ({ isoStart, timeIn, dateIn }) => {
  const [isEffective, setIsEffective] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date().getTime();
      const startTime = new Date(isoStart).getTime();
      setIsEffective(now >= startTime);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, [isoStart]);

  const formattedDate = dateIn ? `${dateIn.slice(-2)}/${dateIn.slice(5,7)}/${dateIn.slice(0,4)}` : '';

  return (
    <div className="mb-3 border-b border-white/5 pb-3">
      {isEffective ? (
        <p className="text-[11px] font-bold text-green-400 flex items-center gap-1.5 uppercase tracking-widest">
          <CheckCircle size={14} /> Pass cửa đã có hiệu lực
        </p>
      ) : (
        <p className="text-[11px] font-bold text-red-400 flex items-start gap-1.5 uppercase tracking-widest leading-relaxed">
          <Clock size={14} className="shrink-0 mt-0.5" /> 
          <span>Pass cửa sẽ có hiệu lực vào {timeIn} ngày {formattedDate}</span>
        </p>
      )}
    </div>
  );
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [customDialog, setCustomDialog] = useState({ isOpen: false, type: 'alert', message: '', onConfirm: null });

  // --- CLOUD STATE ---
  const [fbUser, setFbUser] = useState(null); 
  const [bookingsDb, setBookingsDb] = useState([]);
  const [accountsDb, setAccountsDb] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({ holidayStart: '', holidayEnd: '', surchargeHourlyPct: '', surchargeDailyVnd: '' });
  const [snacksDb, setSnacksDb] = useState([]);
  const [roomsDb, setRoomsDb] = useState([]); 
  const bookingsDbRef = useRef(bookingsDb);

  // --- APP STATE ---
  const [currentUser, setCurrentUser] = useState(null); 
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', dob: '', phone: '', cccdImage: null });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [authState, setAuthState] = useState({ isOpen: false, view: 'login' });
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);

  const todayDateObj = new Date();
  const minDateStr = todayDateObj.toISOString().split('T')[0];
  const nextMonthDateObj = new Date(todayDateObj.getFullYear(), todayDateObj.getMonth() + 2, 0); 
  const maxDateStr = nextMonthDateObj.toISOString().split('T')[0];

  const [bookingForm, setBookingForm] = useState({ type: 'hourly', dateIn: minDateStr, timeIn: '', dateOut: minDateStr, timeOut: '', guests: 2 });
  const [bookingView, setBookingView] = useState('form'); 
  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchSummary, setSearchSummary] = useState({ text: '', duration: 0 });
  const [selectedBookingRoom, setSelectedBookingRoom] = useState(null);
  const [guestInfo, setGuestInfo] = useState({ name: '', dob: '', phone: '', cccdImage: null });
  const [finalBookingData, setFinalBookingData] = useState(null);
  const [pendingBookingCode, setPendingBookingCode] = useState('');
  const [pendingFoodOrderId, setPendingFoodOrderId] = useState('');

  const [guestFormError, setGuestFormError] = useState(''); 
  const [authFormError, setAuthFormError] = useState(''); 
  const [isCheckingCCCD, setIsCheckingCCCD] = useState(false);

  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartView, setCartView] = useState('cart'); 
  const [selectedFoodRoom, setSelectedFoodRoom] = useState(''); 
  const [foodPaymentMethod, setFoodPaymentMethod] = useState('cash'); 
  const [addedItemId, setAddedItemId] = useState(null); 
  const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
  const [activeFoodCategory, setActiveFoodCategory] = useState('Tất cả');
  const [isFoodCategoryOpen, setIsFoodCategoryOpen] = useState(false);

  // --- ADMIN STATE ---
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminView, setAdminView] = useState('login'); 
  const [adminLogin, setAdminLogin] = useState({ email: '', password: '' });
  const [viewingAdminBooking, setViewingAdminBooking] = useState(null);
  const [manualBookingForm, setManualBookingForm] = useState({ roomKey: '', roomName: '', categoryName: '', guestName: 'Khách FB/Zalo', dateIn: '', timeIn: '14:00', dateOut: '', timeOut: '12:00', youtubeLink: '' });
  const [snackForm, setSnackForm] = useState({ category: '', name: '', desc: '', price: '', image: null });
  const [editingSnackId, setEditingSnackId] = useState(null); 
  const [adminSearchQuery, setAdminSearchQuery] = useState(''); 
  const [adminFilterCategory, setAdminFilterCategory] = useState('Tất cả'); 
  const [roomEditMode, setRoomEditMode] = useState(null); 
  const [activeAdminCategory, setActiveAdminCategory] = useState(null); 
  const [roomCatForm, setRoomCatForm] = useState({ name: '', concept: '', priceFrom: '', description: '', features: '', image: null, order: 0, price2h: '', price3h: '', price4h: '', price5h: '', price6h: '', price7h: '', price8h: '', price9h: '', price10h: '', price30m: '', surchargeEarly: '', surchargeLate: '' });
  const [subRoomForm, setSubRoomForm] = useState({ id: '', name: '', price: '', bed: '', amenities: '', image: null, image2: null, image3: null, status: 'Trống', youtubeLink: '' });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSubRoomId, setEditingSubRoomId] = useState(null);

  // --- ANIMATION STATE ---
  const heroSectionRef = useRef(null);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [showLiquidBg, setShowLiquidBg] = useState(true);

  const activeRooms = roomsDb.length > 0 ? roomsDb : DEFAULT_ROOMS;
  const dynamicCategories = ['Tất cả', ...Array.from(new Set(snacksDb.map(s => s.category || 'Khác')))];
  const allSubRoomsFlat = activeRooms.reduce((acc, cat) => acc.concat((cat.subRooms || []).map(r => ({...r, categoryName: cat.name}))), []);

  const filteredAdminSnacks = snacksDb.filter(snack => {
    const cat = snack.category || '';
    const name = snack.name || '';
    return (adminFilterCategory === 'Tất cả' || cat === adminFilterCategory) && name.toLowerCase().includes((adminSearchQuery || '').toLowerCase());
  });

  const showAlert = (message) => setCustomDialog({ isOpen: true, type: 'alert', message, onConfirm: null });
  const showConfirm = (message, onConfirm) => setCustomDialog({ isOpen: true, type: 'confirm', message, onConfirm });

  // --- FIREBASE AUTH INIT ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error("Lỗi đăng nhập Cloud:", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setFbUser);
    return () => unsubscribe();
  }, []);

  // --- DATA SYNC ---
  useEffect(() => {
    if (!fbUser || !db) return;
    const unsubBookings = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings'), (snapshot) => setBookingsDb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))), () => {});
    const unsubAccounts = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'madlad_accounts'), (snapshot) => setAccountsDb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))), () => {});
    const unsubMenu = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'madlad_menu'), (snapshot) => setSnacksDb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))), () => {});
    const unsubRooms = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms'), (snapshot) => setRoomsDb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.order - b.order)), () => {});
    const unsubSettings = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_settings', 'global'), (docSnap) => { if (docSnap.exists()) setGlobalSettings(docSnap.data()); }, () => {});
    return () => { unsubBookings(); unsubAccounts(); unsubMenu(); unsubRooms(); unsubSettings(); };
  }, [fbUser]);

  useEffect(() => { bookingsDbRef.current = bookingsDb; }, [bookingsDb]);

  // --- TỰ ĐỘNG DỌN DẸP ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (!db || !fbUser) return;
      const now = new Date();
      bookingsDbRef.current.forEach(async (booking) => {
        if (new Date(booking.isoEnd) <= now) {
          try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings', booking.code)); } catch(e) {}
        }
      });
    }, 60000); 
    return () => clearInterval(interval);
  }, [fbUser]);

  // --- UI EFFECTS ---
  useEffect(() => {
    setTimeout(() => setIsHeroLoaded(true), 300);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowLiquidBg(window.scrollY <= 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!bookingModalOpen) {
      setBookingForm({ type: 'hourly', dateIn: minDateStr, timeIn: '', dateOut: minDateStr, timeOut: '', guests: 2 });
      setBookingView('form');
      setSelectedBookingRoom(null);
      setFinalBookingData(null);
      setPendingBookingCode('');
      setGuestFormError('');
      if (!currentUser) setGuestInfo({ name: '', dob: '', phone: '', cccdImage: null });
    }
  }, [bookingModalOpen, currentUser]);

  // --- LẮNG NGHE THANH TOÁN TỰ ĐỘNG ---
  useEffect(() => {
    if (bookingView === 'payment' && pendingBookingCode && db) {
      const unsub = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings', pendingBookingCode), (docSnap) => {
          if (docSnap.exists() && docSnap.data().status === 'success') {
            setFinalBookingData(docSnap.data());
            setBookingView('success');
          }
      }, () => {});
      return () => unsub(); 
    }
  }, [bookingView, pendingBookingCode, db]);

  useEffect(() => {
    if (cartView === 'payment' && pendingFoodOrderId && db) {
      const unsub = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_food_orders', pendingFoodOrderId), (docSnap) => {
          if (docSnap.exists() && docSnap.data().status === 'success') {
            showAlert('✅ Thanh toán đồ ăn tự động thành công! Mình chờ một lát, nhân viên sẽ mang lên tận phòng ạ.');
            setCart([]); setIsCartOpen(false); setCartView('cart'); setSelectedFoodRoom(''); setPendingFoodOrderId('');
          }
      }, () => {});
      return () => unsub();
    }
  }, [cartView, pendingFoodOrderId, db]);

  // --- SECURE ADMIN FUNCTIONS ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, adminLogin.email, adminLogin.password);
      setAdminView('select');
    } catch (error) {
      showAlert('Xác thực thất bại! Sai Email hoặc Mật khẩu.');
    }
  };

  const closeAdminModal = async () => {
    setIsAdminModalOpen(false);
    setAdminView('login');
    try {
      await signOut(auth);
      await signInAnonymously(auth);
    } catch (error) { console.error("Lỗi khi khôi phục quyền Guest:", error); }
  };

  // --- OCR AI & UPLOADS ---
  const extractDOBWithAI = async (base64Data) => {
    const apiKey = ""; 
    const prompt = `Bạn là AI đọc thẻ CCCD/CMND Việt Nam. Trích xuất Ngày sinh dạng DD/MM/YYYY. Nếu không phải thẻ, trả về INVALID.`;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }] }] })
      });
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "INVALID";
    } catch (e) { return "INVALID"; }
  };

  const handleImageUploadWithAI = async (e, setter, errorSetter) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsCheckingCCCD(true);
    errorSetter('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const scale = 800 / img.width;
        canvas.width = 800; canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, 800, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        const aiDob = await extractDOBWithAI(base64);
        setIsCheckingCCCD(false);
        if (aiDob === "INVALID" || aiDob.length < 8) {
          errorSetter("AI TỪ CHỐI: Ảnh không hợp lệ hoặc mờ.");
          e.target.value = '';
        } else {
          let cleanDob = aiDob.replace(/\D/g, '');
          if (cleanDob.length >= 8) cleanDob = `${cleanDob.slice(0,2)}/${cleanDob.slice(2,4)}/${cleanDob.slice(4,8)}`;
          const check = validateDobForm(cleanDob);
          if (check !== "OK") { errorSetter(`AI Cảnh báo: ${check}`); e.target.value = ''; }
          else { setter(prev => ({ ...prev, cccdImage: base64, dob: cleanDob })); }
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e, setter, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setter(prev => ({ ...prev, [field]: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  const validateDobForm = (dob) => {
    if (!dob || dob.length !== 10) return "Tải ảnh CCCD để quét ngày sinh.";
    const year = parseInt(dob.split('/')[2]);
    if (year > 2010) return "Hệ thống chỉ nhận năm sinh <= 2010.";
    return "OK";
  };

  const validatePhoneForm = (phone) => /^(03|05|07|08|09)\d{8}$/.test(phone);

  const handleBookingTypeChange = (type) => {
    let updates = { type };
    if (type === 'daily') { updates.timeIn = '14:00'; updates.timeOut = '12:00'; updates.dateOut = getNextDay(bookingForm.dateIn); } 
    else if (type === 'overnight') { updates.timeIn = '22:00'; updates.timeOut = '10:00'; updates.dateOut = getNextDay(bookingForm.dateIn); } 
    else if (type === 'hourly') { updates.guests = 2; updates.dateOut = bookingForm.dateIn; }
    setBookingForm(prev => ({ ...prev, ...updates }));
  };

  const getAvailableTimeOptions = () => {
    if (bookingForm.type !== 'hourly') return TIME_OPTIONS;
    if (bookingForm.dateIn !== minDateStr) return TIME_OPTIONS;
    const now = new Date(); now.setMinutes(now.getMinutes() + 30);
    const currH = now.getHours(), currM = now.getMinutes();
    return TIME_OPTIONS.filter(t => { const [h, m] = t.value.split(':').map(Number); return h > currH || (h === currH && m >= currM); });
  };

  // --- LOGIC TÌM PHÒNG ---
  const handleSearchRooms = async (e) => {
    e.preventDefault();
    if (bookingForm.type !== 'hourly' && bookingForm.dateIn === bookingForm.dateOut) return showAlert("Ngày nhận và ngày trả không được trùng nhau.");
    
    let durationText = '', diffDays = 1, exactHours = 0, exactMins = 0;
    if (bookingForm.type === 'hourly') {
      const [hIn, mIn] = bookingForm.timeIn.split(':').map(Number);
      const [hOut, mOut] = bookingForm.timeOut.split(':').map(Number);
      let diff = (hOut * 60 + mOut) - (hIn * 60 + mIn);
      if (diff <= 0) diff += 24 * 60;
      if (diff <= 120) { exactHours = 2; exactMins = 0; } 
      else { exactHours = Math.floor(diff / 60); exactMins = diff % 60; }
      durationText = exactMins > 0 ? `${exactHours} giờ 30 phút` : `${exactHours} giờ`;
    } else {
      if (!bookingForm.dateIn || !bookingForm.dateOut) return showAlert('Chọn đầy đủ ngày!');
      diffDays = Math.max(1, Math.ceil(Math.abs(new Date(bookingForm.dateOut) - new Date(bookingForm.dateIn)) / (1000 * 60 * 60 * 24)));
      durationText = `${diffDays} ${bookingForm.type === 'daily' ? 'ngày' : 'đêm'}`;
    }

    setSearchSummary({ text: durationText, duration: bookingForm.type === 'hourly' ? exactHours : diffDays });

    const dateOutVal = bookingForm.type === 'hourly' ? bookingForm.dateIn : bookingForm.dateOut;
    const startReqTime = new Date(`${bookingForm.dateIn}T${bookingForm.timeIn}:00+07:00`).getTime();
    const endReqTime = new Date(`${dateOutVal}T${bookingForm.timeOut}:00+07:00`).getTime();

    let isHoliday = false;
    if (globalSettings.holidayStart && globalSettings.holidayEnd) {
         const dIn = new Date(bookingForm.dateIn).getTime();
         const hStart = new Date(globalSettings.holidayStart).getTime();
         const hEnd = new Date(globalSettings.holidayEnd).getTime();
         if (dIn >= hStart && dIn <= hEnd) isHoliday = true;
    }

    const bookedRoomKeys = bookingsDb.filter(b => {
      const bStart = new Date(b.isoStart).getTime(), bEnd = new Date(b.isoEnd).getTime();
      return startReqTime < bEnd && bStart < endReqTime;
    }).map(b => b.roomKey); 

    let results = [];
    activeRooms.forEach(cat => {
      if(!cat.subRooms) return;
      cat.subRooms.forEach(room => {
        if (room.status === 'Trống') {
          const roomKey = room.id.split('-').pop().toLowerCase();
          let isActuallyFree = !bookedRoomKeys.includes(roomKey);

          if (isActuallyFree) {
            let price = 0; const type = bookingForm.type, guests = bookingForm.guests;
            if (cat.price2h && type === 'hourly') {
                const hourlyPrices = { 2: cat.price2h, 3: cat.price3h, 4: cat.price4h, 5: cat.price5h, 6: cat.price6h, 7: cat.price7h, 8: cat.price8h, 9: cat.price9h, 10: cat.price10h };
                let baseH = exactHours > 10 ? 10 : exactHours;
                price = Number(hourlyPrices[baseH] || 0) + (exactMins > 0 ? Number(cat.price30m || 0) : 0);
            } else {
                if (cat.id === 'studio') {
                  if (type === 'daily') price = (guests >= 3 ? 600000 : 500000) * diffDays;
                  else if (type === 'overnight') price = (guests >= 3 ? 500000 : 400000) * diffDays;
                  else { let p = 200000; if(exactHours>2)p+=(Math.min(exactHours,5)-2)*40000; if(exactHours>=6)p+=30000; if(exactHours>6)p+=(Math.min(exactHours,10)-6)*40000; price = Math.min(p, 450000); }
                } else if (cat.id === 'concept') {
                  const isPrem = ['concept-mars', 'concept-moon', 'concept-venus'].includes(room.id);
                  if (type === 'daily') price = (isPrem ? 350000 : 300000) * diffDays;
                  else if (type === 'overnight') price = (isPrem ? 280000 : 250000) * diffDays;
                  else { let p = 180000; if(exactHours>2)p+=(Math.min(exactHours,5)-2)*30000; if(exactHours>=6)p+=20000; if(exactHours>6)p+=(Math.min(exactHours,10)-6)*30000; price = Math.min(p, 350000); }
                } else if (cat.id === 'concept-plus') {
                  if (type === 'daily') price = 400000 * diffDays; else if (type === 'overnight') price = 350000 * diffDays;
                  else { let p = 190000; if(exactHours>2)p+=(Math.min(exactHours,5)-2)*35000; if(exactHours>=6)p+=50000; if(exactHours>6)p+=(Math.min(exactHours,10)-6)*35000; price = Math.min(p, 400000); }
                } else if (cat.id === 'basic') {
                  if (type === 'daily') price = 270000 * diffDays; else if (type === 'overnight') price = 230000 * diffDays;
                  else { let p = 140000; if(exactHours>2)p+=(Math.min(exactHours,5)-2)*20000; if(exactHours>=6)p+=10000; if(exactHours>6)p+=(Math.min(exactHours,10)-6)*20000; price = Math.min(p, 270000); }
                }
            }

            if ((type === 'daily' || type === 'overnight') && (cat.surchargeEarly || cat.surchargeLate)) {
                 const [hIn, mIn] = bookingForm.timeIn.split(':').map(Number);
                 const [hOut, mOut] = bookingForm.timeOut.split(':').map(Number);
                 let earlyMins = 0;
                 if (type === 'overnight' && hIn >= 6 && hIn < 22) earlyMins = (22 * 60) - (hIn * 60 + mIn);
                 else if (type === 'daily' && hIn >= 6 && hIn < 14) earlyMins = (14 * 60) - (hIn * 60 + mIn);
                 if (earlyMins > 0 && cat.surchargeEarly) price += Math.ceil(earlyMins / 60) * Number(cat.surchargeEarly);

                 let lateMins = 0;
                 if (type === 'overnight' && (hOut > 10 || (hOut === 10 && mOut > 0))) lateMins = (hOut * 60 + mOut) - (10 * 60);
                 else if (type === 'daily' && (hOut > 12 || (hOut === 12 && mOut > 0))) lateMins = (hOut * 60 + mOut) - (12 * 60);
                 if (lateMins > 0 && cat.surchargeLate) price += Math.ceil(lateMins / 60) * Number(cat.surchargeLate);
            }

            if (isHoliday) {
                 if (type === 'hourly') price += Math.round(price * (Number(globalSettings.surchargeHourlyPct || 0) / 100));
                 else price += Number(globalSettings.surchargeDailyVnd || 0) * diffDays;
            }

            if (guests >= 3 && cat.id !== 'studio') isActuallyFree = false;
            if (isActuallyFree) results.push({ ...room, categoryName: cat.name, totalPrice: price, youtubeLink: room.youtubeLink || '' });
          }
        }
      });
    });
    setAvailableRooms(results); setBookingView('results');
  };

  const createPendingDoc = async (code, guest, room) => {
    const passcode = generatePasscode(guest.dob);
    const dateOutVal = bookingForm.type === 'hourly' ? bookingForm.dateIn : bookingForm.dateOut;
    const data = {
      code, passcode, status: 'pending', roomName: room.name, categoryName: room.categoryName, roomKey: room.id.split('-').pop().toLowerCase(),
      totalPrice: room.totalPrice, guestData: guest, dateIn: bookingForm.dateIn, timeIn: bookingForm.timeIn,
      dateOut: dateOutVal, timeOut: bookingForm.timeOut, type: bookingForm.type, accountId: currentUser ? currentUser.username : 'guest',
      isoStart: `${bookingForm.dateIn}T${bookingForm.timeIn}:00+07:00`, isoEnd: `${dateOutVal}T${bookingForm.timeOut}:00+07:00`, 
      timestamp: new Date().toISOString(), youtubeLink: room.youtubeLink || ''
    };
    try { await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings', code), data); setFinalBookingData(data); } catch (err) {}
  };

  const handleSelectRoom = async (room) => {
    setSelectedBookingRoom(room);
    const code = generateBookingCode(); setPendingBookingCode(code);
    if (currentUser) { setGuestInfo(currentUser); await createPendingDoc(code, currentUser, room); setBookingView('payment'); } 
    else { setGuestFormError(''); setBookingView('guest_info'); }
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault(); setGuestFormError(''); 
    const dobCheck = validateDobForm(guestInfo.dob);
    if(dobCheck !== "OK") return setGuestFormError(dobCheck);
    if(!validatePhoneForm(guestInfo.phone)) return setGuestFormError("SĐT không hợp lệ (10 số).");
    if (!guestInfo.cccdImage) return setGuestFormError("Vui lòng tải ảnh CCCD.");
    await createPendingDoc(pendingBookingCode, guestInfo, selectedBookingRoom);
    setBookingView('payment');
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setAuthFormError('');
    const dobCheck = validateDobForm(registerForm.dob);
    if(dobCheck !== "OK") return setAuthFormError(dobCheck);
    if(!validatePhoneForm(registerForm.phone)) return setAuthFormError("SĐT không hợp lệ.");
    if(accountsDb.find(a => a.username === registerForm.username)) return setAuthFormError("Username đã tồn tại.");
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_accounts', registerForm.username), { ...registerForm, name: registerForm.username });
      showAlert('Đăng ký thành công!'); setAuthState({...authState, view: 'login'});
    } catch (err) {}
  };

  const handleLogin = (e) => {
    e.preventDefault(); setAuthFormError('');
    const u = accountsDb.find(a => a.username === loginForm.username && a.password === loginForm.password);
    if (u) { setCurrentUser(u); setAuthState({...authState, isOpen: false}); } else setAuthFormError("Sai thông tin.");
  };

  const handleSearchBooking = async (e) => {
    e.preventDefault(); setSearchResult(null);
    const kw = searchCode.toUpperCase();
    const founds = bookingsDb.filter(b => b.code.toUpperCase() === kw || b.guestData?.phone === kw);
    if (founds.length === 0) return setSearchResult({ status: 'error', message: 'Không tìm thấy vé đặt phòng!' });
    setSearchResult({ status: 'success', data: founds.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0] });
  };

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setAddedItemId(item.id); setTimeout(() => setAddedItemId(null), 800);
  };
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id===id ? {...i, qty: Math.max(1, i.qty+delta)} : i));
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const formatPrice = (p) => p?.toLocaleString('vi-VN') + 'đ';

  const handleFoodOrderSubmit = async (e) => {
    e.preventDefault(); 
    if (foodPaymentMethod === 'transfer') {
      const id = 'FD' + Date.now(); setPendingFoodOrderId(id);
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_food_orders', id), { id, roomName: selectedFoodRoom, items: cart.map(i=>`${i.name}(x${i.qty})`).join(', '), totalPrice: cartTotalPrice, status: 'pending' });
      setCartView('payment');
    } else {
       showAlert('Bạn chọn thanh toán Tiền mặt. Nhân viên sẽ mang lên tận phòng ạ!');
       setCart([]); setIsCartOpen(false); setCartView('cart'); setSelectedFoodRoom('');
    }
  };

  const handleManualBookingSubmit = async (e) => {
    e.preventDefault();
    const sTime = new Date(`${manualBookingForm.dateIn}T${manualBookingForm.timeIn}:00+07:00`).getTime();
    const eTime = new Date(`${manualBookingForm.dateOut}T${manualBookingForm.timeOut}:00+07:00`).getTime();
    if(eTime <= sTime) return showAlert('Giờ trả phải sau giờ nhận!');
    const isConflict = bookingsDb.some(b => b.roomKey === manualBookingForm.roomKey && sTime < new Date(b.isoEnd).getTime() && new Date(b.isoStart).getTime() < eTime);
    
    const processManual = async () => {
      const code = 'MANUAL-' + Date.now().toString().slice(-6);
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings', code), {
        code, passcode: 'N/A', accountId: 'admin_manual', guestData: { name: manualBookingForm.guestName, phone: 'N/A' },
        roomName: manualBookingForm.roomName, categoryName: manualBookingForm.categoryName, roomKey: manualBookingForm.roomKey,
        dateIn: manualBookingForm.dateIn, timeIn: manualBookingForm.timeIn, dateOut: manualBookingForm.dateOut, timeOut: manualBookingForm.timeOut,
        isoStart: `${manualBookingForm.dateIn}T${manualBookingForm.timeIn}:00+07:00`, isoEnd: `${manualBookingForm.dateOut}T${manualBookingForm.timeOut}:00+07:00`,
        type: 'manual', totalPrice: 0, timestamp: new Date().toISOString(), status: 'success', youtubeLink: manualBookingForm.youtubeLink || ''
      });
      showAlert('Đã chặn phòng!'); setManualBookingForm({ ...manualBookingForm, guestName: 'Khách FB/Zalo' });
    };
    if (isConflict) showConfirm('Phòng bị trùng lịch! Có chắc chắn chèn đè?', processManual); else processManual();
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-200 font-sans relative overflow-x-hidden selection:bg-[#D4FF00] selection:text-black">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-20"></div>

      {/* --- CUSTOM DIALOG --- */}
      {customDialog.isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCustomDialog({ ...customDialog, isOpen: false })}></div>
          <div className="bg-[#111] border border-white/20 p-6 rounded-2xl shadow-2xl relative z-10 max-w-sm w-full animate-in fade-in zoom-in-95">
            <h4 className="text-lg font-bold text-white mb-2">{customDialog.type === 'confirm' ? 'Xác nhận' : 'Thông báo'}</h4>
            <p className="text-sm text-zinc-300 mb-6">{customDialog.message}</p>
            <div className="flex justify-end gap-3">
              {customDialog.type === 'confirm' && <button onClick={() => setCustomDialog({ ...customDialog, isOpen: false })} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white">Hủy</button>}
              <button onClick={() => { if (customDialog.onConfirm) customDialog.onConfirm(); setCustomDialog({ ...customDialog, isOpen: false }); }} className="px-4 py-2 bg-[#D4FF00] text-black rounded-xl text-xs font-bold hover:bg-white transition-colors">Đồng ý</button>
            </div>
          </div>
        </div>
      )}

      {/* --- NAV --- */}
      <nav className={`fixed w-full z-50 transition-all ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black uppercase tracking-widest text-white">Madlad</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-10 items-center">
            <a href="#rooms" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Hạng phòng</a>
            <button onClick={() => setBookingModalOpen(true)} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Đặt Phòng</button>
            <button onClick={() => setIsFoodMenuOpen(true)} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"><UtensilsCrossed size={14}/> Đồ ăn</button>
            <button onClick={() => { setSearchModalOpen(true); setSearchCode(''); setSearchResult(null); }} className="text-zinc-400 hover:text-white transition-colors"><Search size={20}/></button>
            <button onClick={() => setIsCartOpen(true)} className="relative text-white hover:text-[#D4FF00] transition-colors"><ShoppingCart size={20}/>{cartTotalQty > 0 && <span className="absolute -top-2 -right-2 bg-[#D4FF00] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartTotalQty}</span>}</button>
            {currentUser ? (
              <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full cursor-pointer hover:border-[#D4FF00] transition-colors" onClick={() => showConfirm('Đăng xuất?', () => setCurrentUser(null))}>
                <User size={16} className="text-[#D4FF00]" /><span className="text-xs font-bold uppercase tracking-widest text-white">{currentUser.username}</span>
              </div>
            ) : (
              <button onClick={() => setAuthState({ isOpen: true, view: 'login', username:'', password:'' })} className="text-xs font-bold uppercase tracking-widest text-white border border-white/20 px-4 py-2 rounded-full hover:border-[#D4FF00] transition-colors">Đăng nhập</button>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => { setSearchModalOpen(true); setSearchCode(''); setSearchResult(null); }} className="text-zinc-400 hover:text-white"><Search size={20}/></button>
            <button onClick={() => setIsCartOpen(true)} className="relative px-3 py-1.5 border border-white/20 rounded-lg text-white hover:border-[#D4FF00] transition-colors flex items-center gap-1">
               <span className="text-[10px] font-bold uppercase tracking-widest">Đặt đồ ăn</span>
               {cartTotalQty > 0 && <span className="absolute -top-2 -right-2 bg-[#D4FF00] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartTotalQty}</span>}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-zinc-400 hover:text-white"><Menu size={24}/></button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 flex flex-col gap-6">
             <a href="#rooms" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-widest font-bold text-zinc-300">Hạng phòng</a>
             <button onClick={() => { setIsMenuOpen(false); setBookingModalOpen(true); }} className="text-left text-sm uppercase tracking-widest font-bold text-zinc-300 hover:text-[#D4FF00]">Đặt Phòng</button>
             <button onClick={() => { setIsMenuOpen(false); setIsFoodMenuOpen(true); }} className="text-left text-sm uppercase tracking-widest font-bold text-zinc-300 hover:text-[#D4FF00]">Đồ ăn & Thức uống</button>
             {currentUser ? (
               <button onClick={() => { setIsMenuOpen(false); showConfirm('Đăng xuất?', () => setCurrentUser(null)); }} className="text-left text-sm uppercase tracking-widest font-bold text-[#D4FF00]">Đăng xuất ({currentUser.username})</button>
             ) : (
               <button onClick={() => { setIsMenuOpen(false); setAuthState({ isOpen: true, view: 'login' }); }} className="text-left text-sm uppercase tracking-widest font-bold text-[#D4FF00]">Đăng nhập</button>
             )}
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section ref={heroSectionRef} id="hero" className="relative min-h-screen flex items-center justify-center px-6">
        <LiquidBackground opacity={showLiquidBg ? 0.3 : 0} />
        <div className="text-center relative z-10 flex flex-col items-center mt-[-5vh]">
          <div className="flex items-center gap-3 mb-6"><div className="w-8 h-px bg-[#D4FF00]"></div><span className="text-[10px] font-bold text-[#D4FF00] uppercase tracking-[0.4em]">MADLAD SPACE</span><div className="w-8 h-px bg-[#D4FF00]"></div></div>
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-white uppercase leading-[0.85] mb-2 drop-shadow-2xl">IT'S GOOD,</h1>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif italic text-zinc-400 font-light lowercase">because we care</h2>
          <button onClick={() => setBookingModalOpen(true)} className="mt-14 flex items-center gap-4 group">
             <span className="text-xs font-bold uppercase tracking-[0.2em] text-white group-hover:text-[#D4FF00] transition-colors">Đặt phòng ngay</span>
             <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#D4FF00] transition-colors"><ChevronRight size={16} className="text-white group-hover:text-[#D4FF00]"/></div>
          </button>
        </div>
      </section>

      {/* --- ROOMS --- */}
      <section id="rooms" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left"><h2 className="text-sm font-bold text-[#D4FF00] uppercase tracking-[0.3em] mb-4">Danh mục</h2><h3 className="text-4xl md:text-5xl font-black text-white uppercase">Hạng phòng</h3></div>
        <div className="space-y-32">
          {activeRooms.map((cat, idx) => (
            <div key={cat.id} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center group`}>
              <div className="w-full md:w-2/3 aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-3xl relative z-0"><img src={cat.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"/></div>
              <div className={`w-[90%] md:w-5/12 bg-[#050505]/90 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative z-10 -mt-16 md:mt-0 ${idx % 2 !== 0 ? 'md:-mr-20' : 'md:-ml-20'}`}>
                 <h4 className="text-3xl font-black uppercase text-white mb-4">{cat.name}</h4>
                 <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">{cat.description}</p>
                 <ul className="space-y-3 mb-8">
                   {(cat.features || []).map((f, i) => <li key={i} className="text-xs text-zinc-200 flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D4FF00] rounded-full shadow-[0_0_8px_#D4FF00]"></div>{f}</li>)}
                 </ul>
                 <button onClick={() => setSelectedCategory(cat)} className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 hover:text-[#D4FF00] transition-colors border-b border-white/20 hover:border-[#D4FF00]/50 pb-1">Xem chi tiết <ArrowUpRight size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <h2 className="text-sm font-bold text-[#D4FF00] uppercase tracking-[0.3em] mb-4">Madlad Space</h2>
        <h3 className="text-4xl md:text-5xl font-black text-white uppercase mb-16">Dịch vụ bổ trợ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((s, i) => {
            const SrvIcon = s.icon;
            return (
              <div key={i} onClick={() => s.isClickable && setIsFoodMenuOpen(true)} className={`p-8 bg-white/5 border border-white/10 rounded-3xl transition-all flex flex-col md:flex-row gap-6 ${s.isClickable ? 'cursor-pointer hover:border-[#D4FF00]/50 hover:bg-white/[0.08]' : ''}`}>
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"><SrvIcon size={28} className="text-[#D4FF00]"/></div>
                <div><h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">{s.title}</h4><p className="text-sm text-zinc-400 font-light leading-relaxed">{s.desc}</p></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- RULES --- */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-white/5 text-center">
        <h2 className="text-sm font-bold text-[#D4FF00] uppercase tracking-[0.3em] mb-4">Điều khoản lưu trú</h2>
        <h3 className="text-4xl md:text-5xl font-black text-white uppercase mb-16">Madlad Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-16">
          {RULES.map((r, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start gap-4">
               <span className="text-3xl font-black text-[#D4FF00] shrink-0 w-20">{r.fee}</span>
               <div className="w-px h-full bg-white/10"></div>
               <p className="text-sm text-zinc-300 font-light pt-2">{r.text}</p>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl text-left">
           <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2"><AlertTriangle size={16} className="text-[#D4FF00]"/> Quy chuẩn chung</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300 font-light leading-loose">
             <p>1. Nghiêm cấm tuyệt đối các hoạt động vi phạm pháp luật (ma túy, mại dâm, vũ khí...).</p>
             <p>2. Không gian phòng ngủ là khu vực không khói thuốc. Vui lòng hút thuốc đúng nơi quy định.</p>
             <p>3. Vui lòng hỗ trợ thu gom rác trước khi check-out.</p>
             <p>4. Không tự ý dán băng keo, phụ kiện trang trí trực tiếp lên bề mặt tường.</p>
           </div>
        </div>
      </section>

      {/* --- ROOM LIST MODAL --- */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedCategory(null)}></div>
          <div className="w-full max-w-5xl bg-[#0a0a0a] border border-white/20 shadow-2xl rounded-3xl relative z-10 animate-in fade-in overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-start shrink-0 bg-black/50">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">Danh sách phòng</h3>
                <h4 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">{selectedCategory.name}</h4>
              </div>
              <button onClick={() => setSelectedCategory(null)} className="text-zinc-500 hover:text-white p-2"><X size={24} /></button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(selectedCategory.subRooms || []).map((room) => (
                  <div key={room.id} className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4FF00]/40 transition-all group">
                    <div className="relative h-48 w-full overflow-hidden shrink-0"><img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                    <div className="p-5 flex flex-col flex-1 justify-between bg-black/20">
                      <div className="mb-4">
                        <div className="flex justify-between items-center gap-2">
                          <h5 className="text-lg font-bold text-white group-hover:text-[#D4FF00] transition-colors leading-tight line-clamp-2">{room.name}</h5>
                          <button onClick={() => setViewingRoom(room)} className="text-[8px] font-bold text-[#D4FF00] uppercase tracking-widest hover:underline flex items-center gap-1 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                            Chi tiết <ChevronRight size={10} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                        <p className="text-base font-serif italic text-[#D4FF00]">{room.price} VNĐ</p>
                        <button disabled={room.status !== 'Trống'} onClick={() => { setSelectedCategory(null); setBookingModalOpen(true); }} className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl ${room.status === 'Trống' ? 'bg-white text-black hover:bg-[#D4FF00]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}>Đặt Ngay</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ROOM DETAILS MODAL (Chi tiết phòng) --- */}
      {viewingRoom && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setViewingRoom(null)}></div>
          <div className="w-full max-w-3xl bg-[#0a0a0a] border border-white/20 shadow-2xl rounded-3xl relative z-10 animate-in fade-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="relative h-64 sm:h-[400px] w-full shrink-0 flex gap-1 p-1 bg-black rounded-t-3xl">
              {(() => {
                const img1 = viewingRoom.images?.[0] || viewingRoom.image;
                const img2 = viewingRoom.images?.[1] || viewingRoom.image2;
                const img3 = viewingRoom.images?.[2] || viewingRoom.image3;

                if (img2 && img3) {
                  return (
                    <>
                      <div className="flex-2 w-2/3 relative rounded-tl-2xl overflow-hidden group">
                        <img src={img1} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={viewingRoom.name} />
                      </div>
                      <div className="flex-1 w-1/3 flex flex-col gap-1">
                        <div className="h-1/2 relative rounded-tr-2xl overflow-hidden group">
                          <img src={img2} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={viewingRoom.name} />
                        </div>
                        <div className="h-1/2 relative overflow-hidden group">
                          <img src={img3} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={viewingRoom.name} />
                        </div>
                      </div>
                    </>
                  );
                } else {
                  return (
                    <div className="w-full h-full relative rounded-t-2xl overflow-hidden group">
                      <img src={img1} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={viewingRoom.name} />
                    </div>
                  );
                }
              })()}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10"></div>
              <button onClick={() => setViewingRoom(null)} className="absolute top-4 right-4 bg-black/50 text-white hover:text-[#D4FF00] hover:bg-black/80 p-2 rounded-full backdrop-blur-md transition-colors z-20"><X size={20}/></button>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2 block drop-shadow-md">{selectedCategory?.name}</span>
                <h3 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight drop-shadow-lg">{viewingRoom.name}</h3>
              </div>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-black/40">
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex-1 min-w-[150px]">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1"><MonitorPlay size={12}/> Giá Phòng / Đêm</span>
                  <span className="text-lg font-bold text-[#D4FF00] font-serif italic">{viewingRoom.price} VNĐ</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex-1 min-w-[150px]">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1"><BedDouble size={12}/> Loại Giường</span>
                  <span className="text-sm font-bold text-white">{viewingRoom.bed || '1 Giường đôi'}</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
                <Sparkles size={16} className="text-[#D4FF00]"/> Tiện ích chi tiết
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
                {(viewingRoom.amenities || []).map((amn, i) => (
                  <li key={i} className="flex items-start text-sm font-light text-zinc-300 gap-3">
                    <CheckCircle size={16} className="text-[#D4FF00] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{amn}</span>
                  </li>
                ))}
                {(!viewingRoom.amenities || viewingRoom.amenities.length === 0) && (
                  <p className="text-xs text-zinc-500 italic col-span-2">Đang cập nhật tiện ích...</p>
                )}
              </ul>

              <button 
                disabled={viewingRoom.status !== 'Trống'} 
                onClick={() => { 
                  setViewingRoom(null); 
                  setSelectedCategory(null); 
                  setBookingModalOpen(true); 
                }} 
                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 ${viewingRoom.status === 'Trống' ? 'bg-[#D4FF00] text-black hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)] hover:scale-[1.02]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                {viewingRoom.status === 'Trống' ? <><Calendar size={16}/> Đặt Phòng Này</> : 'Phòng Đang Được Dọn / Bảo Trì'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: BOOKING --- */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setBookingModalOpen(false)}></div>
          <div className="w-full max-w-xl bg-[#0a0a0a] border border-white/20 rounded-3xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
              <h3 className="font-black uppercase tracking-widest text-white">Đặt Phòng</h3>
              <button onClick={() => setBookingModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>

            {bookingView === 'form' && (
              <form className="p-8 space-y-6 overflow-y-auto custom-scrollbar" onSubmit={handleSearchRooms}>
                <div className="flex gap-2">
                  {['hourly', 'daily', 'overnight'].map(t => (
                    <button key={t} type="button" onClick={() => handleBookingTypeChange(t)} className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${bookingForm.type === t ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00]' : 'border-white/10 text-zinc-500 hover:bg-white/5 hover:text-white'}`}>{t === 'hourly' ? 'Theo giờ' : t === 'daily' ? 'Theo ngày' : 'Qua đêm'}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {bookingForm.type !== 'hourly' && (
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Số lượng khách</label>
                      <select value={bookingForm.guests} onChange={e=>setBookingForm({...bookingForm, guests: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none text-white">
                        <option value={2} className="bg-zinc-900">1 - 2 Người</option><option value={4} className="bg-zinc-900">3 - 4 Người (Studio)</option>
                      </select>
                    </div>
                  )}
                  <div className={bookingForm.type === 'hourly' ? 'col-span-2' : 'col-span-1'}>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Ngày nhận</label>
                    <input type="date" min={minDateStr} max={maxDateStr} value={bookingForm.dateIn} onChange={e=>setBookingForm({...bookingForm, dateIn: e.target.value, dateOut: bookingForm.type==='hourly'?e.target.value:getNextDay(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none text-white [color-scheme:dark]"/>
                  </div>
                  {bookingForm.type !== 'hourly' && (
                    <div className="col-span-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Ngày trả</label>
                      <input type="date" min={bookingForm.dateIn} max={maxDateStr} value={bookingForm.dateOut} onChange={e=>setBookingForm({...bookingForm, dateOut: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none text-white [color-scheme:dark]"/>
                    </div>
                  )}
                  <div className="col-span-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Giờ nhận</label>
                    <select required value={bookingForm.timeIn} onChange={e=>setBookingForm({...bookingForm, timeIn: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none text-white">
                      <option value="" disabled className="bg-zinc-900">Chọn giờ</option>
                      {getAvailableTimeOptions().map(o => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Giờ trả</label>
                    <select required value={bookingForm.timeOut} onChange={e=>setBookingForm({...bookingForm, timeOut: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none text-white">
                      <option value="" disabled className="bg-zinc-900">Chọn giờ</option>
                      {TIME_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}
                    </select>
                  </div>
                </div>
                {(() => {
                  let isHourlyDisabled = false;
                  if (bookingForm.type === 'hourly' && bookingForm.timeIn) { const h = parseInt(bookingForm.timeIn.split(':')[0]); if (h >= 22 || h < 6) isHourlyDisabled = true; }
                  return (
                    <>
                      {isHourlyDisabled && <p className="text-red-400 text-[10px] text-center italic uppercase tracking-widest">* Sau 22h, vui lòng chọn gói Qua đêm.</p>}
                      <button disabled={isHourlyDisabled} type="submit" className={`w-full font-bold py-4 rounded-xl text-xs uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(212,255,0,0.2)] transition-colors ${isHourlyDisabled?'bg-zinc-800 text-zinc-500':'bg-[#D4FF00] text-black hover:bg-white'}`}>Tìm Phòng Trống</button>
                    </>
                  );
                })()}
              </form>
            )}

            {bookingView === 'results' && (
              <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <button onClick={() => setBookingView('form')} className="text-xs text-zinc-400 flex items-center gap-1 mb-4 hover:text-[#D4FF00]"><ArrowLeft size={14}/> Sửa lại thời gian ({searchSummary.text})</button>
                {availableRooms.map(r => (
                  <div key={r.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-4 items-center group hover:border-[#D4FF00]/50 transition-all">
                    <img src={r.image} className="w-full sm:w-28 h-24 object-cover rounded-xl shrink-0" alt=""/>
                    <div className="flex-1 w-full flex flex-col justify-between h-full">
                      <div><span className="text-[9px] font-bold text-[#D4FF00] uppercase tracking-widest">{r.categoryName}</span><h4 className="font-bold text-white text-lg">{r.name}</h4></div>
                      <div className="flex justify-between items-end mt-2"><span className="text-lg font-serif italic text-[#D4FF00]">{formatPrice(r.totalPrice)}</span><button onClick={() => handleSelectRoom(r)} className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4FF00]">Chọn</button></div>
                    </div>
                  </div>
                ))}
                {availableRooms.length === 0 && <div className="text-center py-10"><p className="text-zinc-500 text-sm italic">Không có phòng trống phù hợp.</p></div>}
              </div>
            )}

            {bookingView === 'guest_info' && (
              <form className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1" onSubmit={handleGuestSubmit}>
                <button type="button" onClick={() => setBookingView('results')} className="text-xs text-zinc-400 flex items-center gap-1 hover:text-[#D4FF00]"><ArrowLeft size={14}/> Quay lại chọn phòng</button>
                <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/20 p-4 rounded-xl flex items-start gap-3"><Info size={16} className="text-[#D4FF00] shrink-0 mt-0.5" /><p className="text-[10px] text-zinc-300 font-light leading-relaxed">Thông tin sẽ tự động xóa sau khi Checkout để bảo mật riêng tư.</p></div>
                {guestFormError && <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3"><AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" /><p className="text-[10px] text-red-200 font-light leading-relaxed">{guestFormError}</p></div>}
                
                <div className="space-y-4">
                  <input required placeholder="Tên người nhận phòng" value={guestInfo.name} onChange={e=>setGuestInfo({...guestInfo, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-[#D4FF00] text-sm text-white"/>
                  <div className="grid grid-cols-2 gap-4">
                    <input readOnly placeholder="Ngày sinh (AI quét)" value={guestInfo.dob} className="bg-black/40 border border-white/10 p-3 rounded-xl text-sm text-zinc-500 cursor-not-allowed outline-none"/>
                    <input required type="tel" placeholder="Số điện thoại" value={guestInfo.phone} onChange={e=>setGuestInfo({...guestInfo, phone: e.target.value.replace(/\D/g, '')})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-[#D4FF00] text-sm text-white"/>
                  </div>
                  <div className="pt-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Tải lên Mặt trước CCCD</label>
                    <div className={`relative h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all ${guestInfo.cccdImage ? 'border-[#D4FF00] bg-[#D4FF00]/5' : 'border-white/20 bg-white/5'}`}>
                      <input required={!guestInfo.cccdImage} type="file" accept="image/*" onChange={e => handleImageUploadWithAI(e, setGuestInfo, setGuestFormError)} disabled={isCheckingCCCD} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                      {isCheckingCCCD ? <div className="text-center animate-pulse"><Clock size={24} className="mx-auto mb-2 text-[#D4FF00]"/><span className="text-[10px] font-bold uppercase text-[#D4FF00] tracking-widest">AI đang quét dữ liệu...</span></div> : guestInfo.cccdImage ? <div className="text-center"><img src={guestInfo.cccdImage} className="h-24 object-contain rounded-md mb-2 shadow-xl"/><p className="text-[10px] font-bold text-[#D4FF00] flex items-center justify-center gap-1"><CheckCircle size={12}/> Hợp lệ</p></div> : <div className="text-center text-zinc-500"><UploadCloud size={32} className="mx-auto mb-2"/><p className="text-[10px] uppercase font-bold tracking-widest text-white mb-1">Nhấn để tải ảnh</p><p className="text-[9px] font-light">Chỉ nhận file rõ nét</p></div>}
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={isCheckingCCCD} className="w-full bg-[#D4FF00] text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors shadow-[0_0_15px_rgba(212,255,0,0.2)]">Tiếp tục thanh toán</button>
              </form>
            )}

            {bookingView === 'payment' && (
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-full flex justify-between mb-8 border-b border-white/10 pb-4"><button onClick={() => setBookingView(currentUser ? 'results' : 'guest_info')} className="text-zinc-400 hover:text-[#D4FF00]"><ArrowLeft size={20}/></button><span className="text-[10px] font-bold uppercase tracking-widest text-[#D4FF00]">Thanh toán QR</span><div className="w-5"></div></div>
                <div className="bg-white p-4 rounded-2xl mb-6 shadow-[0_0_40px_rgba(212,255,0,0.15)] relative">
                  <img src={`https://img.vietqr.io/image/${ROOM_BANK_NAME}-${ROOM_BANK_ACC}-qr_only.png?amount=${selectedBookingRoom?.totalPrice}&addInfo=${encodeURIComponent(pendingBookingCode)}&accountName=${encodeURIComponent(ROOM_BANK_OWNER)}`} className="w-48 h-48 mix-blend-multiply object-contain" alt="QR"/>
                  <div className="absolute inset-0 border-4 border-[#D4FF00]/50 rounded-2xl animate-pulse pointer-events-none"></div>
                </div>
                <h4 className="text-3xl font-serif italic text-white mb-2">{formatPrice(selectedBookingRoom?.totalPrice)}</h4>
                <p className="text-xs text-zinc-400 font-light mb-6 px-4">Mở App ngân hàng, quét mã QR và xác nhận chuyển khoản.</p>
                <p className="text-[10px] text-[#D4FF00] uppercase font-bold tracking-widest animate-pulse flex items-center justify-center gap-2 mb-2"><Clock size={14}/> Hệ thống đang chờ nhận tiền...</p>
                <p className="text-[9px] text-zinc-500">Liên hệ Fanpage nếu đã thanh toán nhưng chưa hiện biên lai.</p>
              </div>
            )}

            {bookingView === 'success' && finalBookingData && (
              <div className="p-8 space-y-6 overflow-y-auto text-center flex-1">
                <div className="w-16 h-16 bg-[#D4FF00]/20 rounded-full flex items-center justify-center mx-auto mb-2 text-[#D4FF00]"><CheckCircle size={32}/></div>
                <h4 className="text-2xl font-black uppercase text-white tracking-tight mb-2">Đặt phòng thành công!</h4>
                <p className="text-[10px] font-light text-zinc-400 uppercase tracking-widest mb-6">Chào mừng đến với Madlad</p>
                
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left space-y-4">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4"><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mã đặt phòng:</span><span className="text-sm font-mono text-white tracking-wider">{finalBookingData.code}</span></div>
                  <div className="grid grid-cols-2 gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
                    <div><span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-in</span><strong className="block text-xl font-bold text-white">{finalBookingData.timeIn}</strong><span className="block text-xs text-zinc-400 mt-0.5">{finalBookingData.dateIn}</span></div>
                    <div className="text-right border-l border-white/10 pl-4"><span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-out</span><strong className="block text-xl font-bold text-white">{finalBookingData.timeOut}</strong><span className="block text-xs text-zinc-400 mt-0.5">{finalBookingData.dateOut}</span></div>
                  </div>
                  <div className="pt-2">
                    <PasscodeStatus isoStart={finalBookingData.isoStart} timeIn={finalBookingData.timeIn} dateIn={finalBookingData.dateIn} />
                    <div className="flex justify-between items-center bg-[#D4FF00] text-black px-4 py-3 rounded-xl"><span className="text-[10px] font-bold uppercase tracking-widest">Passcode cửa:</span><strong className="text-2xl font-mono font-black tracking-widest">{finalBookingData.passcode}</strong></div>
                  </div>
                </div>

                {finalBookingData.youtubeLink && (
                  <a href={finalBookingData.youtubeLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-red-600/20 text-red-400 border border-red-500/30 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-colors">
                    <PlayCircle size={16}/> Xem video Hướng dẫn tự mở cửa
                  </a>
                )}
                <p className="text-[9px] text-zinc-500 italic px-4 mt-4">* Lưu ý: Bạn có thể tìm lại biên lai bằng cách tra cứu SĐT hoặc Mã đặt phòng ở trang chủ.</p>
                <button onClick={()=>setBookingModalOpen(false)} className="text-[10px] mt-2 font-bold uppercase text-white tracking-widest border-b border-white/20 hover:border-white transition-all pb-1">Đóng</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- THÊM AUTH MODAL BỊ MẤT CHO KHÁCH HÀNG --- */}
      {authState.isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setAuthState({...authState, isOpen: false})}></div>
          <div className="w-full max-w-md bg-[#0a0a0a] border border-white/20 rounded-3xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#D4FF00] mb-1">{authState.view === 'login' ? 'Welcome Back' : 'Member Only'}</h3>
                <h4 className="text-xl font-black uppercase text-white tracking-tight">{authState.view === 'login' ? 'Đăng nhập' : 'Tạo hồ sơ'}</h4>
              </div>
              <button onClick={() => setAuthState({...authState, isOpen: false})} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              {authFormError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 mb-6">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200 font-light leading-relaxed">{authFormError}</p>
                </div>
              )}

              {authState.view === 'login' ? (
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div><input required placeholder="Tên đăng nhập" value={loginForm.username} onChange={e=>setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-[#D4FF00] text-sm text-white"/></div>
                  <div><input required type="password" placeholder="Mật khẩu" value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-[#D4FF00] text-sm text-white"/></div>
                  <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-white transition-colors">Đăng Nhập</button>
                  <p className="text-center mt-4 text-xs text-zinc-400">Chưa có hồ sơ? <button type="button" onClick={() => { setAuthState({...authState, view: 'register'}); setAuthFormError(''); }} className="text-[#D4FF00] font-bold hover:underline">Đăng ký ngay</button></p>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handleRegister}>
                  <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/20 p-4 rounded-xl flex gap-3"><Info size={16} className="text-[#D4FF00] shrink-0 mt-0.5" /><p className="text-[10px] text-zinc-300 font-light">Lưu hồ sơ một lần, các lần đặt phòng sau không cần khai báo lại CCCD.</p></div>
                  <div className="space-y-4">
                    <input required placeholder="Tạo Tên đăng nhập" value={registerForm.username} onChange={e=>setRegisterForm({...registerForm, username: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-[#D4FF00] text-sm text-white"/>
                    <input required type="password" placeholder="Tạo Mật khẩu" value={registerForm.password} onChange={e=>setRegisterForm({...registerForm, password: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-[#D4FF00] text-sm text-white"/>
                    <div className="grid grid-cols-2 gap-4">
                      <input readOnly placeholder="Ngày sinh (AI quét)" value={registerForm.dob} className="bg-black/40 border border-white/10 p-3 rounded-xl text-sm text-zinc-500 cursor-not-allowed outline-none"/>
                      <input required type="tel" placeholder="Số điện thoại" value={registerForm.phone} onChange={e=>setRegisterForm({...registerForm, phone: e.target.value.replace(/\D/g, '')})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-[#D4FF00] text-sm text-white"/>
                    </div>
                    <div className="pt-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Tải lên Mặt trước CCCD</label>
                      <div className={`relative h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all ${registerForm.cccdImage ? 'border-[#D4FF00] bg-[#D4FF00]/5' : 'border-white/20 bg-white/5'}`}>
                        <input type="file" accept="image/*" onChange={e => handleImageUploadWithAI(e, setRegisterForm, setAuthFormError)} disabled={isCheckingCCCD} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                        {isCheckingCCCD ? <div className="text-center animate-pulse"><Clock size={20} className="mx-auto mb-1 text-[#D4FF00]"/><span className="text-[9px] font-bold uppercase text-[#D4FF00]">Đang quét...</span></div> : registerForm.cccdImage ? <div className="text-center"><img src={registerForm.cccdImage} className="h-16 object-contain rounded mb-1"/><p className="text-[9px] font-bold text-[#D4FF00]">Hợp lệ</p></div> : <div className="text-center text-zinc-500"><ImageIcon size={24} className="mx-auto mb-1"/><p className="text-[9px] font-bold uppercase">Nhấn để tải ảnh</p></div>}
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={isCheckingCCCD} className="w-full bg-[#D4FF00] text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest disabled:bg-zinc-800 disabled:text-zinc-600">Lưu Hồ Sơ</button>
                  <p className="text-center mt-4 text-xs text-zinc-400">Đã có hồ sơ? <button type="button" onClick={() => { setAuthState({...authState, view: 'login'}); setAuthFormError(''); }} className="text-white font-bold hover:underline">Đăng nhập</button></p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TRA CỨU BIÊN LAI --- */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={()=>setSearchModalOpen(false)}></div>
          <div className="w-full max-w-md bg-[#0a0a0a] border border-white/20 rounded-3xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#D4FF00]">Tra cứu vé</h3>
              <button onClick={()=>setSearchModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <form onSubmit={handleSearchBooking} className="flex gap-2 mb-6">
                <input required placeholder="Nhập SĐT hoặc Mã vé..." value={searchCode} onChange={e=>setSearchCode(e.target.value.toUpperCase())} className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-[#D4FF00] font-mono tracking-widest text-white"/>
                <button type="submit" className="bg-[#D4FF00] text-black px-4 rounded-xl hover:bg-white transition-colors"><Search size={20}/></button>
              </form>

              {searchResult?.status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200 font-light leading-relaxed">{searchResult.message}</p>
                </div>
              )}
              {searchResult?.status === 'success' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#D4FF00]/20 flex items-center justify-center text-[#D4FF00]"><CheckCircle size={20} /></div>
                      <div><span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Mã số vé</span><strong className="text-sm text-white uppercase tracking-wider font-mono">{searchResult.data.code}</strong></div>
                    </div>
                    <div className="space-y-4 mb-4">
                      <div className="flex justify-between items-end border-b border-white/5 pb-4"><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phòng đã đặt</span><span className="text-sm font-bold text-white">{searchResult.data.roomName} <span className="text-zinc-500 text-xs">({searchResult.data.categoryName})</span></span></div>
                      <div className="grid grid-cols-2 gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
                        <div><span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-in</span><strong className="block text-xl font-bold text-white">{searchResult.data.timeIn}</strong><span className="text-[10px] text-zinc-400">{searchResult.data.dateIn}</span></div>
                        <div className="text-right border-l border-white/10 pl-4"><span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-out</span><strong className="block text-xl font-bold text-white">{searchResult.data.timeOut}</strong><span className="text-[10px] text-zinc-400">{searchResult.data.dateOut}</span></div>
                      </div>
                    </div>
                    <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/30 rounded-xl p-4 flex flex-col">
                      <PasscodeStatus isoStart={searchResult.data.isoStart} timeIn={searchResult.data.timeIn} dateIn={searchResult.data.dateIn} />
                      <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-[#D4FF00] uppercase tracking-widest">Passcode cửa:</span><span className="text-xl font-black font-mono tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{searchResult.data.passcode}</span></div>
                    </div>
                    {searchResult.data.youtubeLink && (
                      <a href={searchResult.data.youtubeLink} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full bg-red-600/20 text-red-400 border border-red-500/30 py-3.5 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-colors">
                        <PlayCircle size={16}/> Xem HD tự check-in
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- FOOD MENU (ĐÃ KHÔI PHỤC BỘ LỌC DROPDOWN) --- */}
      {isFoodMenuOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={()=>setIsFoodMenuOpen(false)}></div>
          <div className="w-full max-w-6xl bg-[#0a0a0a] border border-white/20 rounded-3xl relative z-10 flex flex-col h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-black/50 shrink-0">
              <h3 className="font-black uppercase tracking-widest text-white flex items-center gap-2 text-lg md:text-2xl"><UtensilsCrossed size={20} className="text-[#D4FF00]"/> Thực đơn Đồ ăn</h3>
              <div className="flex gap-4">
                <button onClick={()=>setIsCartOpen(true)} className="relative text-white hover:text-[#D4FF00] transition-colors"><ShoppingCart size={24}/>{cartTotalQty > 0 && <span className="absolute -top-2 -right-2 bg-[#D4FF00] text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartTotalQty}</span>}</button>
                <div className="w-px h-6 bg-white/20"></div>
                <button onClick={()=>setIsFoodMenuOpen(false)} className="text-zinc-500 hover:text-white"><X size={24}/></button>
              </div>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 relative">
              <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 relative z-20">
                <p className="text-zinc-400 font-light max-w-sm text-sm leading-relaxed">Order trực tiếp trên web. Nhân viên sẽ mang đồ ăn lên tận phòng cho bạn chỉ sau vài phút.</p>
                
                <div className="relative">
                  <button onClick={() => setIsFoodCategoryOpen(!isFoodCategoryOpen)} className={`flex items-center justify-between w-full md:w-auto gap-4 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${isFoodCategoryOpen || activeFoodCategory !== 'Tất cả' ? 'bg-[#D4FF00]/10 border-[#D4FF00] text-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300'}`}>
                    <span className="flex items-center gap-2"><Filter size={16} className="text-[#D4FF00]" /> Danh mục: <span className="text-[#D4FF00]">{activeFoodCategory}</span></span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isFoodCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`absolute top-full right-0 mt-4 w-full md:w-[400px] bg-[#111]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300 origin-top ${isFoodCategoryOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="flex flex-wrap gap-2">
                      {dynamicCategories.map(cat => (
                        <button key={cat} onClick={() => { setActiveFoodCategory(cat); setIsFoodCategoryOpen(false); }} className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeFoodCategory === cat ? 'bg-[#D4FF00] text-black shadow-[0_0_15px_rgba(212,255,0,0.3)]' : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white'}`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
                {snacksDb.filter(s => activeFoodCategory === 'Tất cả' || s.category === activeFoodCategory).map(item => (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-[#D4FF00]/40 transition-colors flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden relative"><img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/><div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10"><span className="text-[8px] font-bold text-[#D4FF00] uppercase tracking-widest">{item.category}</span></div></div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div><h5 className="font-bold text-white mb-1 line-clamp-1">{item.name}</h5><p className="text-lg font-serif italic text-[#D4FF00] mb-4">{formatPrice(item.price)}</p></div>
                      <button onClick={()=>addToCart(item)} className={`w-full py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${addedItemId === item.id ? 'bg-[#D4FF00] text-black border-[#D4FF00]' : 'border-white/20 text-white hover:bg-[#D4FF00] hover:text-black hover:border-[#D4FF00]'}`}>{addedItemId === item.id ? <><CheckCircle size={14}/> Đã thêm</> : <><Plus size={14}/> Thêm món</>}</button>
                    </div>
                  </div>
                ))}
                {snacksDb.filter(s => activeFoodCategory === 'Tất cả' || s.category === activeFoodCategory).length === 0 && (
                   <div className="col-span-full py-20 text-center bg-white/5 border border-white/10 rounded-3xl"><UtensilsCrossed size={48} className="mx-auto text-zinc-600 mb-4"/><p className="text-zinc-400 text-sm">Chưa có món ăn nào trong danh mục này.</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CART DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[170] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="w-full max-w-md bg-[#080808] border-l border-white/10 h-full relative z-10 flex flex-col animate-in slide-in-from-right shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="font-black uppercase tracking-widest text-white flex items-center gap-2"><UtensilsCrossed size={18} className="text-[#D4FF00]"/> Khay đồ ăn</h3>
              <button onClick={()=>setIsCartOpen(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                  <img src={item.image} className="w-16 h-16 rounded-lg object-cover border border-white/10" alt=""/>
                  <div className="flex-1"><h6 className="text-xs font-bold text-white mb-1 line-clamp-1">{item.name}</h6><p className="text-xs text-[#D4FF00] font-serif italic">{formatPrice(item.price)}</p></div>
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-2 py-1 rounded-lg">
                    <button onClick={()=>updateQty(item.id, -1)} className="text-zinc-400 hover:text-white"><Minus size={14}/></button>
                    <span className="text-xs font-bold w-4 text-center text-white">{item.qty}</span>
                    <button onClick={()=>updateQty(item.id, 1)} className="text-zinc-400 hover:text-white"><Plus size={14}/></button>
                  </div>
                  <button onClick={()=>removeFromCart(item.id)} className="text-zinc-600 hover:text-red-500 ml-1"><Trash2 size={16}/></button>
                </div>
              ))}
              {cart.length === 0 && <div className="h-full flex flex-col items-center justify-center text-zinc-600"><ShoppingCart size={48} strokeWidth={1} className="mb-4 opacity-20"/><p className="text-[10px] font-bold uppercase tracking-widest">Khay đang trống</p></div>}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/60">
                <div className="flex justify-between items-end mb-6"><span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Tổng cộng:</span><strong className="text-2xl font-serif italic text-[#D4FF00] leading-none">{formatPrice(cartTotalPrice)}</strong></div>
                <form onSubmit={handleFoodOrderSubmit}>
                  <select required value={selectedFoodRoom} onChange={e=>setSelectedFoodRoom(e.target.value)} className="w-full bg-white/5 border border-white/20 p-3.5 rounded-xl text-sm mb-4 outline-none text-white appearance-none cursor-pointer">
                    <option value="" disabled className="bg-zinc-900 text-zinc-500">Bạn đang ở phòng nào?</option>
                    {allSubRoomsFlat.map(r => <option key={r.id} value={r.name} className="bg-zinc-900">{r.name} ({r.categoryName})</option>)}
                  </select>
                  <div className="flex gap-2 mb-4">
                     <label className={`flex-1 text-center py-3 border rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${foodPaymentMethod==='transfer'?'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00]':'border-white/20 text-zinc-500'}`}><input type="radio" className="hidden" checked={foodPaymentMethod==='transfer'} onChange={()=>setFoodPaymentMethod('transfer')}/>Chuyển khoản</label>
                     <label className={`flex-1 text-center py-3 border rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${foodPaymentMethod==='cash'?'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00]':'border-white/20 text-zinc-500'}`}><input type="radio" className="hidden" checked={foodPaymentMethod==='cash'} onChange={()=>setFoodPaymentMethod('cash')}/>Tiền mặt</label>
                  </div>
                  <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold py-4 rounded-xl text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,255,0,0.2)] hover:bg-white transition-colors">Xác nhận Order</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CỔNG THANH TOÁN ĐỒ ĂN --- */}
      {cartView === 'payment' && (
        <div className="fixed inset-0 z-[180] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setCartView('cart')}></div>
          <div className="w-full max-w-md bg-[#080808] border-l border-white/10 h-full relative z-10 flex flex-col animate-in slide-in-from-right shadow-2xl p-8 items-center text-center justify-center">
             <div className="w-full flex justify-between absolute top-6 left-6 right-6"><button onClick={()=>setCartView('cart')} className="text-zinc-500 hover:text-white"><ArrowLeft size={20}/></button></div>
             <h4 className="text-[10px] font-bold text-[#D4FF00] uppercase tracking-widest mb-8">Thanh toán tự động</h4>
             <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(212,255,0,0.15)] mb-6 relative">
               <img src={`https://img.vietqr.io/image/${FOOD_BANK_NAME}-${FOOD_BANK_ACC}-qr_only.png?amount=${cartTotalPrice}&addInfo=${encodeURIComponent(pendingFoodOrderId)}&accountName=${encodeURIComponent(FOOD_BANK_OWNER)}`} alt="QR" className="w-56 h-56 mix-blend-multiply object-contain" />
               <div className="absolute inset-0 border-4 border-[#D4FF00]/50 rounded-3xl animate-pulse pointer-events-none"></div>
             </div>
             <h4 className="text-3xl font-serif italic text-white mb-4">{formatPrice(cartTotalPrice)}</h4>
             <p className="text-xs text-zinc-400 font-light mb-6 px-4 leading-relaxed">Mở App ngân hàng quét mã QR để thanh toán tiền đồ ăn cho phòng <strong className="text-white">{selectedFoodRoom}</strong>.</p>
             <p className="text-[10px] font-bold text-[#D4FF00] mb-2 uppercase tracking-widest animate-pulse flex items-center gap-2"><Clock size={14}/> Hệ thống đang chờ...</p>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-xl py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <button onClick={() => { if(auth.currentUser && auth.currentUser.email) setAdminView('select'); else setAdminView('login'); setIsAdminModalOpen(true); }} className="text-zinc-800 hover:text-[#D4FF00] transition-colors"><Settings size={18}/></button>
            <div className="flex flex-col"><span className="text-2xl font-black uppercase tracking-widest text-white leading-none">Madlad</span><span className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.4em] mt-1">Cineroom & Hotel</span></div>
          </div>
          
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3 text-white">
              <MapPin size={24} className="text-[#D4FF00] shrink-0"/>
              <span className="text-sm md:text-base font-bold tracking-wide">292 Yên Ninh, Mỹ Đông, TP. Phan Rang-Tháp Chàm</span>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-[#D4FF00] uppercase tracking-[0.15em] leading-relaxed">NẾU BẠN GẶP VẤN ĐỀ, HÃY NHẤN NÚT MESSENGER MÀU XANH ĐỂ NHẮN TIN TRỰC TIẾP VỚI PAGE NHÉ</p>
          </div>

          <div className="text-center md:text-right"><p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">© 2024 Madlad Space. All rights reserved.</p></div>
        </div>
      </footer>

      {/* --- ADMIN MODAL (SECURE) --- */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={closeAdminModal}></div>
          <div className="w-full max-w-6xl bg-[#050505] border border-white/20 rounded-3xl relative z-10 flex flex-col h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50 shrink-0">
              <div className="flex items-center gap-4">
                {adminView !== 'login' && adminView !== 'select' && <button onClick={()=>setAdminView('select')} className="text-zinc-400 hover:text-[#D4FF00]"><ArrowLeft size={20}/></button>}
                <h4 className="font-black uppercase tracking-widest text-white text-sm md:text-base">{adminView === 'login' ? 'Xác thực Admin' : 'Hệ thống Quản trị'}</h4>
              </div>
              <button onClick={closeAdminModal} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>

            {adminView === 'login' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
                <Lock size={48} className="text-[#D4FF00] mb-8 drop-shadow-[0_0_15px_rgba(212,255,0,0.5)]"/>
                <form onSubmit={handleAdminLogin} className="w-full max-w-sm space-y-4">
                  <input required type="email" placeholder="Email Quản trị" value={adminLogin.email} onChange={e=>setAdminLogin({...adminLogin, email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-[#D4FF00]"/>
                  <input required type="password" placeholder="Mật khẩu" value={adminLogin.password} onChange={e=>setAdminLogin({...adminLogin, password: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-[#D4FF00]"/>
                  <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest mt-2 hover:bg-white transition-colors">Đăng nhập ngay</button>
                </form>
              </div>
            )}

            {adminView === 'select' && (
              <div className="p-8 md:p-12 flex-1 flex flex-col">
                <div className="flex justify-end mb-4 shrink-0"><button onClick={closeAdminModal} className="text-[10px] font-bold text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white uppercase tracking-widest">Đăng xuất Admin</button></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 items-center justify-center">
                  <button onClick={()=>setAdminView('bookings')} className="group p-8 md:p-10 bg-white/5 border border-white/10 rounded-3xl hover:border-[#D4FF00]/50 hover:bg-white/[0.08] transition-all flex flex-col items-center gap-6"><Calendar size={48} strokeWidth={1} className="text-zinc-500 group-hover:text-[#D4FF00] transition-colors"/><span className="font-black uppercase text-sm text-white tracking-widest group-hover:text-[#D4FF00] transition-colors">Lịch đặt phòng</span></button>
                  <button onClick={()=>setAdminView('rooms')} className="group p-8 md:p-10 bg-white/5 border border-white/10 rounded-3xl hover:border-[#D4FF00]/50 hover:bg-white/[0.08] transition-all flex flex-col items-center gap-6"><BedDouble size={48} strokeWidth={1} className="text-zinc-500 group-hover:text-[#D4FF00] transition-colors"/><span className="font-black uppercase text-sm text-white tracking-widest group-hover:text-[#D4FF00] transition-colors">Quản lý Phòng</span></button>
                  <button onClick={()=>setAdminView('menu')} className="group p-8 md:p-10 bg-white/5 border border-white/10 rounded-3xl hover:border-[#D4FF00]/50 hover:bg-white/[0.08] transition-all flex flex-col items-center gap-6"><UtensilsCrossed size={48} strokeWidth={1} className="text-zinc-500 group-hover:text-[#D4FF00] transition-colors"/><span className="font-black uppercase text-sm text-white tracking-widest group-hover:text-[#D4FF00] transition-colors">Thực đơn đồ ăn</span></button>
                  <button onClick={()=>setAdminView('surcharge')} className="group p-8 md:p-10 bg-white/5 border border-white/10 rounded-3xl hover:border-[#D4FF00]/50 hover:bg-white/[0.08] transition-all flex flex-col items-center gap-6"><Sparkles size={48} strokeWidth={1} className="text-zinc-500 group-hover:text-[#D4FF00] transition-colors"/><span className="font-black uppercase text-sm text-white tracking-widest group-hover:text-[#D4FF00] transition-colors">Phụ thu lễ</span></button>
                </div>
              </div>
            )}

            {adminView === 'surcharge' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-2xl bg-white/5 border border-white/10 p-8 rounded-3xl">
                  <div className="text-center mb-8"><Sparkles size={40} className="text-[#D4FF00] mx-auto mb-4" /><h4 className="text-xl font-black uppercase text-white tracking-widest mb-2">Cấu Hình Phụ Thu Lễ</h4><p className="text-xs text-zinc-400">Tự động cộng thêm phí khi khách đặt vào các ngày bên dưới.</p></div>
                  <form onSubmit={async (e) => { e.preventDefault(); try { await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_settings', 'global'), globalSettings); showAlert('Lưu cấu hình phụ thu thành công!'); } catch(err) { showAlert('Lỗi: ' + err.message); } }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Từ ngày</label><input type="date" value={globalSettings.holidayStart} onChange={e=>setGlobalSettings({...globalSettings, holidayStart: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white rounded-xl focus:border-[#D4FF00] outline-none [color-scheme:dark]" /></div>
                      <div><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Đến ngày</label><input type="date" value={globalSettings.holidayEnd} onChange={e=>setGlobalSettings({...globalSettings, holidayEnd: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white rounded-xl focus:border-[#D4FF00] outline-none [color-scheme:dark]" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Phụ thu Giờ (%)</label><div className="relative"><input type="number" placeholder="VD: 30" value={globalSettings.surchargeHourlyPct} onChange={e=>setGlobalSettings({...globalSettings, surchargeHourlyPct: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white rounded-xl focus:border-[#D4FF00] outline-none"/><span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">%</span></div></div>
                      <div><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Phụ thu Ngày (VNĐ)</label><input type="number" placeholder="VD: 100000" value={globalSettings.surchargeDailyVnd} onChange={e=>setGlobalSettings({...globalSettings, surchargeDailyVnd: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white rounded-xl focus:border-[#D4FF00] outline-none" /></div>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-white/10"><button type="button" onClick={() => setGlobalSettings({ holidayStart: '', holidayEnd: '', surchargeHourlyPct: '', surchargeDailyVnd: '' })} className="flex-1 bg-red-500/10 text-red-400 font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-red-500 hover:text-white transition-colors">Xóa Phụ Thu</button><button type="submit" className="flex-[2] bg-[#D4FF00] text-black font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)] transition-colors">Lưu & Áp Dụng Ngay</button></div>
                  </form>
                </div>
              </div>
            )}

            {adminView === 'bookings' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                 <div className="w-full md:w-1/3 p-6 border-r border-white/10 bg-black/20 overflow-y-auto custom-scrollbar">
                    <h5 className="font-bold text-[#D4FF00] uppercase text-xs mb-6 tracking-widest flex items-center gap-2"><Lock size={14}/> Chặn phòng / Khách ngoài</h5>
                    <form onSubmit={handleManualBookingSubmit} className="space-y-4">
                        <select required value={manualBookingForm.roomKey} onChange={e=>{ const r=allSubRoomsFlat.find(x=>x.id===e.target.value); setManualBookingForm({...manualBookingForm, roomKey: e.target.value, roomName: r.name, categoryName: r.categoryName, youtubeLink: r.youtubeLink||''}) }} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none text-white">
                            <option value="" disabled className="text-zinc-500">-- Chọn phòng cần chặn --</option>
                            {allSubRoomsFlat.map(r => <option key={r.id} value={r.id} className="bg-zinc-900">{r.categoryName} - {r.name}</option>)}
                        </select>
                        <input required placeholder="Nguồn (VD: Khách Zalo...)" value={manualBookingForm.guestName} onChange={e=>setManualBookingForm({...manualBookingForm, guestName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none text-white"/>
                        <div className="grid grid-cols-2 gap-3">
                           <div><label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Ngày vào</label><input required type="date" value={manualBookingForm.dateIn} onChange={e=>setManualBookingForm({...manualBookingForm, dateIn: e.target.value, dateOut: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white [color-scheme:dark] outline-none"/></div>
                           <div><label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Giờ vào</label><select required value={manualBookingForm.timeIn} onChange={e=>setManualBookingForm({...manualBookingForm, timeIn: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none">{TIME_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}</select></div>
                           <div><label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Ngày ra</label><input required type="date" value={manualBookingForm.dateOut} onChange={e=>setManualBookingForm({...manualBookingForm, dateOut: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white [color-scheme:dark] outline-none"/></div>
                           <div><label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Giờ ra</label><select required value={manualBookingForm.timeOut} onChange={e=>setManualBookingForm({...manualBookingForm, timeOut: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none">{TIME_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}</select></div>
                        </div>
                        <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest mt-2 hover:bg-white transition-colors">Thêm lịch chặn</button>
                    </form>
                 </div>
                 <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4"><h4 className="text-sm font-bold text-white uppercase tracking-widest">Lịch đang chạy</h4></div>
                    <div className="space-y-4">
                      {[...bookingsDb].sort((a,b)=>new Date(a.isoStart)-new Date(b.isoStart)).map(b => (
                        <div key={b.code} className={`p-4 bg-white/5 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${b.accountId === 'admin_manual' ? 'border-[#D4FF00]/30' : 'border-white/10'}`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">{b.code}</span>{b.accountId === 'admin_manual' && <span className="bg-[#D4FF00] text-black text-[8px] px-2 py-0.5 rounded font-bold uppercase">Khách Ngoài</span>}{b.status === 'pending' && <span className="bg-orange-500 text-white text-[8px] px-2 py-0.5 rounded font-bold uppercase">Chờ TT</span>}</div>
                            <h6 className="font-bold text-white text-sm">{b.roomName} <span className="text-zinc-500 font-normal">({b.categoryName})</span></h6>
                            <p className="text-xs text-zinc-400 mt-0.5">Khách: <strong className="text-white">{b.guestData?.name}</strong></p>
                          </div>
                          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                             <div className="flex items-center gap-3 bg-black/30 border border-white/5 px-3 py-2 rounded-lg text-xs w-full md:w-auto justify-between md:justify-start">
                                <div className="text-right"><span className="block text-[9px] text-zinc-500 uppercase">In</span><strong className="text-white">{b.timeIn} <span className="font-normal text-zinc-400">({b.dateIn.slice(-2)}/{b.dateIn.slice(5,7)})</span></strong></div>
                                <ArrowRight size={14} className="text-zinc-600"/>
                                <div className="text-left"><span className="block text-[9px] text-zinc-500 uppercase">Out</span><strong className="text-white">{b.timeOut} <span className="font-normal text-zinc-400">({b.dateOut.slice(-2)}/{b.dateOut.slice(5,7)})</span></strong></div>
                             </div>
                             <div className="flex gap-2">
                               <button onClick={()=>setViewingAdminBooking(b)} className="text-[9px] font-bold text-[#D4FF00] border border-[#D4FF00]/30 px-4 py-2 rounded-lg hover:bg-[#D4FF00] hover:text-black transition-colors uppercase tracking-widest">Xem CCCD & Chi tiết</button>
                               <button onClick={()=>{ showConfirm(`Hủy vé ${b.code}?`, async () => { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings', b.code)); }); }} className="text-[9px] font-bold text-red-500 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors uppercase tracking-widest">HỦY LỊCH</button>
                             </div>
                          </div>
                        </div>
                      ))}
                      {bookingsDb.length === 0 && <div className="text-center py-20 text-zinc-600 italic text-sm">Hệ thống chưa có lịch đặt nào.</div>}
                    </div>
                 </div>
              </div>
            )}

            {adminView === 'menu' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                 <div className="w-full md:w-1/3 p-6 border-r border-white/10 bg-black/20 overflow-y-auto custom-scrollbar">
                    <h5 className="font-bold text-[#D4FF00] uppercase text-xs mb-6 tracking-widest">{editingSnackId ? 'Sửa món' : 'Thêm món mới'}</h5>
                    <form onSubmit={async (e)=>{
                      e.preventDefault();
                      if(!snackForm.image) return showAlert('Tải ảnh lên nhé!');
                      const id = editingSnackId || 'item_' + Date.now();
                      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_menu', id), { ...snackForm, id, price: Number(snackForm.price) });
                      setSnackForm({ category: '', name: '', desc: '', price: '', image: null }); setEditingSnackId(null);
                      showAlert("Đã lưu thực đơn!");
                    }} className="space-y-4">
                       <div><label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Tên món</label><input required value={snackForm.name} onChange={e=>setSnackForm({...snackForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4FF00]"/></div>
                       <div><label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Danh mục (Snack, Nước...)</label><input required list="cats" value={snackForm.category} onChange={e=>setSnackForm({...snackForm, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4FF00]"/><datalist id="cats">{dynamicCategories.map(c=><option key={c} value={c}/>)}</datalist></div>
                       <div><label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Giá bán (VNĐ)</label><input required type="number" value={snackForm.price} onChange={e=>setSnackForm({...snackForm, price: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4FF00]"/></div>
                       <div><label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Mô tả ngắn</label><input value={snackForm.desc} onChange={e=>setSnackForm({...snackForm, desc: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4FF00]"/></div>
                       <div>
                         <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Hình ảnh</label>
                         <div className="relative h-24 border-2 border-dashed border-white/20 rounded-xl bg-white/5 overflow-hidden flex flex-col items-center justify-center hover:border-[#D4FF00] transition-colors">
                            <input type="file" accept="image/*" onChange={e=>handleImageUpload(e, setSnackForm, 'image')} className="absolute inset-0 opacity-0 cursor-pointer z-10"/>
                            {snackForm.image ? <img src={snackForm.image} className="h-full w-full object-cover"/> : <><Plus size={20} className="text-zinc-500 mb-1"/><span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Tải ảnh lên</span></>}
                         </div>
                       </div>
                       {editingSnackId ? (
                         <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 bg-[#D4FF00] text-black font-bold py-3 rounded-xl text-xs uppercase tracking-widest">Lưu</button><button type="button" onClick={()=>{setEditingSnackId(null); setSnackForm({ category: '', name: '', desc: '', price: '', image: null });}} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest">Hủy</button></div>
                       ) : (
                         <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold py-4 mt-2 rounded-xl text-xs uppercase tracking-widest hover:bg-white transition-colors">Thêm vào kho</button>
                       )}
                    </form>
                 </div>
                 <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                   <div className="flex flex-col md:flex-row gap-4 mb-6">
                     <h4 className="text-sm font-bold text-white uppercase tracking-widest flex-1">Danh sách ({filteredAdminSnacks.length})</h4>
                     <div className="flex gap-2">
                       <input type="text" placeholder="Tìm kiếm..." value={adminSearchQuery} onChange={e=>setAdminSearchQuery(e.target.value)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs text-white outline-none focus:border-[#D4FF00] w-32"/>
                       <select value={adminFilterCategory} onChange={e=>setAdminFilterCategory(e.target.value)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs text-white outline-none focus:border-[#D4FF00]">
                         {dynamicCategories.map(c=><option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                       </select>
                     </div>
                   </div>
                   {snacksDb.length === 0 ? (
                      <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10"><UtensilsCrossed size={48} className="text-zinc-600 mx-auto mb-4"/><p className="text-sm text-zinc-400 mb-6">Kho trống. Bấm nút dưới để nạp menu mẫu.</p><button onClick={async ()=>{ for(const i of DEFAULT_SNACKS) await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_menu', i.id), i); showAlert("Nạp thành công!"); }} className="bg-[#D4FF00] text-black font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest">Nạp Menu Mẫu</button></div>
                   ) : (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                       {filteredAdminSnacks.map(s => (
                         <div key={s.id} className="p-3 bg-white/5 border border-white/10 rounded-2xl flex gap-3 items-center group hover:border-white/30 transition-colors">
                           <img src={s.image} className="w-14 h-14 rounded-xl object-cover shrink-0" alt=""/>
                           <div className="flex-1 overflow-hidden"><h6 className="text-xs font-bold text-white truncate mb-1">{s.name}</h6><div className="flex justify-between items-center"><span className="text-[9px] bg-[#D4FF00]/10 text-[#D4FF00] px-2 py-0.5 rounded font-bold uppercase">{s.category}</span><span className="text-[10px] text-zinc-400">{formatPrice(s.price)}</span></div></div>
                           <div className="flex flex-col gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={()=>{ setSnackForm(s); setEditingSnackId(s.id); }} className="p-1.5 text-zinc-400 hover:text-[#D4FF00] hover:bg-[#D4FF00]/10 rounded-lg"><Edit size={14}/></button>
                             <button onClick={()=>{ showConfirm(`Xóa món ${s.name}?`, async () => await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_menu', s.id))); }} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
              </div>
            )}

            {adminView === 'rooms' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-5/12 p-6 border-r border-white/10 bg-black/20 overflow-y-auto custom-scrollbar">
                   {!roomEditMode ? (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center space-y-4"><Info size={40} className="opacity-50"/><p className="text-xs leading-relaxed max-w-[200px]">Chọn biểu tượng Edit (sửa Hạng) hoặc Thêm (tạo Phòng) ở bảng bên phải để bắt đầu thiết lập hệ thống phòng.</p></div>
                   ) : roomEditMode === 'category' ? (
                      <form onSubmit={async (e)=>{
                          e.preventDefault();
                          if(!roomCatForm.image) return showAlert('Tải ảnh lên!');
                          const id = editingCategoryId || 'cat_'+Date.now();
                          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms', id), { ...roomCatForm, id, features: roomCatForm.features.split('\n').filter(f=>f.trim()!==''), subRooms: roomsDb.find(r=>r.id===id)?.subRooms||[] }, { merge:true });
                          setRoomEditMode(null); showAlert('Lưu hạng phòng thành công!');
                      }} className="space-y-5">
                          <div className="flex justify-between items-center border-b border-white/10 pb-4"><h5 className="font-bold text-[#D4FF00] uppercase text-xs tracking-widest">{editingCategoryId ? 'Sửa Hạng Phòng' : 'Hạng Mới'}</h5><button type="button" onClick={()=>setRoomEditMode(null)} className="text-zinc-500 hover:text-white"><X size={16}/></button></div>
                          
                          <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/30 p-4 rounded-xl space-y-4">
                             <h6 className="text-[10px] font-bold text-[#D4FF00] uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2"><Settings size={14}/> Giá đặt theo giờ</h6>
                             <div className="grid grid-cols-4 gap-2">
                                {[2,3,4,5,6,7,8,9,10].map(h=>(<div key={h}><label className="text-[8px] text-zinc-400 block mb-1">Giá {h}H</label><input required type="number" placeholder="0" value={roomCatForm[`price${h}h`]} onChange={e=>setRoomCatForm({...roomCatForm, [`price${h}h`]: e.target.value})} className={`w-full bg-black/60 border border-white/10 p-2 text-xs rounded outline-none focus:border-[#D4FF00] ${h===2?'text-[#D4FF00] font-bold':'text-white'}`}/></div>))}
                                <div className="col-span-3"><label className="text-[8px] text-[#D4FF00] font-bold block mb-1">Giá mỗi 30p lố giờ</label><input required type="number" placeholder="0" value={roomCatForm.price30m} onChange={e=>setRoomCatForm({...roomCatForm, price30m: e.target.value})} className="w-full bg-black/60 border border-[#D4FF00]/30 p-2 text-xs text-white rounded outline-none focus:border-[#D4FF00]"/></div>
                             </div>
                             <h6 className="text-[10px] font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 pt-2">Phụ thu (Lưu đêm/Ngày)</h6>
                             <div className="grid grid-cols-2 gap-2">
                                <div><label className="text-[8px] text-zinc-400 block mb-1">Sớm / Giờ (VNĐ)</label><input type="number" placeholder="40000" value={roomCatForm.surchargeEarly} onChange={e=>setRoomCatForm({...roomCatForm, surchargeEarly: e.target.value})} className="w-full bg-black/60 border border-white/10 p-2 text-xs text-white rounded outline-none focus:border-[#D4FF00]"/></div>
                                <div><label className="text-[8px] text-zinc-400 block mb-1">Trễ / Giờ (VNĐ)</label><input type="number" placeholder="50000" value={roomCatForm.surchargeLate} onChange={e=>setRoomCatForm({...roomCatForm, surchargeLate: e.target.value})} className="w-full bg-black/60 border border-white/10 p-2 text-xs text-white rounded outline-none focus:border-[#D4FF00]"/></div>
                             </div>
                          </div>

                          <div className="space-y-3">
                            <input required placeholder="Tên Hạng (HẠNG STUDIO)" value={roomCatForm.name} onChange={e=>setRoomCatForm({...roomCatForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4FF00]"/>
                            <input required placeholder="Concept (Ấm áp, Chữa lành...)" value={roomCatForm.concept} onChange={e=>setRoomCatForm({...roomCatForm, concept: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4FF00]"/>
                            <textarea required rows={2} placeholder="Mô tả dài..." value={roomCatForm.description} onChange={e=>setRoomCatForm({...roomCatForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4FF00] custom-scrollbar"/>
                            <textarea required rows={3} placeholder="Tiện ích nổi bật (mỗi dòng 1 mục)" value={roomCatForm.features} onChange={e=>setRoomCatForm({...roomCatForm, features: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4FF00] custom-scrollbar"/>
                            <div className="h-24 border-2 border-dashed border-white/20 rounded-xl relative flex justify-center items-center overflow-hidden hover:border-[#D4FF00] bg-black/40">
                               <input type="file" accept="image/*" onChange={e=>handleImageUpload(e, setRoomCatForm, 'image')} className="absolute inset-0 opacity-0 cursor-pointer z-10"/>
                               {roomCatForm.image ? <img src={roomCatForm.image} className="w-full h-full object-cover"/> : <span className="text-[10px] text-zinc-500 font-bold uppercase">Tải ảnh đại diện hạng</span>}
                            </div>
                          </div>
                          <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(212,255,0,0.2)] mt-2">Lưu Cấu Hình</button>
                      </form>
                   ) : (
                      <form onSubmit={async (e)=>{
                          e.preventDefault();
                          if(!subRoomForm.image) return showAlert('Hãy tải ảnh chính lên!');
                          const catId = activeAdminCategory.id;
                          let current = roomsDb.find(r=>r.id===catId)?.subRooms || [];
                          const newData = {
                             id: editingSubRoomId || `${catId}-${Date.now()}`, name: subRoomForm.name, price: subRoomForm.price, bed: subRoomForm.bed, status: subRoomForm.status, youtubeLink: subRoomForm.youtubeLink || '',
                             image: subRoomForm.image, images: [subRoomForm.image, subRoomForm.image2, subRoomForm.image3].filter(Boolean), amenities: subRoomForm.amenities.split('\n').filter(f=>f.trim()!=='')
                          };
                          if (editingSubRoomId) current = current.map(x=>x.id===editingSubRoomId ? newData : x); else current.push(newData);
                          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms', catId), { subRooms: current });
                          setRoomEditMode(null); showAlert('Đã lưu phòng!');
                      }} className="space-y-4">
                          <div className="flex justify-between items-center border-b border-white/10 pb-4"><h5 className="font-bold text-[#D4FF00] uppercase text-xs tracking-widest leading-tight">{editingSubRoomId ? 'Sửa Phòng' : 'Thêm Phòng vào'}<br/><span className="text-white">{activeAdminCategory?.name}</span></h5><button type="button" onClick={()=>setRoomEditMode(null)} className="text-zinc-500 hover:text-white"><X size={16}/></button></div>
                          <input required placeholder="Tên phòng (Phòng Sun)" value={subRoomForm.name} onChange={e=>setSubRoomForm({...subRoomForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4FF00]"/>
                          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl"><label className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2"><PlayCircle size={14}/> Link hướng dẫn Youtube</label><input type="url" placeholder="https://youtu.be/..." value={subRoomForm.youtubeLink} onChange={e=>setSubRoomForm({...subRoomForm, youtubeLink: e.target.value})} className="w-full bg-black/60 border border-red-500/30 p-2.5 rounded-lg text-xs text-white outline-none focus:border-red-400"/></div>
                          <div className="grid grid-cols-2 gap-3">
                             <input required placeholder="Giá (Chữ - VD: 500K)" value={subRoomForm.price} onChange={e=>setSubRoomForm({...subRoomForm, price: e.target.value})} className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-[#D4FF00]"/>
                             <select value={subRoomForm.status} onChange={e=>setSubRoomForm({...subRoomForm, status: e.target.value})} className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-[#D4FF00]"><option value="Trống">Trống</option><option value="Đang dọn">Đang dọn</option><option value="Bảo trì">Bảo trì</option></select>
                             <input required placeholder="Giường (1 Giường đôi)" value={subRoomForm.bed} onChange={e=>setSubRoomForm({...subRoomForm, bed: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-[#D4FF00]"/>
                          </div>
                          <textarea required rows={4} placeholder="Tiện ích chi tiết phòng (Mỗi dòng 1 mục)" value={subRoomForm.amenities} onChange={e=>setSubRoomForm({...subRoomForm, amenities: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-[#D4FF00] custom-scrollbar"/>
                          
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Tải 3 góc ảnh phòng</label>
                          <div className="grid grid-cols-3 gap-2">
                             {['image', 'image2', 'image3'].map((imgKey, i) => (
                               <div key={imgKey} className="relative aspect-square border-2 border-dashed border-white/20 rounded-xl bg-black/40 flex flex-col justify-center items-center overflow-hidden hover:border-[#D4FF00] transition-colors">
                                  <input type="file" accept="image/*" onChange={e=>handleImageUpload(e, setSubRoomForm, imgKey)} className="absolute inset-0 opacity-0 cursor-pointer z-10"/>
                                  {subRoomForm[imgKey] ? <img src={subRoomForm[imgKey]} className="w-full h-full object-cover"/> : <><Plus size={16} className="text-zinc-600 mb-1"/><span className="text-[8px] text-zinc-500 font-bold uppercase">{i===0?'Ảnh chính':`Ảnh phụ ${i}`}</span></>}
                               </div>
                             ))}
                          </div>
                          <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest mt-4 hover:bg-[#D4FF00] transition-colors">Lưu Thông Tin Phòng</button>
                      </form>
                   )}
                </div>

                <div className="w-full md:w-7/12 p-6 overflow-y-auto custom-scrollbar bg-black/20">
                  <div className="flex justify-between items-end mb-6"><h4 className="text-sm font-bold text-white uppercase tracking-widest">Hệ Thống Phòng</h4></div>
                  {roomsDb.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10"><BedDouble size={48} className="text-zinc-600 mx-auto mb-4"/><button onClick={async ()=>{ for(const item of DEFAULT_ROOMS) await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms', item.id), item); showAlert("Đã nạp Hạng Phòng!"); }} className="bg-[#D4FF00] text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Tải Cấu Trúc Mặc Định</button></div>
                  ) : (
                    <div className="space-y-6">
                      {roomsDb.map(cat => (
                        <div key={cat.id} className="bg-white/5 border border-white/10 rounded-3xl p-5">
                           <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                              <img src={cat.image} className="w-16 h-12 rounded-lg object-cover opacity-80" alt=""/>
                              <div className="flex-1"><h5 className="font-black text-[#D4FF00] uppercase text-sm tracking-widest">{cat.name}</h5><p className="text-[10px] text-zinc-500 font-bold tracking-widest mt-1">GIÁ 2H: <span className="text-white">{cat.price2h ? formatPrice(Number(cat.price2h)) : 'Chưa set'}</span></p></div>
                              <div className="flex gap-2">
                                <button onClick={()=>{ setRoomCatForm({ name: cat.name, concept: cat.concept, description: cat.description, features: (cat.features||[]).join('\n'), image: cat.image, order: cat.order, price2h: cat.price2h||'', price3h: cat.price3h||'', price4h: cat.price4h||'', price5h: cat.price5h||'', price6h: cat.price6h||'', price7h: cat.price7h||'', price8h: cat.price8h||'', price9h: cat.price9h||'', price10h: cat.price10h||'', price30m: cat.price30m||'', surchargeEarly: cat.surchargeEarly||'', surchargeLate: cat.surchargeLate||'' }); setEditingCategoryId(cat.id); setRoomEditMode('category'); }} className="p-2 text-zinc-400 hover:text-[#D4FF00] bg-white/5 rounded-lg transition-colors"><Edit size={16}/></button>
                                <button onClick={()=>{ setActiveAdminCategory(cat); setSubRoomForm({ id: '', name: '', price: '', bed: '', amenities: '', image: null, image2: null, image3: null, status: 'Trống', youtubeLink: '' }); setEditingSubRoomId(null); setRoomEditMode('subroom'); }} className="px-3 py-2 text-white bg-white/10 hover:bg-[#D4FF00] hover:text-black rounded-lg transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider"><Plus size={14}/> Thêm P.</button>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 pl-2">
                              {(cat.subRooms || []).map(r => (
                                <div key={r.id} className="flex gap-3 bg-black/40 border border-white/5 rounded-xl p-3 items-center group/rm hover:border-white/20 transition-colors">
                                   <img src={r.image} className="w-12 h-12 rounded-lg object-cover shrink-0" alt=""/>
                                   <div className="flex-1 overflow-hidden"><h6 className="text-xs font-bold text-white truncate mb-1">{r.name}</h6><div className="flex items-center gap-2"><span className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${r.status==='Trống'?'bg-[#D4FF00]/20 text-[#D4FF00]':'bg-red-500/20 text-red-400'}`}>{r.status}</span>{r.youtubeLink && <PlayCircle size={12} className="text-red-500"/>}</div></div>
                                   <div className="flex flex-col gap-1">
                                     <button onClick={()=>{ setActiveAdminCategory(cat); setSubRoomForm({ id: r.id, name: r.name, price: r.price, bed: r.bed, amenities: (r.amenities||[]).join('\n'), status: r.status, image: r.images?.[0]||r.image, image2: r.images?.[1]||null, image3: r.images?.[2]||null, youtubeLink: r.youtubeLink||'' }); setEditingSubRoomId(r.id); setRoomEditMode('subroom'); }} className="p-1.5 text-zinc-500 hover:text-white bg-white/5 rounded-md"><Edit size={12}/></button>
                                     <button onClick={()=>{ showConfirm(`Xóa phòng ${r.name}?`, async () => { const filter = cat.subRooms.filter(x=>x.id!==r.id); await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms', cat.id), { subRooms: filter }); }); }} className="p-1.5 text-zinc-500 hover:text-red-500 bg-white/5 rounded-md"><Trash2 size={12}/></button>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CHI TIẾT VÉ ADMIN BÊN TRONG BẢNG BOOKINGS --- */}
      {viewingAdminBooking && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setViewingAdminBooking(null)}></div>
          <div className="w-full max-w-3xl bg-[#111] border border-white/20 rounded-3xl z-10 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50 shrink-0">
              <h4 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2">
                <CheckCircle size={16} className="text-[#D4FF00]"/>
                Chi Tiết Vé <span className="text-[#D4FF00]">{viewingAdminBooking.code}</span>
              </h4>
              <button onClick={() => setViewingAdminBooking(null)} className="text-zinc-500 hover:text-white p-1 transition-colors"><X size={20}/></button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col md:flex-row gap-8 bg-gradient-to-b from-zinc-950/50 to-transparent">
              <div className="w-full md:w-1/2 space-y-5">
                <h5 className="text-[10px] font-bold text-[#D4FF00] uppercase tracking-widest border-b border-white/10 pb-2">Hồ sơ khách hàng</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Tên khách đặt:</span><strong className="text-sm text-white">{viewingAdminBooking.guestData?.name || 'Khách Vãng Lai'}</strong></div>
                  <div><span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Ngày sinh:</span><strong className="text-sm text-white">{viewingAdminBooking.guestData?.dob || 'N/A'}</strong></div>
                  <div><span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">SĐT:</span><strong className="text-sm text-white">{viewingAdminBooking.guestData?.phone || 'N/A'}</strong></div>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-2">Ảnh mặt trước CCCD:</span>
                  {viewingAdminBooking.guestData?.cccdImage ? <div className="rounded-2xl border border-white/20 p-2 bg-black/50"><img src={viewingAdminBooking.guestData.cccdImage} alt="CCCD" className="w-full object-contain max-h-56 rounded-xl" /></div> : <div className="w-full h-32 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-zinc-500 bg-black/20"><ImageIcon size={24} className="mb-2 opacity-50" /><span className="text-xs uppercase tracking-widest font-bold">Không có</span></div>}
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-5">
                <h5 className="text-[10px] font-bold text-[#D4FF00] uppercase tracking-widest border-b border-white/10 pb-2">Dịch vụ lưu trú</h5>
                <div><span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Phòng đã chọn:</span><strong className="text-base text-white">{viewingAdminBooking.roomName} <span className="text-zinc-500 font-normal text-sm">({viewingAdminBooking.categoryName})</span></strong></div>
                <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10"><span className="text-[9px] text-zinc-400 uppercase tracking-widest block mb-1">Check-in</span><strong className="text-lg text-white block leading-none mb-1">{viewingAdminBooking.timeIn}</strong><span className="text-[10px] text-zinc-500">{viewingAdminBooking.dateIn}</span></div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10"><span className="text-[9px] text-zinc-400 uppercase tracking-widest block mb-1">Check-out</span><strong className="text-lg text-white block leading-none mb-1">{viewingAdminBooking.timeOut}</strong><span className="text-[10px] text-zinc-500">{viewingAdminBooking.dateOut}</span></div>
                </div>
                <div className="flex items-end justify-between border-b border-white/5 pb-4"><span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Tổng TT:</span><strong className="text-2xl font-serif italic text-[#D4FF00] leading-none">{formatPrice(viewingAdminBooking.totalPrice)}</strong></div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div><span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Pass cửa:</span><strong className="text-xl font-mono text-white tracking-widest">{viewingAdminBooking.passcode}</strong></div>
                  <div><span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Trạng thái:</span><span className={`inline-block text-[10px] px-3 py-1.5 rounded uppercase font-bold tracking-widest ${viewingAdminBooking.status === 'success' ? 'bg-[#D4FF00]/20 text-[#D4FF00] border border-[#D4FF00]/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>{viewingAdminBooking.status === 'success' ? 'Thành công' : 'Chờ TT'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MESSENGER FLOATING BUTTON --- */}
      <a href="https://m.me/102906751892078" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] bg-[#0084FF] hover:bg-[#00B2FF] text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(0,132,255,0.4)] hover:shadow-[0_4px_25px_rgba(0,178,255,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group">
        <svg viewBox="0 0 36 36" fill="currentColor" height="32" width="32"><path d="M18 1.836C9.13 1.836 1.936 8.528 1.936 16.78c0 4.673 2.3 8.841 5.92 11.664.195.152.316.386.326.634l.056 2.658c.026 1.258 1.348 2.012 2.44 1.398l3.14-1.761c.217-.122.468-.152.705-.087 1.135.31 2.336.48 3.577.48 8.87 0 16.064-6.693 16.064-14.944S26.87 1.836 18 1.836zm-2.482 19.34l-3.873-4.14a1.328 1.328 0 01.077-1.921l7.868-6.17c1.378-1.08 3.25.568 2.215 1.986l-3.873 4.14a1.328 1.328 0 01-.077 1.92l-7.868 6.171c-1.378 1.08-3.25-.568-2.215-1.986z"/></svg>
        <span className="absolute right-full mr-4 bg-white text-black text-[11px] font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">Chat với chúng tôi</span>
      </a>

      {/* --- INJECT STYLES --- */}
      <div dangerouslySetInnerHTML={{ __html: `
        <style>
          .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
          @keyframes slideUpFade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
          .animate-slide-up-fade { animation: slideUpFade 1s ease-out forwards; opacity: 0; }
        </style>
      ` }} />
    </div>
  );
}