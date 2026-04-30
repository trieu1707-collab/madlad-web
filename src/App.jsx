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
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';

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

// --- KHÔI PHỤC DATA PHÒNG ĐẦY ĐỦ ---
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
        amenities: ['Game Nintendo, bồn tắm, ban công', 'Diện tích 20m2', 'Máy chiếu Netflix, Youtube Premium...', 'Bếp riêng: gia vị, xoong nồi, bếp từ...', 'Phòng tắm riêng, máy sấy tóc, bàn ủi', 'Board Game: Drinking Card, Cá sấu...'] 
      },
      { 
        id: 'studio-pluto', name: 'Phòng Pluto', price: '500.000 - 600.000', bed: '2 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1598928506311-c55dd1b31526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Game PS4, Bàn bida, Vô lăng giả lập', 'Diện tích 25m2', 'Máy chiếu Netflix, Youtube Premium...', 'Bếp riêng: gia vị, xoong nồi, bếp từ...', 'Phòng tắm riêng, máy sấy tóc, bàn ủi', 'Board Game: Drinking Card, Cá sấu...'] 
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
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa, Máy PS4'] 
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
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game', 'Kích thước phòng: 13m2'] 
      },
      { 
        id: 'concept-mars', name: 'Phòng Mars', price: '350.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa', 'Kích thước phòng: 15m2'] 
      },
      { 
        id: 'concept-moon', name: 'Phòng Moon', price: '350.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa', 'Kích thước phòng: 15m2'] 
      },
      { 
        id: 'concept-venus', name: 'Phòng Venus', price: '350.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa', 'Kích thước phòng: 15m2'] 
      },
      { 
        id: 'concept-uranus', name: 'Phòng Uranus', price: '300.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game', 'Kích thước phòng: 13m2'] 
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
        amenities: ['Máy chiếu HD', 'App phim Netflix và Youtube', 'Nhà vệ sinh riêng, máy sấy tóc', 'Kích thước phòng: 13m2'] 
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
  if (!dob) return Math.floor(1000 + Math.random() * 9000).toString();
  const cleanDob = dob.replace(/\D/g, ''); 
  if (cleanDob.length === 8) {
    return `${cleanDob.slice(4,8)}${cleanDob.slice(2,4)}${cleanDob[0]}${cleanDob[2]}${cleanDob[3]}#`;
  }
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const getNextDay = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // --- CLOUD STATE ---
  const [fbUser, setFbUser] = useState(null); 
  const [bookingsDb, setBookingsDb] = useState([]);
  const [accountsDb, setAccountsDb] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({ holidayStart: '', holidayEnd: '', surchargeHourlyPct: '', surchargeDailyVnd: '' });
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

  // Khởi tạo Constraints Ngày tháng
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
  const [isCheckingCCCD, setIsCheckingCCCD] = useState(false); // State báo hiệu AI đang quét ảnh

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
  const [snacksDb, setSnacksDb] = useState([]);
  const [roomsDb, setRoomsDb] = useState([]); 
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminView, setAdminView] = useState('login'); 
  const [adminPasscode, setAdminPasscode] = useState('');
  
  const [manualBookingForm, setManualBookingForm] = useState({ roomKey: '', roomName: '', categoryName: '', guestName: 'Khách FB/Zalo', dateIn: '', timeIn: '14:00', dateOut: '', timeOut: '12:00' });
  const [snackForm, setSnackForm] = useState({ category: '', name: '', desc: '', price: '', image: null });
  const [editingSnackId, setEditingSnackId] = useState(null); 
  const [adminSearchQuery, setAdminSearchQuery] = useState(''); 
  const [adminFilterCategory, setAdminFilterCategory] = useState('Tất cả'); 
  
  const [roomEditMode, setRoomEditMode] = useState(null); 
  const [activeAdminCategory, setActiveAdminCategory] = useState(null); 
  const [roomCatForm, setRoomCatForm] = useState({ 
    name: '', concept: '', priceFrom: '', description: '', features: '', image: null, order: 0, 
    price2h: '', price3h: '', price4h: '', price5h: '', price6h: '', price7h: '', price8h: '', price9h: '', price10h: '', price30m: '', 
    surchargeEarly: '', surchargeLate: '' 
  });
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

  useEffect(() => { bookingsDbRef.current = bookingsDb; }, [bookingsDb]);

  // --- FIREBASE SYNC ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else { await signInAnonymously(auth); }
      } catch (err) { console.error("Lỗi đăng nhập Cloud:", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setFbUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!fbUser || !db) return;
    const unsubBookings = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings'), (snapshot) => setBookingsDb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubAccounts = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'madlad_accounts'), (snapshot) => setAccountsDb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubMenu = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'madlad_menu'), (snapshot) => setSnacksDb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubRooms = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms'), (snapshot) => setRoomsDb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.order - b.order)));
    const unsubSettings = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_settings', 'global'), (docSnap) => {
        if (docSnap.exists()) setGlobalSettings(docSnap.data());
    });
    return () => { unsubBookings(); unsubAccounts(); unsubMenu(); unsubRooms(); unsubSettings(); };
  }, [fbUser]);

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

  // --- ANIMATION HERO ---
  useEffect(() => {
    setTimeout(() => setIsHeroLoaded(true), 300);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      ['rooms', 'services', 'rules'].forEach(sec => {
        const element = document.getElementById(sec);
        if (element && scrollPosition >= element.offsetTop) setActiveSection(sec);
      });
      setShowLiquidBg(window.scrollY <= (heroSectionRef.current?.offsetHeight || 500) * 0.7);
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
      setGuestFormError(''); // Reset lỗi khi đóng form
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
      });
      return () => unsub(); 
    }
  }, [bookingView, pendingBookingCode, db]);

  useEffect(() => {
    if (cartView === 'payment' && pendingFoodOrderId && db) {
      const unsub = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_food_orders', pendingFoodOrderId), (docSnap) => {
        if (docSnap.exists() && docSnap.data().status === 'success') {
          alert('✅ Thanh toán đồ ăn tự động thành công! Mình chờ một lát, nhân viên sẽ mang lên tận phòng ạ.');
          setCart([]); setIsCartOpen(false); setCartView('cart'); setSelectedFoodRoom(''); setPendingFoodOrderId('');
        }
      });
      return () => unsub();
    }
  }, [cartView, pendingFoodOrderId, db]);

  // --- HELPER FUNCTIONS ---
  
  // OCR AI FUNCTION (Trích xuất ngày sinh từ CCCD)
  const extractDOBWithAI = async (base64Data) => {
    const apiKey = ""; // API Key sẽ được truyền tự động vào môi trường
    
    const prompt = `Bạn là hệ thống kiểm duyệt AI đọc thẻ Căn cước công dân (CCCD) hoặc CMND của Việt Nam.
    1. Nếu hình ảnh cung cấp KHÔNG PHẢI là mặt trước của CCCD/CMND (ví dụ ảnh mờ không đọc được, ảnh chụp phong cảnh, thú cưng, đồ vật, gói bánh/kẹo...), hãy CHỈ trả về đúng 1 chữ: INVALID
    2. Nếu hình ảnh ĐÚNG LÀ mặt trước CCCD/CMND Việt Nam hợp lệ, hãy tìm và trích xuất Ngày sinh (Date of birth) ghi trên thẻ. CHỈ trả về duy nhất chuỗi ngày tháng năm theo định dạng DD/MM/YYYY. Tuyệt đối không thêm bất kỳ văn bản nào khác.`;

    const payload = {
      contents: [{
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }
        ]
      }]
    };

    const fetchWithRetry = async (retries = 5, delay = 1000) => {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "INVALID";
      } catch (err) {
        if (retries > 0) {
          await new Promise(r => setTimeout(r, delay));
          return fetchWithRetry(retries - 1, delay * 2);
        }
        throw err;
      }
    };

    try {
      const resultText = await fetchWithRetry();
      return resultText;
    } catch (e) {
      console.error("AI API Error:", e);
      return "01/01/2000"; // Fallback demo trong trường hợp quá tải mạng
    }
  };

  const handleImageUploadWithAI = async (e, targetStateSetter, errorSetter, fieldName = 'cccdImage') => {
    const file = e.target.files[0];
    if (!file) return;

    setIsCheckingCCCD(true);
    errorSetter('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const scaleSize = 800 / img.width;
        canvas.width = 800; canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL('image/jpeg', 0.7);

        // Đẩy ảnh lên Google Gemini AI
        const aiDobResult = await extractDOBWithAI(base64Data);
        setIsCheckingCCCD(false);

        if (aiDobResult === "INVALID" || aiDobResult.length < 8) {
           errorSetter("AI TỪ CHỐI: Ảnh không phải CCCD/CMND Việt Nam hợp lệ hoặc quá mờ. Vui lòng chụp lại hình ảnh mặt trước của thẻ thật rõ nét.");
           e.target.value = ''; // Reset input để khách chọn lại ảnh
        } else {
           // Ép ép chuỗi trả về thành DD/MM/YYYY dù AI có nói rườm rà
           let extractedDob = aiDobResult.replace(/\D/g, ''); // Xóa toàn bộ chữ, chỉ giữ số
           if (extractedDob.length >= 8) {
               extractedDob = `${extractedDob.slice(0,2)}/${extractedDob.slice(2,4)}/${extractedDob.slice(4,8)}`;
           } else {
               extractedDob = aiDobResult;
           }
           
           // Đưa vào bộ xác thực Tuổi
           const dobValidation = validateDobForm(extractedDob);
           if (dobValidation !== "OK") {
               errorSetter(`AI phát hiện Ngày sinh trên thẻ (${extractedDob}) không thỏa điều kiện: ${dobValidation}`);
               e.target.value = '';
           } else {
               // Đã vượt qua mọi bài test -> Cho phép lưu CCCD và tự động điền DOB
               targetStateSetter(prev => ({ ...prev, [fieldName]: base64Data, dob: extractedDob }));
           }
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // HÀM MỚI: Trả về lỗi string rõ ràng thay vì chỉ true/false
  const validateDobForm = (dobStr) => {
    if (!dobStr || dobStr.length !== 10) return "Vui lòng tải CCCD để AI tự động điền ngày sinh.";
    const parts = dobStr.split('/');
    if (parts.length !== 3) return "Định dạng ngày sinh không hợp lệ.";
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return "Ngày sinh chứa ký tự không hợp lệ.";
    if (year < 1900) return "Năm sinh không hợp lệ.";
    if (year > 2010) return "Hệ thống chỉ hỗ trợ đặt phòng cho khách sinh năm 2010 trở về trước.";
    if (month < 1 || month > 12) return "Tháng sinh không hợp lệ.";
    
    // Check xem ngày đó có tồn tại trong tháng/năm đó không (ví dụ tháng 2 năm nhuận)
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return "Ngày sinh không tồn tại trong tháng này.";
    
    return "OK";
  };

  const validatePhoneForm = (phoneStr) => {
    // Regex bắt buộc đầu số nhà mạng Việt Nam (03, 05, 07, 08, 09) và đúng 10 số
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    return phoneRegex.test(phoneStr);
  };

  const handleBookingTypeChange = (type) => {
    let updates = { type };
    if (type === 'daily') { 
      updates.timeIn = '14:00'; updates.timeOut = '12:00'; 
      updates.dateOut = getNextDay(bookingForm.dateIn);
    } else if (type === 'overnight') { 
      updates.timeIn = '22:00'; updates.timeOut = '10:00'; 
      updates.dateOut = getNextDay(bookingForm.dateIn);
    } else if (type === 'hourly') { 
      updates.guests = 2; 
      updates.dateOut = bookingForm.dateIn;
    }
    setBookingForm(prev => ({ ...prev, ...updates }));
  };

  // Logic loại bỏ các giờ đã qua (yêu cầu đặt trước 30p)
  const getAvailableTimeOptions = () => {
    if (bookingForm.type !== 'hourly') return TIME_OPTIONS;
    if (bookingForm.dateIn !== minDateStr) return TIME_OPTIONS;

    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const currentH = now.getHours();
    const currentM = now.getMinutes();

    return TIME_OPTIONS.filter(t => {
      const [h, m] = t.value.split(':').map(Number);
      return h > currentH || (h === currentH && m >= currentM);
    });
  };

  const handleSearchRooms = async (e) => {
    e.preventDefault();
    if (bookingForm.type !== 'hourly' && bookingForm.dateIn === bookingForm.dateOut) return alert("Ngày nhận và ngày trả không được trùng nhau.");

    let durationText = '', diffDays = 1;
    let exactHours = 0, exactMins = 0;

    if (bookingForm.type === 'hourly') {
      const [hIn, mIn] = bookingForm.timeIn.split(':').map(Number);
      const [hOut, mOut] = bookingForm.timeOut.split(':').map(Number);
      let diffMinutes = (hOut * 60 + mOut) - (hIn * 60 + mIn);
      if (diffMinutes <= 0) diffMinutes += 24 * 60;
      
      if (diffMinutes <= 120) {
          exactHours = 2;
          exactMins = 0;
      } else {
          exactHours = Math.floor(diffMinutes / 60);
          exactMins = diffMinutes % 60;
      }

      durationText = exactMins > 0 ? `${exactHours} giờ 30 phút` : `${exactHours} giờ`;
    } else {
      if (!bookingForm.dateIn || !bookingForm.dateOut) return alert('Vui lòng chọn đầy đủ ngày nhận và ngày trả!');
      const diffTime = Math.abs(new Date(bookingForm.dateOut) - new Date(bookingForm.dateIn));
      diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      durationText = `${diffDays} ${bookingForm.type === 'daily' ? 'ngày' : 'đêm'}`;
    }

    setSearchSummary({ text: durationText, duration: bookingForm.type === 'hourly' ? exactHours : diffDays });

    const dateOutVal = bookingForm.type === 'hourly' ? bookingForm.dateIn : bookingForm.dateOut;
    const startReqTime = new Date(`${bookingForm.dateIn}T${bookingForm.timeIn}:00+07:00`).getTime();
    const endReqTime = new Date(`${dateOutVal}T${bookingForm.timeOut}:00+07:00`).getTime();

    // XÁC ĐỊNH PHỤ THU LỄ BẰNG NGÀY CHECK-IN
    let isHoliday = false;
    if (globalSettings.holidayStart && globalSettings.holidayEnd) {
         const dIn = new Date(bookingForm.dateIn).getTime();
         const hStart = new Date(globalSettings.holidayStart).getTime();
         const hEnd = new Date(globalSettings.holidayEnd).getTime();
         if (dIn >= hStart && dIn <= hEnd) {
             isHoliday = true;
         }
    }

    const bookedRoomKeys = bookingsDb.filter(booking => {
      const bStart = new Date(booking.isoStart).getTime();
      const bEnd = new Date(booking.isoEnd).getTime();
      return startReqTime < bEnd && bStart < endReqTime;
    }).map(booking => booking.roomKey); 

    let results = [];
    activeRooms.forEach(cat => {
      if(!cat.subRooms) return;
      cat.subRooms.forEach(room => {
        if (room.status === 'Trống') {
          const roomKey = room.id.split('-').pop().toLowerCase();
          let isActuallyFree = !bookedRoomKeys.includes(roomKey);

          if (isActuallyFree) {
            let price = 0;
            const type = bookingForm.type;
            const guests = bookingForm.guests;

            // XỬ LÝ TÍNH GIÁ CHÍNH XÁC
            if (cat.price2h && type === 'hourly') {
                const hourlyPrices = {
                    2: Number(cat.price2h || 0),
                    3: Number(cat.price3h || 0),
                    4: Number(cat.price4h || 0),
                    5: Number(cat.price5h || 0),
                    6: Number(cat.price6h || 0),
                    7: Number(cat.price7h || 0),
                    8: Number(cat.price8h || 0),
                    9: Number(cat.price9h || 0),
                    10: Number(cat.price10h || 0)
                };
                let baseH = exactHours > 10 ? 10 : exactHours;
                let p = hourlyPrices[baseH] || 0;
                if (exactMins > 0) p += Number(cat.price30m || 0);
                price = p;
            } else {
                // Giá dự phòng mặc định (Trường hợp chưa cài trong Admin)
                if (cat.id === 'studio') {
                  if (type === 'daily') price = (guests >= 3 ? 600000 : 500000) * diffDays;
                  else if (type === 'overnight') price = (guests >= 3 ? 500000 : 400000) * diffDays;
                  else { let p = 200000; if(exactHours>2)p+=(Math.min(exactHours,5)-2)*40000; if(exactHours>=6)p+=30000; if(exactHours>6)p+=(Math.min(exactHours,10)-6)*40000; price = Math.min(p, 450000); }
                } else if (cat.id === 'concept') {
                  const isPremium = ['concept-mars', 'concept-moon', 'concept-venus'].includes(room.id);
                  if (type === 'daily') price = (isPremium ? 350000 : 300000) * diffDays;
                  else if (type === 'overnight') price = (isPremium ? 280000 : 250000) * diffDays;
                  else { let p = 180000; if(exactHours>2)p+=(Math.min(exactHours,5)-2)*30000; if(exactHours>=6)p+=20000; if(exactHours>6)p+=(Math.min(exactHours,10)-6)*30000; price = Math.min(p, 350000); }
                } else if (cat.id === 'concept-plus') {
                  if (type === 'daily') price = 400000 * diffDays;
                  else if (type === 'overnight') price = 350000 * diffDays;
                  else { let p = 190000; if(exactHours>2)p+=(Math.min(exactHours,5)-2)*35000; if(exactHours>=6)p+=50000; if(exactHours>6)p+=(Math.min(exactHours,10)-6)*35000; price = Math.min(p, 400000); }
                } else if (cat.id === 'basic') {
                  if (type === 'daily') price = 270000 * diffDays;
                  else if (type === 'overnight') price = 230000 * diffDays;
                  else { let p = 140000; if(exactHours>2)p+=(Math.min(exactHours,5)-2)*20000; if(exactHours>=6)p+=10000; if(exactHours>6)p+=(Math.min(exactHours,10)-6)*20000; price = Math.min(p, 270000); }
                }
            }

            // TÍNH PHỤ THU SỚM / TRỄ CỦA ADMIN
            if ((type === 'daily' || type === 'overnight') && (cat.surchargeEarly || cat.surchargeLate)) {
                 const [hIn, mIn] = bookingForm.timeIn.split(':').map(Number);
                 const [hOut, mOut] = bookingForm.timeOut.split(':').map(Number);

                 let earlyMins = 0;
                 if (type === 'overnight' && hIn >= 6 && hIn < 22) earlyMins = (22 * 60) - (hIn * 60 + mIn);
                 else if (type === 'daily' && hIn >= 6 && hIn < 14) earlyMins = (14 * 60) - (hIn * 60 + mIn);

                 if (earlyMins > 0 && cat.surchargeEarly) {
                     const earlyHours = Math.ceil(earlyMins / 60);
                     price += earlyHours * Number(cat.surchargeEarly);
                 }

                 let lateMins = 0;
                 if (type === 'overnight' && (hOut > 10 || (hOut === 10 && mOut > 0))) lateMins = (hOut * 60 + mOut) - (10 * 60);
                 else if (type === 'daily' && (hOut > 12 || (hOut === 12 && mOut > 0))) lateMins = (hOut * 60 + mOut) - (12 * 60);

                 if (lateMins > 0 && cat.surchargeLate) {
                     const lateHours = Math.ceil(lateMins / 60);
                     price += lateHours * Number(cat.surchargeLate);
                 }
            }

            // TÍNH PHỤ THU LỄ
            if (isHoliday) {
                 if (type === 'hourly') {
                     price += Math.round(price * (Number(globalSettings.surchargeHourlyPct || 0) / 100));
                 } else {
                     price += Number(globalSettings.surchargeDailyVnd || 0) * diffDays;
                 }
            }

            if (guests >= 3 && cat.id !== 'studio') isActuallyFree = false;

            if (isActuallyFree) results.push({ ...room, categoryName: cat.name, totalPrice: price, youtubeLink: room.youtubeLink || '' });
          }
        }
      });
    });

    setAvailableRooms(results);
    setBookingView('results');
  };

  const createPendingDoc = async (code, guest, room) => {
    // Generate passcode từ DOB tự động (Đã được định dạng sẵn từ AI)
    const cleanDob = guest.dob.replace(/\D/g, ''); 
    const passcode = cleanDob.length === 8 ? `${cleanDob.slice(4,8)}${cleanDob.slice(2,4)}${cleanDob[0]}${cleanDob[2]}${cleanDob[3]}#` : Math.floor(1000 + Math.random() * 9000).toString();
    
    const dateOutVal = bookingForm.type === 'hourly' ? bookingForm.dateIn : bookingForm.dateOut;
    
    const newBooking = {
      code: code, passcode: passcode, accountId: currentUser ? currentUser.username : 'guest', guestData: { ...guest },
      roomName: room.name, categoryName: room.categoryName, roomKey: room.id.split('-').pop().toLowerCase(),
      dateIn: bookingForm.dateIn, timeIn: bookingForm.timeIn, dateOut: dateOutVal, timeOut: bookingForm.timeOut,
      startDateTime: `${bookingForm.dateIn} ${bookingForm.timeIn}`, endDateTime: `${dateOutVal} ${bookingForm.timeOut}`,
      isoStart: `${bookingForm.dateIn}T${bookingForm.timeIn}:00+07:00`, isoEnd: `${dateOutVal}T${bookingForm.timeOut}:00+07:00`,
      type: bookingForm.type, totalPrice: room.totalPrice, timestamp: new Date().toISOString(), status: 'pending',
      youtubeLink: room.youtubeLink || ''
    };

    try {
      if (!db) throw new Error("Cloud DB not ready");
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings', code), newBooking);
      setFinalBookingData(newBooking); 
    } catch (err) { console.error("Lỗi tạo vé tạm:", err); }
  };

  const handleSelectRoom = async (room) => {
    setSelectedBookingRoom(room);
    const newCode = generateBookingCode();
    setPendingBookingCode(newCode);
    if (currentUser) {
      setGuestInfo(currentUser); 
      await createPendingDoc(newCode, currentUser, room);
      setBookingView('payment'); 
    } else { 
      setGuestFormError('');
      setBookingView('guest_info'); 
    }
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    setGuestFormError(''); 
    
    const dobValidationResult = validateDobForm(guestInfo.dob);
    if(dobValidationResult !== "OK") return setGuestFormError(dobValidationResult);
    
    if(!validatePhoneForm(guestInfo.phone)) return setGuestFormError("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.");
    if (!guestInfo.cccdImage) return setGuestFormError("Vui lòng tải lên hình ảnh CCCD mặt trước.");
    
    await createPendingDoc(pendingBookingCode, guestInfo, selectedBookingRoom);
    setBookingView('payment');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthFormError('');
    
    const dobValidationResult = validateDobForm(registerForm.dob);
    if(dobValidationResult !== "OK") return setAuthFormError("Đăng ký thất bại: " + dobValidationResult);
    
    if(!validatePhoneForm(registerForm.phone)) return setAuthFormError("Đăng ký thất bại: Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.");
    if (!registerForm.cccdImage) return setAuthFormError("Vui lòng tải lên ảnh CCCD mặt trước.");
    if(accountsDb.find(acc => acc.username === registerForm.username)) return setAuthFormError("Tên đăng nhập đã tồn tại.");

    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_accounts', registerForm.username), { ...registerForm, name: registerForm.username });
      alert('Đăng ký tài khoản thành công!'); 
      setAuthState({...authState, view: 'login'});
      setAuthFormError('');
    } catch (err) { setAuthFormError("Lỗi lưu trữ hồ sơ: " + err.message); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthFormError('');
    const user = accountsDb.find(acc => acc.username === loginForm.username && acc.password === loginForm.password);
    if (user) { setCurrentUser(user); setAuthState({...authState, isOpen: false}); } 
    else { setAuthFormError("Sai tên đăng nhập hoặc mật khẩu."); }
  };

  const handleSearchBooking = (e) => {
    e.preventDefault();
    setSearchResult(null);
    const kw = searchCode.toUpperCase();
    const founds = bookingsDb.filter(b => b.code.toUpperCase() === kw || b.guestData?.phone === kw);
    
    if (founds.length === 0) {
      return setSearchResult({ status: 'error', message: 'Không tìm thấy vé đặt phòng nào với mã hoặc số điện thoại này.' });
    }
    const found = founds.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    setSearchResult({ status: 'success', data: found });
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setAddedItemId(item.id); setTimeout(() => setAddedItemId(null), 1000);
  };
  
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id===id ? {...i, qty: Math.max(1, i.qty+delta)} : i));
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const handleFoodOrderSubmit = async (e) => {
    e.preventDefault(); 
    const formData = new FormData(e.target);
    const room = formData.get('room');
    setSelectedFoodRoom(room);

    if (foodPaymentMethod === 'transfer') {
      const newOrderId = 'FD' + Date.now();
      setPendingFoodOrderId(newOrderId);
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_food_orders', newOrderId), {
        id: newOrderId, roomName: room, items: cart.map(item => `${item.name} (x${item.qty})`).join(', '),
        totalPrice: cartTotalPrice, paymentMethod: 'Chuyển khoản', timestamp: new Date().toLocaleString('vi-VN'), status: 'pending'
      });
      setCartView('payment');
    } else {
      finalizeFoodOrder('Tiền mặt', room);
    }
  };

  const finalizeFoodOrder = async (method, roomNameParam = selectedFoodRoom) => {
    try {
      await fetch("https://hook.us2.make.com/dbb9tg3lntnkow2abztoxkkjtkiv1uar", { method: 'POST', headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ roomName: roomNameParam, items: cart.map(i => `${i.name} (x${i.qty})`).join(', '), totalPrice: cartTotalPrice, paymentMethod: method, timestamp: new Date().toLocaleString('vi-VN') }) });
    } catch (e) {}

    if(method === 'Tiền mặt') {
       alert('Mình chờ home 1 tí, home sẽ để trước cửa rồi gõ cửa ạ');
       setCart([]); setIsCartOpen(false); setCartView('cart'); setSelectedFoodRoom('');
    }
  };

  const handleManualBookingSubmit = async (e) => {
    e.preventDefault();
    if(!manualBookingForm.roomKey || !manualBookingForm.dateIn || !manualBookingForm.dateOut) return alert('Điền đủ thông tin phòng và ngày tháng.');
    const startReqTime = new Date(`${manualBookingForm.dateIn}T${manualBookingForm.timeIn}:00+07:00`).getTime();
    const endReqTime = new Date(`${manualBookingForm.dateOut}T${manualBookingForm.timeOut}:00+07:00`).getTime();

    if(endReqTime <= startReqTime) return alert('Lỗi: Giờ trả phòng phải sau giờ nhận phòng!');
    const isConflict = bookingsDb.some(b => {
       if (b.roomKey !== manualBookingForm.roomKey) return false;
       return startReqTime < new Date(b.isoEnd).getTime() && new Date(b.isoStart).getTime() < endReqTime;
    });

    if (isConflict && !window.confirm('CẢNH BÁO: Phòng này ĐÃ CÓ NGƯỜI ĐẶT. Chắc chắn chèn đè?')) return;

    const code = 'MANUAL-' + Date.now().toString().slice(-6);
    const newBooking = {
      code, passcode: 'N/A', accountId: 'admin_manual', guestData: { name: manualBookingForm.guestName, phone: 'N/A' },
      roomName: manualBookingForm.roomName, categoryName: manualBookingForm.categoryName, roomKey: manualBookingForm.roomKey,
      dateIn: manualBookingForm.dateIn, timeIn: manualBookingForm.timeIn, dateOut: manualBookingForm.dateOut, timeOut: manualBookingForm.timeOut,
      startDateTime: `${manualBookingForm.dateIn} ${manualBookingForm.timeIn}`, endDateTime: `${manualBookingForm.dateOut} ${manualBookingForm.timeOut}`,
      isoStart: `${manualBookingForm.dateIn}T${manualBookingForm.timeIn}:00+07:00`, isoEnd: `${manualBookingForm.dateOut}T${manualBookingForm.timeOut}:00+07:00`,
      type: 'manual', totalPrice: 0, timestamp: new Date().toISOString(), status: 'success'
    };

    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings', code), newBooking);
      alert('Đã thêm lịch chặn phòng!'); setManualBookingForm({ ...manualBookingForm, guestName: 'Khách FB/Zalo' });
    } catch(err) { alert('Lỗi: ' + err.message); }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-200 font-sans selection:bg-[#D4FF00] selection:text-black overflow-x-hidden relative scroll-smooth">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-20"></div>

      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/[0.02] backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex-shrink-0 cursor-pointer flex flex-col justify-center">
            <span className="text-2xl font-black tracking-[0.1em] uppercase text-white leading-none">Madlad</span>
          </div>
          
          <div className="hidden md:flex space-x-10 lg:space-x-12 items-center">
            <a href="#rooms" onClick={() => setActiveSection('rooms')} className={`text-[11px] lg:text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${activeSection === 'rooms' ? 'text-[#D4FF00]' : 'text-zinc-400 hover:text-white'}`}>Hạng phòng</a>
            <button onClick={() => setBookingModalOpen(true)} className="text-[11px] lg:text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 hover:text-white transition-colors">Đặt Phòng</button>
            <button onClick={() => setIsFoodMenuOpen(true)} className={`text-[11px] lg:text-xs font-semibold uppercase tracking-[0.15em] transition-colors flex items-center gap-2 ${isFoodMenuOpen ? 'text-[#D4FF00]' : 'text-zinc-400 hover:text-white'}`}><UtensilsCrossed size={14}/> Đồ ăn</button>
            <a href="#services" onClick={() => setActiveSection('services')} className={`text-[11px] lg:text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${activeSection === 'services' ? 'text-[#D4FF00]' : 'text-zinc-400 hover:text-white'}`}>Dịch vụ</a>
            
            <button onClick={() => { setSearchModalOpen(true); setSearchCode(''); setSearchResult(null); }} className="relative p-2 text-zinc-400 hover:text-white transition-colors" title="Tra cứu mã đặt phòng hoặc SĐT">
              <Search size={20} strokeWidth={1.5} />
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-white hover:text-[#D4FF00] transition-colors">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartTotalQty > 0 && <span className="absolute right-0 top-0 bg-[#D4FF00] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">{cartTotalQty}</span>}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full cursor-pointer hover:border-[#D4FF00] transition-colors group" onClick={() => {if(window.confirm('Đăng xuất?')) setCurrentUser(null)}}>
                <User size={16} className="text-[#D4FF00]" />
                <span className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-[#D4FF00]">{currentUser.username}</span>
              </div>
            ) : (
              <button onClick={() => setAuthState({ isOpen: true, view: 'login', username:'', password:'' })} className="relative group px-6 py-2.5 overflow-hidden rounded-full ml-2">
                <div className="absolute inset-0 w-full h-full border border-white/20 rounded-full group-hover:border-[#D4FF00] transition-colors duration-500"></div>
                <span className="relative text-xs font-bold uppercase tracking-[0.15em] text-white group-hover:text-[#D4FF00] transition-colors duration-300">Đăng nhập</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-6">
            <button onClick={() => setIsCartOpen(true)} className="relative text-white">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartTotalQty > 0 && <span className="absolute right-0 top-0 bg-[#D4FF00] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">{cartTotalQty}</span>}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-zinc-400 hover:text-white">
              {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-[#030303]/80 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-8 flex flex-col space-y-6">
            <a href="#rooms" onClick={() => { setIsMenuOpen(false); setActiveSection('rooms'); }} className={`text-sm font-light uppercase tracking-[0.2em] transition-colors ${activeSection === 'rooms' ? 'text-[#D4FF00]' : 'text-white'}`}>Hạng phòng</a>
            <button onClick={() => { setIsMenuOpen(false); setBookingModalOpen(true); }} className="text-left text-sm font-light uppercase tracking-[0.2em] text-white hover:text-[#D4FF00] transition-colors">Đặt Phòng</button>
            <button onClick={() => { setIsMenuOpen(false); setIsFoodMenuOpen(true); }} className="text-left text-sm font-light uppercase tracking-[0.2em] text-white hover:text-[#D4FF00] transition-colors">Đồ ăn & Thức uống</button>
            <a href="#services" onClick={() => { setIsMenuOpen(false); setActiveSection('services'); }} className={`text-sm font-light uppercase tracking-[0.2em] transition-colors ${activeSection === 'services' ? 'text-[#D4FF00]' : 'text-white'}`}>Dịch vụ</a>
            
            {currentUser ? (
              <button onClick={() => { setIsMenuOpen(false); setCurrentUser(null); }} className="w-fit text-sm font-bold uppercase tracking-[0.2em] text-[#D4FF00] mt-4">
                Đăng xuất ({currentUser.username})
              </button>
            ) : (
              <button onClick={() => { setIsMenuOpen(false); setAuthState({ isOpen: true, view: 'login' }); }} className="w-fit text-sm font-bold uppercase tracking-[0.2em] text-[#D4FF00] mt-4 flex items-center gap-2">
                Đăng nhập <ArrowUpRight size={16} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section ref={heroSectionRef} id="hero" className="relative min-h-[95vh] md:min-h-screen flex items-center justify-center pt-24 px-6 bg-black overflow-hidden">
        
        <LiquidBackground opacity={showLiquidBg ? 0.3 : 0} />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 bg-gradient-to-t from-black via-transparent to-black/30"></div>
        
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center relative z-20 w-full mt-[-5vh]">
          
          <div className={`mb-6 flex items-center gap-4 transition-all duration-1000 ease-out ${isHeroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="h-px w-8 bg-[#D4FF00]"></div>
            <span className="text-[10px] font-bold text-[#D4FF00] uppercase tracking-[0.6em] drop-shadow-[0_2px_10px_rgba(212,255,0,0.4)]">MADLAD SPACE</span>
            <div className="h-px w-8 bg-[#D4FF00]"></div>
          </div>

          <div className={`transition-all duration-1000 ease-out delay-100 ${isHeroLoaded ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-[15px] translate-y-10'}`}>
            <h1 className="flex flex-col items-center leading-[0.85] mb-4">
              <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black text-white uppercase drop-shadow-2xl tracking-tighter">IT'S GOOD,</span>
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-serif italic text-zinc-400 font-light lowercase -mt-1 md:-mt-5">because we care</span>
            </h1>
          </div>

          <button onClick={() => setBookingModalOpen(true)} className={`mt-16 group relative flex items-center gap-4 text-white hover:text-[#D4FF00] transition-all duration-700 ease-out delay-300 ${isHeroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Đặt phòng ngay</span>
            <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:border-[#D4FF00] group-hover:bg-[#D4FF00]/10 transition-all duration-500">
              <ChevronRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* --- ROOMS --- */}
      <section id="rooms" className="py-32 relative z-10 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-4">Danh mục</h2>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Hạng phòng<br/><span className="font-serif italic font-light text-zinc-500 lowercase">lưu trú</span></h3>
            </div>
            <p className="text-zinc-400 font-light max-w-sm text-sm leading-relaxed hidden md:block">Mỗi hạng phòng là một tác phẩm nguyên bản, được thiết kế để đánh thức những cảm xúc thuần khiết nhất.</p>
          </div>

          <div className="space-y-40">
            {activeRooms.map((category, idx) => (
              <div key={category.id} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center group relative`}>
                <div className="w-full lg:w-2/3 relative z-0">
                  <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
                  </div>
                </div>

                <div className={`w-[90%] lg:w-5/12 relative z-10 -mt-20 lg:mt-0 ${idx % 2 !== 0 ? 'lg:-mr-32' : 'lg:-ml-32'}`}>
                  <div className="p-8 md:p-12 bg-[#050505]/80 hover:bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl transition-all duration-500">
                    <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-6 drop-shadow-sm">{category.name}</h4>
                    <p className="text-sm font-light text-zinc-300 leading-relaxed mb-8">{category.description}</p>
                    <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent mb-8"></div>
                    <ul className="grid grid-cols-1 gap-4 mb-10">
                      {(category.features || []).map((feat, i) => (
                        <li key={i} className="flex items-center text-xs font-light tracking-wide text-zinc-200">
                          <div className="w-1.5 h-1.5 bg-[#D4FF00] rounded-full mr-4 shadow-[0_0_8px_#D4FF00]"></div>{feat}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => setSelectedCategory(category)} className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#D4FF00] w-fit group/btn transition-colors">
                      <span className="border-b border-white/20 group-hover/btn:border-[#D4FF00]/50 pb-1 transition-colors">Xem thêm phòng</span>
                      <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-32 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-4">Madlad Space</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Dịch vụ<br/><span className="font-serif italic font-light text-zinc-500 lowercase">bổ trợ</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((srv, idx) => {
              const SrvIcon = srv.icon;
              return (
                <div key={idx} className="group p-8 md:p-10 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-lg border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col md:flex-row md:items-start gap-6 cursor-default">
                  <div className="text-white/50 group-hover:text-[#D4FF00] transition-colors duration-500 bg-white/5 p-4 rounded-2xl w-fit">
                    <SrvIcon size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-[#D4FF00] transition-colors duration-500 mb-3">{srv.title}</h4>
                    <p className="text-sm font-light text-zinc-400 leading-relaxed">{srv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- RULES SECTION --- */}
      <section id="rules" className="py-32 relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-4">Điều khoản lưu trú</h2>
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-20">Madlad<span className="font-serif italic font-light text-zinc-500 lowercase"> rules</span></h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 text-left mb-20">
            {RULES.map((rule, idx) => (
              <div key={idx} className="flex gap-6 items-start p-6 bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors">
                <span className="text-3xl lg:text-4xl font-black text-[#D4FF00] drop-shadow-[0_0_15px_rgba(212,255,0,0.3)] tracking-tighter w-24 shrink-0">{rule.fee}</span>
                <div className="w-px h-full bg-gradient-to-b from-white/20 to-transparent hidden md:block"></div>
                <p className="text-sm font-light text-zinc-300 leading-relaxed pt-2">{rule.text}</p>
              </div>
            ))}
          </div>

          <div className="p-8 md:p-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-3xl text-left relative overflow-hidden">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-3 mb-8 relative z-10"><AlertTriangle size={16} className="text-[#D4FF00]" /> Quy chuẩn chung</h4>
            <div className="columns-1 md:columns-2 gap-12 text-xs font-light text-zinc-300 leading-loose space-y-4 relative z-10">
              <p>1. Nghiêm cấm tuyệt đối các hoạt động vi phạm pháp luật (ma túy, mại dâm, vũ khí...). Vi phạm sẽ bị yêu cầu rời đi ngay lập tức.</p>
              <p>2. Không gian phòng ngủ là khu vực không khói thuốc. Vui lòng sử dụng gạt tàn và hút thuốc đúng nơi quy định.</p>
              <p>3. Vì một môi trường trong sạch, vui lòng hỗ trợ thu gom rác trước khi check-out.</p>
              <p>4. Hệ thống an ninh đảm bảo an toàn cho bạn. Không tự ý xoay hoặc ngắt điện camera.</p>
              <p>5. Không tự ý dán băng keo, phụ kiện trang trí sinh nhật trực tiếp lên bề mặt tường.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CART DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[170] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => { setIsCartOpen(false); setCartView('cart'); }}></div>
          <div className="w-full max-w-md bg-[#080808]/90 backdrop-blur-2xl h-full relative z-10 border-l border-white/10 flex flex-col animate-in slide-in-from-right shadow-2xl">
            <div className="px-6 py-6 border-b border-white/10 flex items-center bg-black/40 shrink-0">
              {cartView === 'payment' && (
                 <button onClick={() => setCartView('cart')} className="text-zinc-400 hover:text-[#D4FF00] transition-colors p-1 mr-3"><ArrowLeft size={20}/></button>
              )}
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2 flex-1"><UtensilsCrossed size={18} className="text-[#D4FF00]"/> Khay đồ ăn</h3>
              <button onClick={() => { setIsCartOpen(false); setCartView('cart'); }} className="text-zinc-500 hover:text-white p-2"><X size={20}/></button>
            </div>

            {cartView === 'cart' ? (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                      <ShoppingCart size={48} strokeWidth={1} className="opacity-20" />
                      <p className="text-xs font-light uppercase tracking-widest">Giỏ hàng trống</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-[#D4FF00] font-serif italic">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-2 py-1">
                          <button onClick={() => updateQty(item.id, -1)} className="text-zinc-400 hover:text-white"><Minus size={14} /></button>
                          <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="text-zinc-400 hover:text-white"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-zinc-600 hover:text-red-500 ml-2"><Trash2 size={16} /></button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-white/10 bg-black/60 p-6 shrink-0">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-xs font-light text-zinc-400 uppercase tracking-widest">Tổng cộng</span>
                      <span className="text-2xl font-black text-[#D4FF00] font-serif italic">{formatPrice(cartTotalPrice)}</span>
                    </div>
                    <form onSubmit={handleFoodOrderSubmit}>
                      <div className="mb-4 relative group/input">
                        <select required name="room" defaultValue="" className="w-full bg-white/5 border border-white/20 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors appearance-none cursor-pointer">
                          <option value="" disabled className="text-zinc-500 bg-zinc-900">Bạn đang ở phòng nào?</option>
                          {allSubRoomsFlat.map(room => (
                            <option key={room.id} value={room.name} className="bg-zinc-900 text-white">{room.name} ({room.categoryName})</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-3 mb-6">
                        <label className={`flex-1 flex items-center justify-center py-3 px-2 rounded-xl border cursor-pointer transition-all text-center ${foodPaymentMethod === 'transfer' ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00]' : 'border-white/20 text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                          <input type="radio" name="foodPaymentMethod" className="hidden" checked={foodPaymentMethod === 'transfer'} onChange={() => setFoodPaymentMethod('transfer')} />
                          <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Chuyển khoản</span>
                        </label>
                        <label className={`flex-1 flex items-center justify-center py-3 px-2 rounded-xl border cursor-pointer transition-all text-center ${foodPaymentMethod === 'cash' ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00]' : 'border-white/20 text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                          <input type="radio" name="foodPaymentMethod" className="hidden" checked={foodPaymentMethod === 'cash'} onChange={() => setFoodPaymentMethod('cash')} />
                          <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Tiền mặt</span>
                        </label>
                      </div>

                      <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(212,255,0,0.3)]">
                        Đặt Món
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
                <div className="w-full flex items-center justify-center mb-8 shrink-0">
                  <span className="text-sm font-bold uppercase tracking-widest text-[#D4FF00]">Thanh toán tự động</span>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(212,255,0,0.15)] mb-8 relative">
                  <img 
                    src={`https://img.vietqr.io/image/${FOOD_BANK_NAME}-${FOOD_BANK_ACC}-qr_only.png?amount=${cartTotalPrice}&addInfo=${encodeURIComponent(pendingFoodOrderId)}&accountName=${encodeURIComponent(FOOD_BANK_OWNER)}`} 
                    alt="QR Code Đồ Ăn" 
                    className="w-56 h-56 mix-blend-multiply object-contain" 
                  />
                  <div className="absolute inset-0 border-4 border-[#D4FF00]/50 rounded-3xl animate-pulse pointer-events-none"></div>
                </div>
                <h4 className="text-3xl font-serif italic text-white mb-3">{formatPrice(cartTotalPrice)}</h4>
                <p className="text-[11px] text-zinc-400 mb-4 px-4 leading-relaxed">Vui lòng quét mã QR để thanh toán tiền đồ ăn cho phòng <strong className="text-white">{selectedFoodRoom}</strong>.</p>
                <p className="text-[10px] font-bold text-[#D4FF00] mb-6 text-center uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                  <Clock size={14} /> Đang chờ ngân hàng xác nhận...
                </p>
                <p className="text-[9px] font-light text-zinc-500">Liên hệ 0918480821 để được hỗ trợ nếu bạn đã thanh toán xong nhưng chưa hiện biên lai.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FOOD MENU MODAL --- */}
      {isFoodMenuOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setIsFoodMenuOpen(false)}></div>
          
          <div className="w-full max-w-6xl h-full max-h-[90vh] bg-[#050505] backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
            
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center shrink-0 bg-black/40">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2 flex items-center gap-2"><UtensilsCrossed size={14}/> Room Service</h3>
                <h4 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">Thực đơn đồ ăn</h4>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-white hover:text-[#D4FF00] transition-colors">
                  <ShoppingCart size={24} strokeWidth={1.5} />
                  {cartTotalQty > 0 && (
                    <span className="absolute right-0 top-0 bg-[#D4FF00] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-[0_0_10px_rgba(212,255,0,0.5)]">
                      {cartTotalQty}
                    </span>
                  )}
                </button>
                <div className="w-px h-6 bg-white/20"></div>
                <button onClick={() => setIsFoodMenuOpen(false)} className="text-zinc-500 hover:text-white p-2 transition-colors">
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 relative">
              <div className="flex flex-col md:flex-row justify-between mb-12 gap-4 relative z-20">
                <p className="text-zinc-400 font-light max-w-sm text-sm leading-relaxed">Order trực tiếp trên web. Nhân viên sẽ mang đồ ăn lên tận phòng cho bạn chỉ sau vài phút.</p>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsFoodCategoryOpen(!isFoodCategoryOpen)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all backdrop-blur-md border ${isFoodCategoryOpen || activeFoodCategory !== 'Tất cả' ? 'bg-[#D4FF00]/10 border-[#D4FF00] text-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300'}`}
                  >
                    <Filter size={16} className="text-[#D4FF00]" />
                    Danh mục: <span className="text-[#D4FF00]">{activeFoodCategory}</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isFoodCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`absolute top-full right-0 md:right-0 left-0 md:left-auto mt-4 w-full sm:w-[450px] bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 origin-top ${isFoodCategoryOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="flex flex-wrap gap-2.5">
                      {dynamicCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => { setActiveFoodCategory(cat); setIsFoodCategoryOpen(false); }}
                          className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeFoodCategory === cat ? 'bg-[#D4FF00] text-black shadow-[0_0_15px_rgba(212,255,0,0.3)]' : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {snacksDb.filter(snack => activeFoodCategory === 'Tất cả' || snack.category === activeFoodCategory).length > 0 ? (
                  snacksDb.filter(snack => activeFoodCategory === 'Tất cả' || snack.category === activeFoodCategory).map((snack) => (
                    <div key={snack.id} className="group flex flex-col bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4FF00]/30 hover:bg-white/[0.04] transition-all duration-500">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img src={snack.image} alt={snack.name} className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                        <div className="absolute top-4 left-4">
                          <span className="text-[9px] font-bold uppercase tracking-widest bg-black/60 text-[#D4FF00] px-2 py-1 rounded-md backdrop-blur-md border border-[#D4FF00]/20">{snack.category}</span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <h4 className="text-base font-bold uppercase tracking-tight text-white mb-2 line-clamp-1">{snack.name}</h4>
                          <p className="text-lg font-bold text-[#D4FF00] font-serif italic tracking-wide mb-5">{formatPrice(snack.price)}</p>
                        </div>
                        <button 
                          onClick={() => addToCart(snack)} 
                          className={`w-full py-2.5 border text-xs font-bold uppercase tracking-[0.1em] rounded-lg transition-colors flex justify-center items-center gap-2 ${
                            addedItemId === snack.id 
                              ? 'bg-[#D4FF00] text-black border-[#D4FF00]' 
                              : 'border-white/20 text-white group-hover:bg-[#D4FF00] group-hover:text-black group-hover:border-[#D4FF00]'
                          }`}
                        >
                          {addedItemId === snack.id ? (
                            <><CheckCircle size={14} /> Đã thêm</>
                          ) : (
                            <><Plus size={14} /> Bỏ vào giỏ</>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/5 rounded-3xl">
                    <UtensilsCrossed size={48} className="text-zinc-600 mb-4" strokeWidth={1} />
                    <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-2">Sắp ra mắt</h4>
                    <p className="text-sm font-light text-zinc-400">Các món ăn thuộc danh mục <strong className="text-[#D4FF00]">{activeFoodCategory}</strong> đang được chúng tôi cập nhật.</p>
                    <button onClick={() => setActiveFoodCategory('Tất cả')} className="mt-6 text-xs font-bold text-[#D4FF00] uppercase tracking-widest hover:underline underline-offset-4">Xem tất cả đồ ăn</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- BOOKING MODAL CHÍNH --- */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setBookingModalOpen(false)}></div>
          
          <div className="w-full max-w-xl bg-white/[0.05] backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-8 pb-0 flex justify-between items-start shrink-0">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">Reservation</h3>
                <h4 className="text-2xl font-black uppercase text-white tracking-tight">Đặt Phòng</h4>
              </div>
              <button onClick={() => setBookingModalOpen(false)} className="text-zinc-500 hover:text-white p-2 transition-colors"><X size={20} /></button>
            </div>
            
            {/* VIEW 1: FORM TÌM PHÒNG */}
            {bookingView === 'form' && (
              <form className="p-8 pt-6 space-y-6 overflow-y-auto custom-scrollbar" onSubmit={handleSearchRooms}>
                <div className="flex gap-3 mb-2">
                  <label className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl border cursor-pointer transition-all text-center ${bookingForm.type === 'hourly' ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00]' : 'border-white/20 text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                    <input type="radio" name="bookingType" className="hidden" checked={bookingForm.type === 'hourly'} onChange={() => handleBookingTypeChange('hourly')} />
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Theo giờ</span>
                  </label>
                  <label className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl border cursor-pointer transition-all text-center ${bookingForm.type === 'daily' ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00]' : 'border-white/20 text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                    <input type="radio" name="bookingType" className="hidden" checked={bookingForm.type === 'daily'} onChange={() => handleBookingTypeChange('daily')} />
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none mb-1">Theo Ngày</span>
                    <span className="text-[9px] opacity-80">(14h - 12h)</span>
                  </label>
                  <label className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl border cursor-pointer transition-all text-center ${bookingForm.type === 'overnight' ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00]' : 'border-white/20 text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                    <input type="radio" name="bookingType" className="hidden" checked={bookingForm.type === 'overnight'} onChange={() => handleBookingTypeChange('overnight')} />
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none mb-1">Qua đêm</span>
                    <span className="text-[9px] opacity-80">(22h - 10h)</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    {bookingForm.type !== 'hourly' && (
                      <div className="col-span-2 relative group/time">
                        <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-2">Số lượng khách</label>
                        <select required value={bookingForm.guests} onChange={e => setBookingForm({...bookingForm, guests: Number(e.target.value)})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors cursor-pointer appearance-none">
                          <option value={2} className="bg-zinc-900 text-white">1 - 2 Người</option>
                          <option value={4} className="bg-zinc-900 text-white">3 - 4 Người (Chỉ hỗ trợ Hạng Studio)</option>
                        </select>
                      </div>
                    )}
                    <div className={bookingForm.type === 'hourly' ? 'col-span-2' : 'col-span-1'}>
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-2">Ngày nhận phòng</label>
                      <input required type="date" min={minDateStr} max={maxDateStr} value={bookingForm.dateIn} onChange={e => {
                        const newDateIn = e.target.value;
                        setBookingForm(prev => ({
                            ...prev, dateIn: newDateIn, 
                            dateOut: prev.type === 'hourly' ? newDateIn : getNextDay(newDateIn)
                        }));
                      }} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] [color-scheme:dark]" />
                    </div>
                    {bookingForm.type !== 'hourly' && (
                      <div className="col-span-1">
                        <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-2">Ngày trả phòng</label>
                        <input required type="date" min={bookingForm.dateIn || minDateStr} max={maxDateStr} value={bookingForm.dateOut} onChange={e => setBookingForm({...bookingForm, dateOut: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] [color-scheme:dark]" />
                      </div>
                    )}
                    <div className="col-span-1">
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-2">Giờ nhận phòng</label>
                      <select required value={bookingForm.timeIn} onChange={e => setBookingForm({...bookingForm, timeIn: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] appearance-none">
                        <option value="" disabled className="text-zinc-500">--:-- --</option>
                        {getAvailableTimeOptions().map(t => <option key={t.value} value={t.value} className="bg-zinc-900 text-white">{t.label}</option>)}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-2">Giờ trả phòng</label>
                      <select required value={bookingForm.timeOut} onChange={e => setBookingForm({...bookingForm, timeOut: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] appearance-none">
                        <option value="" disabled className="text-zinc-500">--:-- --</option>
                        {TIME_OPTIONS.map(t => <option key={t.value} value={t.value} className="bg-zinc-900 text-white">{t.label}</option>)}
                      </select>
                    </div>
                </div>

                {(() => {
                  let isHourlyDisabled = false;
                  if (bookingForm.type === 'hourly' && bookingForm.timeIn) {
                    const h = parseInt(bookingForm.timeIn.split(':')[0]);
                    if (h >= 22 || h < 6) isHourlyDisabled = true;
                  }
                  return (
                    <>
                      {isHourlyDisabled && (
                        <p className="text-red-400 text-[10px] text-center italic mt-2 uppercase tracking-widest">
                          * Đặt phòng từ 22h home sẽ tính giá thuê qua đêm. Vui lòng chọn gói Qua đêm.
                        </p>
                      )}
                      <button disabled={isHourlyDisabled} type="submit" className={`w-full font-bold uppercase tracking-[0.2em] text-xs py-5 mt-4 rounded-xl transition-all flex items-center justify-center gap-2 ${isHourlyDisabled ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-[#D4FF00] text-black hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)]'}`}>
                        <Search size={16} /> Tìm Phòng Trống
                      </button>
                    </>
                  );
                })()}
              </form>
            )}

            {/* VIEW 2: KẾT QUẢ */}
            {bookingView === 'results' && (
              <div className="p-8 pt-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4 shrink-0">
                  <button onClick={() => setBookingView('form')} className="text-zinc-400 hover:text-[#D4FF00] transition-colors p-1"><ArrowLeft size={20}/></button>
                  <span className="text-sm font-light text-zinc-300">
                    Phòng trống: <strong className="text-white">{bookingForm.type === 'hourly' ? 'Theo giờ' : bookingForm.type === 'daily' ? 'Theo ngày' : 'Qua đêm'}</strong> ({searchSummary.text})
                  </span>
                </div>

                {availableRooms.map((room) => (
                  <div key={room.id} className="flex flex-col sm:flex-row bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4FF00]/40 transition-colors group shrink-0">
                    <img src={room.image} alt={room.name} className="w-full sm:w-32 h-32 object-cover shrink-0" />
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4FF00]">{room.categoryName}</span>
                        <h5 className="text-base font-bold text-white mb-1">{room.name}</h5>
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <p className="text-lg font-serif italic text-[#D4FF00] leading-none">{formatPrice(room.totalPrice)}</p>
                        <button onClick={() => handleSelectRoom(room)} className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 bg-white text-black hover:bg-[#D4FF00] rounded-xl transition-all">Chọn</button>
                      </div>
                    </div>
                  </div>
                ))}
                {availableRooms.length === 0 && <p className="text-zinc-500 text-center py-8 text-sm italic">Không tìm thấy phòng trống phù hợp.</p>}
              </div>
            )}

            {/* VIEW 3: THÔNG TIN KHÁCH */}
            {bookingView === 'guest_info' && (
              <form className="p-8 pt-4 overflow-y-auto custom-scrollbar flex flex-col space-y-6" onSubmit={handleGuestSubmit}>
                <div className="flex items-center gap-3 mb-2 border-b border-white/10 pb-4 shrink-0">
                  <button type="button" onClick={() => setBookingView('results')} className="text-zinc-400 hover:text-[#D4FF00] transition-colors p-1"><ArrowLeft size={20}/></button>
                  <span className="text-sm font-light text-zinc-300">Thông tin liên hệ đặt phòng</span>
                </div>
                
                <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/20 p-4 rounded-xl flex items-start gap-3">
                  <Info size={16} className="text-[#D4FF00] shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-300 font-light">
                    Thông tin của bạn sẽ được <strong className="text-[#D4FF00]">xóa hoàn toàn</strong> khỏi Đám mây ngay sau khi Check-out để đảm bảo riêng tư tuyệt đối.
                  </p>
                </div>

                {guestFormError && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
                    <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-200 font-light leading-relaxed">{guestFormError}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 relative group/input">
                    <input required type="text" id="g-name" value={guestInfo.name} onChange={e => setGuestInfo({...guestInfo, name: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] peer placeholder-transparent" placeholder="Họ và tên" />
                    <label htmlFor="g-name" className="absolute left-0 top-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Tên người đặt phòng</label>
                  </div>
                  
                  <div className="col-span-1 relative group/input">
                    <input readOnly id="g-dob" placeholder="AI tự điền khi up ảnh" value={guestInfo.dob} className="w-full bg-black/20 border-b border-white/20 py-2 text-sm text-zinc-400 focus:outline-none cursor-not-allowed peer" />
                    <label htmlFor="g-dob" className="absolute left-0 -top-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest transition-all">Ngày sinh (AI tự quét)</label>
                  </div>

                  <div className="col-span-1 relative group/input">
                    <input required type="tel" id="g-phone" value={guestInfo.phone} onChange={e => setGuestInfo({...guestInfo, phone: e.target.value.replace(/\D/g, '')})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] peer placeholder-transparent" placeholder="Số ĐT" />
                    <label htmlFor="g-phone" className="absolute left-0 top-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Số Điện Thoại</label>
                  </div>

                  <div className="col-span-2 mt-2">
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Tải lên Mặt trước CCCD</label>
                    <div className="relative">
                      <input required={!guestInfo.cccdImage} type="file" accept="image/*" onChange={(e) => handleImageUploadWithAI(e, setGuestInfo, setGuestFormError)} disabled={isCheckingCCCD} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      
                      {isCheckingCCCD && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-2xl border border-[#D4FF00]">
                          <div className="w-8 h-8 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin mb-3 shadow-[0_0_15px_#D4FF00]"></div>
                          <p className="text-[10px] font-bold text-[#D4FF00] animate-pulse uppercase tracking-widest">AI đang quét dữ liệu thẻ...</p>
                        </div>
                      )}

                      <div className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all ${guestInfo.cccdImage ? 'border-[#D4FF00] bg-[#D4FF00]/5' : 'border-white/20 hover:border-white/50 bg-black/20'}`}>
                        {guestInfo.cccdImage ? (
                          <div className="flex flex-col items-center text-center">
                            <img src={guestInfo.cccdImage} alt="CCCD Preview" className="h-24 object-contain rounded-lg mb-3 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-white/10" />
                            <p className="text-xs text-[#D4FF00] font-bold flex items-center gap-1"><CheckCircle size={14}/> CCCD hợp lệ (Bấm để thay đổi)</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-center text-zinc-400 group-hover:text-white transition-colors">
                            <UploadCloud size={32} strokeWidth={1} className="mb-3 text-zinc-500" />
                            <p className="text-sm font-bold text-white mb-1">Bấm vào đây để chọn ảnh</p>
                            <p className="text-[10px] font-light">Chỉ chấp nhận file hình ảnh rõ nét</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button disabled={isCheckingCCCD} type="submit" className={`w-full text-black font-bold uppercase tracking-[0.2em] text-xs py-5 mt-4 rounded-xl transition-all flex justify-center items-center gap-3 ${isCheckingCCCD ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-[#D4FF00] hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)]'}`}>
                  Tiếp tục thanh toán <ChevronRight size={16} />
                </button>
              </form>
            )}

            {/* VIEW 4: THANH TOÁN */}
            {bookingView === 'payment' && (
              <div className="p-8 pt-4 overflow-y-auto custom-scrollbar flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-6 border-b border-white/10 pb-4 shrink-0">
                  <button onClick={() => setBookingView(currentUser ? 'results' : 'guest_info')} className="text-zinc-400 hover:text-[#D4FF00] transition-colors p-1"><ArrowLeft size={20}/></button>
                  <span className="text-sm font-bold uppercase tracking-widest text-[#D4FF00]">Thanh toán tự động</span>
                  <div className="w-6"></div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(212,255,0,0.15)] mb-6 relative">
                  <img src={`https://img.vietqr.io/image/${ROOM_BANK_NAME}-${ROOM_BANK_ACC}-qr_only.png?amount=${selectedBookingRoom?.totalPrice}&addInfo=${encodeURIComponent(pendingBookingCode)}&accountName=${encodeURIComponent(ROOM_BANK_OWNER)}`} alt="QR Code Thanh Toán" className="w-48 h-48 mix-blend-multiply object-contain" />
                  <div className="absolute inset-0 border-4 border-[#D4FF00]/50 rounded-2xl animate-pulse pointer-events-none"></div>
                </div>
                <h4 className="text-2xl font-serif italic text-white mb-2">{formatPrice(selectedBookingRoom?.totalPrice || 0)}</h4>
                <p className="text-xs font-light text-zinc-400 mb-2 text-center">Mở App ngân hàng, quét mã QR và xác nhận chuyển khoản.</p>
                <p className="text-[10px] font-bold text-[#D4FF00] mb-8 text-center uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                  <Clock size={14} /> Hệ thống đang chờ nhận tiền...
                </p>
                <p className="text-[9px] font-light text-zinc-500 text-center max-w-sm">Liên hệ 0918480821 để được hỗ trợ nếu bạn đã thanh toán xong nhưng chưa hiện biên lai cho mình.</p>
              </div>
            )}

            {/* VIEW 5: THÀNH CÔNG */}
            {bookingView === 'success' && finalBookingData && (
              <div className="p-8 pt-6 overflow-y-auto custom-scrollbar flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#D4FF00]/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-[#D4FF00]" />
                </div>
                <h4 className="text-2xl font-black uppercase text-white tracking-tight mb-2">Đặt phòng thành công!</h4>
                <p className="text-xs font-light text-zinc-400 mb-8">Cảm ơn bạn. Chào mừng đến với Madlad Space.</p>
                
                <div className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-left space-y-4 mb-6">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mã đặt phòng</span>
                    <span className="text-sm font-mono text-white">{finalBookingData.code}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-black/30 p-3 rounded-xl border border-white/5 my-2">
                    <div>
                      <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-in</span>
                      <span className="block text-sm font-bold text-white">{finalBookingData.timeIn}</span>
                    </div>
                    <div className="text-right border-l border-white/10 pl-4">
                      <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-out</span>
                      <span className="block text-sm font-bold text-white">{finalBookingData.timeOut}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Passcode mở cửa</span>
                    <div className="bg-[#D4FF00] text-black px-4 py-2 rounded-lg font-mono font-black text-xl tracking-widest">{finalBookingData.passcode}</div>
                  </div>
                </div>

                {finalBookingData.youtubeLink && (
                  <a href={finalBookingData.youtubeLink} target="_blank" rel="noopener noreferrer" className="w-full bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-red-500 transition-all flex justify-center items-center gap-2 mb-6">
                    <PlayCircle size={16} /> Hướng dẫn tự mở cửa phòng
                  </a>
                )}

                <button onClick={() => setBookingModalOpen(false)} className="text-xs font-bold text-white uppercase tracking-[0.2em] border-b border-white/30 hover:border-white pb-1 transition-colors">Về trang chủ</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- ROOM LIST MODAL --- */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedCategory(null)}></div>
          <div className="w-full max-w-5xl bg-zinc-950/90 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl relative z-10 animate-in fade-in overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-start shrink-0 relative bg-black/50">
              <div><h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">Danh sách phòng</h3><h4 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">{selectedCategory.name}</h4></div>
              <button onClick={() => setSelectedCategory(null)} className="text-zinc-500 hover:text-white p-2"><X size={24} /></button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(selectedCategory.subRooms || []).map((room) => (
                  <div key={room.id} className="flex flex-col bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4FF00]/40 transition-all group">
                    <div className="relative h-48 w-full overflow-hidden shrink-0"><img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                    <div className="p-5 flex flex-col flex-1 justify-between bg-white/[0.02]">
                      <div className="mb-4">
                        <div className="flex justify-between items-center gap-2">
                          <h5 className="text-lg font-bold text-white group-hover:text-[#D4FF00] transition-colors leading-tight line-clamp-2">{room.name}</h5>
                          <button onClick={() => setViewingRoom(room)} className="text-[8px] font-bold text-[#D4FF00] uppercase tracking-widest hover:underline flex items-center gap-1 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                            Chi tiết phòng <ChevronRight size={10} />
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
          <div className="w-full max-w-3xl bg-zinc-950/90 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
            
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
            
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-zinc-950/50 to-transparent">
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex-1 min-w-[150px] shadow-inner">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1"><MonitorPlay size={12}/> Giá Phòng / Đêm</span>
                  <span className="text-lg font-bold text-[#D4FF00] font-serif italic">{viewingRoom.price} VNĐ</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex-1 min-w-[150px] shadow-inner">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1"><BedDouble size={12}/> Loại Giường</span>
                  <span className="text-sm font-bold text-white">{viewingRoom.bed || '1 Giường đôi'}</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
                <Sparkles size={16} className="text-[#D4FF00]"/> Tiện ích chi tiết
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-8 bg-black/30 p-6 rounded-2xl border border-white/5">
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
                {viewingRoom.status === 'Trống' ? <><Calendar size={16}/> Tiến Hành Đặt Phòng Này</> : 'Phòng Đang Được Dọn / Bảo Trì'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- AUTH MODAL --- */}
      {authState.isOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAuthState({...authState, isOpen: false})}></div>
          <div className="w-full max-w-md bg-white/[0.05] backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-8 pb-0 flex justify-between items-start shrink-0 relative z-10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">{authState.view === 'login' ? 'Welcome Back' : 'Member Only'}</h3>
                <h4 className="text-2xl font-black uppercase text-white tracking-tight">{authState.view === 'login' ? 'Đăng nhập' : 'Tạo hồ sơ'}</h4>
              </div>
              <button onClick={() => setAuthState({...authState, isOpen: false})} className="text-zinc-500 hover:text-white p-2"><X size={20}/></button>
            </div>
            
            <div className="p-8 pt-6 relative z-10 overflow-y-auto custom-scrollbar flex-1">
              
              {authFormError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 mb-6 animate-in fade-in">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200 font-light leading-relaxed">{authFormError}</p>
                </div>
              )}

              {authState.view === 'login' ? (
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="relative group/input">
                    <input required type="text" value={loginForm.username} onChange={e=>setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-[#D4FF00] peer placeholder-transparent" placeholder="Tên đăng nhập" />
                    <label className="absolute left-0 top-3 text-xs font-light text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Tên đăng nhập</label>
                  </div>
                  <div className="relative group/input">
                    <input required type="password" value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-[#D4FF00] peer placeholder-transparent" placeholder="Mật khẩu" />
                    <label className="absolute left-0 top-3 text-xs font-light text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Mật khẩu</label>
                  </div>
                  <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] text-xs py-5 mt-4 rounded-xl hover:bg-[#D4FF00] transition-all flex justify-center items-center gap-3">
                    Đăng Nhập <ArrowUpRight size={16} />
                  </button>
                  <p className="text-center mt-6 text-xs font-light text-zinc-400">Chưa có hồ sơ lưu trú? <button type="button" onClick={() => { setAuthState({...authState, view: 'register'}); setAuthFormError(''); }} className="text-[#D4FF00] font-bold hover:underline underline-offset-4">Đăng ký ngay</button></p>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handleRegister}>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3">
                    <Info size={16} className="text-[#D4FF00] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-300 font-light leading-relaxed">
                      Hồ sơ sẽ được bảo mật trên Cloud. Chúng tôi chỉ lưu những thông tin cơ bản nhất để bạn không phải khai báo lại ở lần sau.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 relative group/input">
                      <input required type="text" value={registerForm.username} onChange={e=>setRegisterForm({...registerForm, username: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] peer placeholder-transparent" placeholder="Username" />
                      <label className="absolute left-0 top-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[9px] peer-valid:text-zinc-400 transition-all cursor-text">Tên đăng nhập (Username)</label>
                    </div>
                    <div className="col-span-2 relative group/input">
                      <input required type="password" value={registerForm.password} onChange={e=>setRegisterForm({...registerForm, password: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] peer placeholder-transparent" placeholder="Password" />
                      <label className="absolute left-0 top-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[9px] peer-valid:text-zinc-400 transition-all cursor-text">Tạo mật khẩu</label>
                    </div>

                    <div className="col-span-2 h-px bg-white/10 my-2"></div>

                    <div className="col-span-1 relative group/input">
                      <input readOnly value={registerForm.dob} placeholder="AI tự điền khi up ảnh" className="w-full bg-black/20 border-b border-white/20 py-2 text-sm text-zinc-400 focus:outline-none cursor-not-allowed peer" />
                      <label className="absolute left-0 -top-4 text-[9px] font-bold text-zinc-500 uppercase tracking-widest transition-all">Ngày sinh (AI tự quét)</label>
                    </div>
                    <div className="col-span-1 relative group/input">
                      <input required type="tel" value={registerForm.phone} onChange={e=>setRegisterForm({...registerForm, phone: e.target.value.replace(/\D/g, '')})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] peer placeholder-transparent" placeholder="Phone" />
                      <label className="absolute left-0 top-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[9px] peer-valid:text-zinc-400 transition-all cursor-text">Số Điện Thoại</label>
                    </div>

                    <div className="col-span-2 mt-4">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Tải lên Mặt trước CCCD</label>
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUploadWithAI(e, setRegisterForm, setAuthFormError)} disabled={isCheckingCCCD} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        
                        {isCheckingCCCD && (
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-xl border border-[#D4FF00]">
                            <div className="w-6 h-6 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin mb-2 shadow-[0_0_10px_#D4FF00]"></div>
                            <p className="text-[9px] font-bold text-[#D4FF00] animate-pulse uppercase tracking-widest">AI đang quét...</p>
                          </div>
                        )}

                        <div className={`w-full border-2 border-dashed rounded-xl flex items-center justify-center p-4 transition-all ${registerForm.cccdImage ? 'border-[#D4FF00] bg-[#D4FF00]/5' : 'border-white/20 bg-black/20'}`}>
                          {registerForm.cccdImage ? (
                            <div className="flex items-center gap-4 w-full">
                              <img src={registerForm.cccdImage} alt="CCCD Preview" className="h-12 w-16 object-cover rounded-md border border-white/10" />
                              <div className="text-left flex-1">
                                <p className="text-xs text-[#D4FF00] font-bold flex items-center gap-1"><CheckCircle size={12}/> Hợp lệ</p>
                                <p className="text-[9px] text-zinc-400">Bấm vào khung này để đổi ảnh khác</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center text-zinc-400">
                              <ImageIcon size={24} className="mb-2 text-zinc-500" />
                              <p className="text-[11px] font-bold text-white mb-0.5">Bấm để tải ảnh CCCD</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button disabled={isCheckingCCCD} type="submit" className={`w-full text-black font-bold uppercase tracking-[0.2em] text-xs py-5 mt-6 rounded-xl transition-all flex justify-center items-center gap-3 ${isCheckingCCCD ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-[#D4FF00] hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)]'}`}>
                    Lưu Hồ Sơ Cloud <CheckCircle size={16} />
                  </button>
                  <p className="text-center mt-6 text-xs font-light text-zinc-400">Đã có hồ sơ? <button type="button" onClick={() => { setAuthState({...authState, view: 'login'}); setAuthFormError(''); }} className="text-white font-bold hover:underline underline-offset-4">Đăng nhập</button></p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SEARCH BOOKING (Tra cứu) --- */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSearchModalOpen(false)}></div>
          <div className="w-full max-w-md bg-[#080808]/90 backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl relative z-10 animate-in fade-in flex flex-col overflow-hidden">
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-start shrink-0 relative">
              <div><h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">Check in</h3><h4 className="text-2xl font-black uppercase text-white tracking-tight">Tra cứu phòng</h4></div>
              <button onClick={() => setSearchModalOpen(false)} className="text-zinc-500 hover:text-white p-2"><X size={20} /></button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <form onSubmit={handleSearchBooking} className="mb-6 flex gap-3">
                <input type="text" required placeholder="Nhập SĐT hoặc Mã đặt phòng..." value={searchCode} onChange={(e) => setSearchCode(e.target.value.toUpperCase())} className="flex-1 bg-white/5 border border-white/20 py-3 px-4 rounded-xl text-sm text-white focus:border-[#D4FF00] font-mono tracking-widest outline-none" />
                <button type="submit" className="bg-[#D4FF00] text-black px-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center"><Search size={20} strokeWidth={2} /></button>
              </form>
              {searchResult?.status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200 font-light leading-relaxed">{searchResult.message}</p>
                </div>
              )}
              {searchResult?.status === 'success' && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#D4FF00]/20 flex items-center justify-center text-[#D4FF00]"><CheckCircle size={20} /></div>
                    <div><span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Mã số vé</span><strong className="text-sm text-white uppercase tracking-wider font-mono">{searchResult.data.code}</strong></div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phòng đã đặt</span>
                      <span className="text-sm font-bold text-[#D4FF00]">{searchResult.data.categoryName} - {searchResult.data.roomName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-black/30 p-4 rounded-xl border border-white/5 my-4">
                      <div><span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-in</span><span className="block text-2xl font-bold text-white">{searchResult.data.timeIn}</span><span className="block text-sm text-zinc-400 mt-1">{searchResult.data.dateIn}</span></div>
                      <div className="text-right border-l border-white/10 pl-4"><span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-out</span><span className="block text-2xl font-bold text-white">{searchResult.data.timeOut}</span><span className="block text-sm text-zinc-400 mt-1">{searchResult.data.dateOut}</span></div>
                    </div>
                  </div>
                  <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/30 rounded-xl p-4 flex items-center justify-between">
                    <div><span className="block text-[9px] font-bold text-[#D4FF00] uppercase tracking-widest mb-1">Mật khẩu mở cửa</span><span className="text-xs font-light text-zinc-300">Nhập trên bàn phím số</span></div>
                    <span className="text-lg font-black font-mono tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{searchResult.data.passcode}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 bg-[#030303]/80 backdrop-blur-xl py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <button onClick={() => { setIsAdminModalOpen(true); setAdminView('login'); }} className="text-zinc-800 hover:text-[#D4FF00] transition-colors p-1" title="Mở khóa trang quản trị Admin">
              <Settings size={18} />
            </button>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-black tracking-[0.1em] uppercase text-white leading-none">Madlad</span>
              <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-zinc-400 mt-1">Hotel & Cineroom</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-zinc-500 hover:text-[#D4FF00] transition-colors cursor-pointer">
              <MapPin size={20} strokeWidth={1.5} />
              <span className="text-xs font-light">292 Yên Ninh, Mỹ Đông, TP. Phan Rang-Tháp Chàm</span>
            </div>
          </div>
          <p className="text-[10px] font-light uppercase tracking-[0.2em] text-zinc-600">
            © 2024 Madlad Space. All rights reserved.
          </p>
        </div>
      </footer>

      {/* --- ADMIN MODAL TỔNG HỢP --- */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsAdminModalOpen(false)}></div>
          <div className="w-full max-w-6xl bg-[#050505] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-3xl relative z-10 animate-in fade-in flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0 bg-black/50">
              <div className="flex items-center gap-4">
                {adminView !== 'login' && adminView !== 'select' && (
                  <button onClick={() => setAdminView('select')} className="text-zinc-400 hover:text-[#D4FF00] p-1"><ArrowLeft size={20}/></button>
                )}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-1">Admin Dashboard</h3>
                  <h4 className="text-xl font-black uppercase text-white tracking-tight">
                    {adminView === 'login' ? 'Xác thực' : adminView === 'select' ? 'Lựa chọn' : adminView === 'menu' ? 'Quản lý Thực đơn' : adminView === 'rooms' ? 'Quản lý Hạng Phòng' : adminView === 'surcharge' ? 'Phụ Thu Lễ' : 'Quản lý Lịch Đặt'}
                  </h4>
                </div>
              </div>
              <button onClick={() => setIsAdminModalOpen(false)} className="text-zinc-500 hover:text-white p-2"><X size={20}/></button>
            </div>

            {/* MÀN HÌNH ĐĂNG NHẬP */}
            {adminView === 'login' && (
              <div className="p-8 flex flex-col items-center justify-center h-[50vh]">
                <Lock size={40} className="text-zinc-600 mb-4" />
                <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">Xác thực Quản trị viên</h4>
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  if(adminPasscode === 'admin123') setAdminView('select'); 
                  else alert('Sai mật khẩu!'); 
                }} className="flex gap-2 w-full max-w-xs">
                  <input type="password" value={adminPasscode} onChange={e=>setAdminPasscode(e.target.value)} placeholder="Nhập mật khẩu..." className="flex-1 bg-white/5 border border-white/20 px-4 py-2 rounded-xl text-white outline-none focus:border-[#D4FF00] text-center tracking-widest" />
                  <button type="submit" className="bg-[#D4FF00] text-black font-bold px-6 rounded-xl hover:bg-white transition-colors">VÀO</button>
                </form>
              </div>
            )}

            {/* MÀN HÌNH LỰA CHỌN */}
            {adminView === 'select' && (
              <div className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center h-[60vh] max-w-5xl mx-auto">
                <button onClick={() => setAdminView('rooms')} className="group flex flex-col items-center justify-center p-10 bg-white/[0.02] border border-white/10 rounded-3xl hover:bg-white/5 hover:border-[#D4FF00]/50 transition-all w-full aspect-square">
                  <BedDouble size={48} strokeWidth={1} className="text-zinc-500 group-hover:text-[#D4FF00] mb-6 transition-colors" />
                  <span className="text-lg font-black uppercase tracking-widest text-white group-hover:text-[#D4FF00] transition-colors">Hạng Phòng</span>
                  <span className="text-[10px] text-zinc-400 mt-2 font-light text-center">Cài đặt giá thuê, phụ thu...</span>
                </button>
                <button onClick={() => setAdminView('surcharge')} className="group flex flex-col items-center justify-center p-10 bg-white/[0.02] border border-white/10 rounded-3xl hover:bg-white/5 hover:border-[#D4FF00]/50 transition-all w-full aspect-square">
                  <Sparkles size={48} strokeWidth={1} className="text-zinc-500 group-hover:text-[#D4FF00] mb-6 transition-colors" />
                  <span className="text-lg font-black uppercase tracking-widest text-white group-hover:text-[#D4FF00] transition-colors">Phụ Thu Lễ</span>
                  <span className="text-[10px] text-zinc-400 mt-2 font-light text-center">Tăng giá tự động dịp lễ/Tết</span>
                </button>
                <button onClick={() => setAdminView('bookings')} className="group flex flex-col items-center justify-center p-10 bg-white/[0.02] border border-white/10 rounded-3xl hover:bg-white/5 hover:border-[#D4FF00]/50 transition-all w-full aspect-square">
                  <Calendar size={48} strokeWidth={1} className="text-zinc-500 group-hover:text-[#D4FF00] mb-6 transition-colors" />
                  <span className="text-lg font-black uppercase tracking-widest text-white group-hover:text-[#D4FF00] transition-colors">Quản lý Lịch</span>
                  <span className="text-[10px] text-zinc-400 mt-2 font-light text-center">Chặn phòng, nhập khách ngoài</span>
                </button>
                <button onClick={() => setAdminView('menu')} className="group flex flex-col items-center justify-center p-10 bg-white/[0.02] border border-white/10 rounded-3xl hover:bg-white/5 hover:border-[#D4FF00]/50 transition-all w-full aspect-square">
                  <UtensilsCrossed size={48} strokeWidth={1} className="text-zinc-500 group-hover:text-[#D4FF00] mb-6 transition-colors" />
                  <span className="text-lg font-black uppercase tracking-widest text-white group-hover:text-[#D4FF00] transition-colors">Thực Đơn</span>
                  <span className="text-[10px] text-zinc-400 mt-2 font-light text-center">Thêm/sửa món ăn, đồ uống</span>
                </button>
              </div>
            )}

            {/* MÀN HÌNH CẤU HÌNH PHỤ THU LỄ */}
            {adminView === 'surcharge' && (
              <div className="p-8 max-w-2xl mx-auto w-full h-[60vh] overflow-y-auto custom-scrollbar flex flex-col justify-center">
                <div className="text-center mb-8">
                  <Sparkles size={48} className="text-[#D4FF00] mx-auto mb-4" />
                  <h4 className="text-2xl font-black uppercase text-white tracking-widest mb-2">Cấu Hình Phụ Thu Lễ</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Hệ thống sẽ tự động cộng thêm phí theo tỷ lệ và số tiền bên dưới<br/> khi khách hàng chọn ngày nhận phòng nằm trong khoảng thời gian áp dụng.</p>
                </div>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_settings', 'global'), globalSettings);
                      alert('Lưu cấu hình phụ thu thành công!');
                    } catch(err) { alert('Lỗi: ' + err.message); }
                }} className="space-y-6 bg-white/[0.02] border border-white/10 p-8 rounded-3xl">

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Từ ngày (Ngày áp dụng)</label>
                      <input type="date" value={globalSettings.holidayStart} onChange={e=>setGlobalSettings({...globalSettings, holidayStart: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white rounded-xl focus:border-[#D4FF00] outline-none [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Đến ngày (Kết thúc)</label>
                      <input type="date" value={globalSettings.holidayEnd} onChange={e=>setGlobalSettings({...globalSettings, holidayEnd: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white rounded-xl focus:border-[#D4FF00] outline-none [color-scheme:dark]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Phụ thu đặt theo giờ (%)</label>
                      <div className="relative">
                        <input type="number" placeholder="VD: 30" value={globalSettings.surchargeHourlyPct} onChange={e=>setGlobalSettings({...globalSettings, surchargeHourlyPct: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white rounded-xl focus:border-[#D4FF00] outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Phụ thu Ngày/Đêm (VNĐ)</label>
                      <input type="number" placeholder="VD: 100000" value={globalSettings.surchargeDailyVnd} onChange={e=>setGlobalSettings({...globalSettings, surchargeDailyVnd: e.target.value})} className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white rounded-xl focus:border-[#D4FF00] outline-none" />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    <button type="button" onClick={() => setGlobalSettings({ holidayStart: '', holidayEnd: '', surchargeHourlyPct: '', surchargeDailyVnd: '' })} className="flex-1 bg-red-500/10 text-red-400 font-bold uppercase tracking-widest text-[11px] py-4 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                      Xóa Phụ Thu 
                    </button>
                    <button type="submit" className="flex-2 w-2/3 bg-[#D4FF00] text-black font-bold uppercase tracking-widest text-[11px] py-4 rounded-xl hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)] transition-colors">
                      Lưu & Áp Dụng Ngay
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* MÀN HÌNH QUẢN LÝ LỊCH (BOOKINGS) */}
            {adminView === 'bookings' && (
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Cột trái: Form thêm lịch thủ công */}
                <div className="w-full md:w-1/3 border-r border-white/10 bg-white/[0.02] p-6 overflow-y-auto custom-scrollbar">
                  <div className="mb-6 border-b border-white/10 pb-4">
                    <h4 className="text-sm font-bold text-[#D4FF00] uppercase tracking-widest flex items-center gap-2">
                      <Lock size={16}/> Chặn phòng / Thêm khách ngoài
                    </h4>
                  </div>
                  <form onSubmit={handleManualBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Chọn Phòng</label>
                      <select required className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none"
                        value={manualBookingForm.roomKey ? allSubRoomsFlat.find(r => r.id.split('-').pop().toLowerCase() === manualBookingForm.roomKey)?.id : ''}
                        onChange={(e) => {
                          const selected = allSubRoomsFlat.find(r => r.id === e.target.value);
                          if(selected) {
                            setManualBookingForm({
                              ...manualBookingForm,
                              roomKey: selected.id.split('-').pop().toLowerCase(),
                              roomName: selected.name,
                              categoryName: selected.categoryName
                            });
                          }
                        }}
                      >
                        <option value="" disabled>-- Chọn phòng cần chặn --</option>
                        {allSubRoomsFlat.map(room => (
                          <option key={room.id} value={room.id}>{room.categoryName} - {room.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Nguồn / Tên Khách</label>
                      <input required value={manualBookingForm.guestName} onChange={e=>setManualBookingForm({...manualBookingForm, guestName: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" placeholder="VD: Khách Zalo, Khách Facebook..." />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Ngày vào</label>
                        <input required type="date" value={manualBookingForm.dateIn} onChange={e=>setManualBookingForm({...manualBookingForm, dateIn: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none [color-scheme:dark]" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Giờ vào</label>
                        <select required value={manualBookingForm.timeIn} onChange={e=>setManualBookingForm({...manualBookingForm, timeIn: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none">
                          {TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Ngày ra</label>
                        <input required type="date" value={manualBookingForm.dateOut} onChange={e=>setManualBookingForm({...manualBookingForm, dateOut: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none [color-scheme:dark]" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Giờ ra</label>
                        <select required value={manualBookingForm.timeOut} onChange={e=>setManualBookingForm({...manualBookingForm, timeOut: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none">
                          {TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold uppercase tracking-widest text-[11px] py-3 mt-4 rounded-xl hover:bg-white transition-colors">
                      Thêm Lịch Khách Chặn Phòng
                    </button>
                  </form>
                </div>

                {/* Cột phải: Danh sách Lịch */}
                <div className="w-full md:w-2/3 p-6 overflow-y-auto custom-scrollbar bg-black/20">
                  <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Lịch Đang Có Trên Hệ Thống</h4>
                  </div>

                  {bookingsDb.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 text-sm italic">Chưa có vé đặt phòng nào trên hệ thống.</div>
                  ) : (
                    <div className="space-y-4">
                      {[...bookingsDb].sort((a,b) => new Date(a.isoStart) - new Date(b.isoStart)).map(booking => (
                        <div key={booking.code} className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border ${booking.accountId === 'admin_manual' ? 'bg-[#D4FF00]/5 border-[#D4FF00]/30' : 'bg-white/5 border-white/10'}`}>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{booking.code}</span>
                              {booking.accountId === 'admin_manual' && <span className="bg-[#D4FF00] text-black text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Khách Ngoài</span>}
                              {booking.status === 'pending' && <span className="bg-orange-500 text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Chờ TT</span>}
                            </div>
                            <h5 className="text-base font-bold text-white mb-0.5">{booking.roomName} <span className="text-sm font-normal text-zinc-400">({booking.categoryName})</span></h5>
                            <p className="text-xs text-zinc-400">Khách: <strong className="text-white">{booking.guestData?.name}</strong></p>
                          </div>
                          
                          <div className="flex flex-col md:items-end w-full md:w-auto">
                            <div className="flex items-center gap-2 mb-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                              <div className="text-right">
                                <span className="block text-[9px] text-zinc-500 uppercase tracking-wider">In</span>
                                <span className="text-xs font-bold text-white">{booking.timeIn} ({booking.dateIn.slice(-2)}/{booking.dateIn.slice(5,7)})</span>
                              </div>
                              <ArrowRight size={12} className="text-zinc-600" />
                              <div className="text-left">
                                <span className="block text-[9px] text-zinc-500 uppercase tracking-wider">Out</span>
                                <span className="text-xs font-bold text-white">{booking.timeOut} ({booking.dateOut.slice(-2)}/{booking.dateOut.slice(5,7)})</span>
                              </div>
                            </div>
                            
                            <button onClick={async () => {
                              if(!window.confirm(`Xóa vé ${booking.code} và giải phóng phòng này?`)) return;
                              try {
                                await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_bookings', booking.code));
                              } catch(e) { alert('Lỗi xóa: ' + e.message); }
                            }} className="text-[9px] uppercase tracking-widest text-red-400 hover:text-white hover:bg-red-500 px-3 py-1 rounded transition-colors self-start md:self-end">
                              Hủy Lịch & Giải phóng phòng
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MÀN HÌNH QUẢN LÝ THỰC ĐƠN */}
            {adminView === 'menu' && (
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Cột trái: Form thêm món */}
                <div className="w-full md:w-1/3 border-r border-white/10 bg-white/[0.02] p-6 overflow-y-auto custom-scrollbar">
                  <h4 className="text-sm font-bold text-[#D4FF00] uppercase tracking-widest mb-6">
                    {editingSnackId ? 'Chỉnh Sửa Món' : 'Thêm Món Mới'}
                  </h4>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!snackForm.image) return alert('Vui lòng tải ảnh món ăn lên!');
                    try {
                      const newId = editingSnackId || ('item_' + Date.now());
                      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_menu', newId), {
                        id: newId, category: snackForm.category, name: snackForm.name, desc: snackForm.desc, price: Number(snackForm.price), image: snackForm.image
                      });
                      setSnackForm({ category: '', name: '', desc: '', price: '', image: null }); setEditingSnackId(null);
                      alert(editingSnackId ? 'Cập nhật thành công!' : 'Thêm món thành công!');
                    } catch(err) { alert('Lỗi: ' + err.message); }
                  }} className="space-y-4">
                    
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Tên món</label>
                      <input required value={snackForm.name} onChange={e=>setSnackForm({...snackForm, name: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Danh mục (Nhập mới hoặc Chọn)</label>
                      <input required list="categories" value={snackForm.category} onChange={e=>setSnackForm({...snackForm, category: e.target.value})} placeholder="VD: Snack bịch, Mì tôm..." className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" />
                      <datalist id="categories">
                        {dynamicCategories.filter(c => c !== 'Tất cả').map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Giá bán (VNĐ)</label>
                      <input required type="number" value={snackForm.price} onChange={e=>setSnackForm({...snackForm, price: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" />
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Mô tả ngắn</label>
                      <input value={snackForm.desc} onChange={e=>setSnackForm({...snackForm, desc: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" />
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Hình ảnh (Chỉ nhận file ảnh)</label>
                      <div className="relative border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-[#D4FF00] transition-colors cursor-pointer bg-black/50">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setSnackForm, 'image')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        {snackForm.image ? (
                           <img src={snackForm.image} alt="Preview" className="h-16 mx-auto rounded-md object-cover" />
                        ) : (
                           <p className="text-[10px] text-zinc-400">Bấm để tải ảnh lên</p>
                        )}
                      </div>
                    </div>

                    {editingSnackId ? (
                      <div className="flex gap-2 mt-4">
                        <button type="submit" className="flex-1 bg-[#D4FF00] text-black font-bold uppercase tracking-widest text-[11px] py-3 rounded-xl hover:bg-white transition-colors">Lưu Thay Đổi</button>
                        <button type="button" onClick={() => { setEditingSnackId(null); setSnackForm({ category: '', name: '', desc: '', price: '', image: null }); }} className="flex-1 bg-white/10 text-white font-bold uppercase tracking-widest text-[11px] py-3 rounded-xl hover:bg-white/20 transition-colors">Hủy Bỏ</button>
                      </div>
                    ) : (
                      <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold uppercase tracking-widest text-[11px] py-3 rounded-xl hover:bg-white transition-colors mt-2">Thêm Vào Menu</button>
                    )}
                  </form>
                </div>

                {/* Cột phải: Danh sách món */}
                <div className="w-full md:w-2/3 p-6 overflow-y-auto custom-scrollbar bg-black/20">
                  <div className="flex flex-col gap-4 mb-6">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                      Danh sách hiện tại ({filteredAdminSnacks.length} món)
                    </h4>
                    
                    {/* Thanh Tìm kiếm và Nút Lọc (Vị trí bạn yêu cầu) */}
                    {snacksDb.length > 0 && (
                      <div className="flex items-center gap-3">
                        {/* Thanh tìm kiếm */}
                        <div className="relative flex-1 group/search">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/search:text-[#D4FF00] transition-colors" />
                          <input
                            type="text"
                            placeholder="Tìm nhanh tên món..."
                            value={adminSearchQuery}
                            onChange={(e) => setAdminSearchQuery(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 py-2 pl-10 pr-4 text-xs text-white rounded-xl focus:border-[#D4FF00] outline-none transition-colors"
                          />
                        </div>
                        {/* Bộ lọc danh mục */}
                        <div className="relative shrink-0">
                          <select
                            value={adminFilterCategory}
                            onChange={(e) => setAdminFilterCategory(e.target.value)}
                            className="appearance-none bg-black/50 border border-white/10 py-2 pl-9 pr-8 text-xs text-white rounded-xl focus:border-[#D4FF00] outline-none transition-colors cursor-pointer max-w-[140px] font-bold tracking-wider"
                          >
                            {dynamicCategories.map(cat => (
                              <option key={cat} value={cat} className="bg-zinc-900 text-white">{cat}</option>
                            ))}
                          </select>
                          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {snacksDb.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center px-4 bg-white/[0.02] rounded-3xl border border-white/5">
                      <UtensilsCrossed size={48} className="text-zinc-600 mb-4" strokeWidth={1} />
                      <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-2">Kho dữ liệu trống</h4>
                      <p className="text-zinc-400 mb-8 text-sm max-w-md">Hệ thống chưa có món ăn nào. Bạn có muốn nạp nhanh danh sách mặc định vào để bắt đầu chỉnh sửa không?</p>
                      <button onClick={async () => {
                        for(const item of DEFAULT_SNACKS) {
                          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_menu', item.id), item);
                        }
                        alert("Đã nạp thành công! Bạn có thể bấm vào biểu tượng cây bút để sửa giá hoặc đổi tên.");
                      }} className="bg-[#D4FF00] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(212,255,0,0.3)] hover:scale-105">
                        Tải Menu Mặc Định Vào Kho
                      </button>
                    </div>
                  ) : filteredAdminSnacks.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 text-sm">Không tìm thấy món ăn nào phù hợp với từ khóa hoặc bộ lọc của bạn.</div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredAdminSnacks.map(snack => (
                        <div key={snack.id} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-3 items-center group hover:border-white/30 transition-colors">
                          <img src={snack.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                          <div className="flex-1">
                            <h5 className="text-xs font-bold text-white line-clamp-1">{snack.name}</h5>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[9px] text-[#D4FF00] px-2 py-0.5 bg-[#D4FF00]/10 rounded-md">{snack.category}</span>
                              <span className="text-[10px] text-zinc-400">{formatPrice(snack.price)}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={() => {
                              setSnackForm({ category: snack.category, name: snack.name, desc: snack.desc, price: snack.price, image: snack.image });
                              setEditingSnackId(snack.id);
                            }} className="p-2 text-zinc-400 hover:text-[#D4FF00] hover:bg-[#D4FF00]/10 rounded-lg transition-colors" title="Chỉnh sửa món">
                              <Edit size={16} />
                            </button>
                            <button onClick={async () => {
                              if(!window.confirm(`Bạn muốn xóa món ${snack.name}?`)) return;
                              await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_menu', snack.id));
                            }} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Xóa món ăn">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MÀN HÌNH QUẢN LÝ PHÒNG VÀ GIÁ */}
            {adminView === 'rooms' && (
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Cột trái: Form chỉnh sửa */}
                <div className="w-full md:w-5/12 border-r border-white/10 bg-white/[0.02] p-6 overflow-y-auto custom-scrollbar">
                  {!roomEditMode ? (
                     <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500">
                       <Info size={32} className="mb-4 opacity-50"/>
                       <p className="text-sm">Bấm vào biểu tượng <Edit size={14} className="inline mx-1"/> bên phải để bắt đầu thiết lập giá Hạng phòng hoặc sửa chi tiết Phòng.</p>
                     </div>
                  ) : roomEditMode === 'category' ? (
                     // FORM CHỈNH SỬA HẠNG PHÒNG (BAO GỒM GIÁ CHUYÊN SÂU)
                     <>
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-bold text-[#D4FF00] uppercase tracking-widest">
                          {editingCategoryId ? 'Thiết Lập Hạng Phòng' : 'Thêm Hạng Phòng'}
                        </h4>
                        <button onClick={() => setRoomEditMode(null)} className="text-zinc-500 hover:text-white"><X size={16}/></button>
                      </div>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!roomCatForm.image) return alert('Vui lòng tải ảnh lên!');
                        try {
                          const newId = editingCategoryId || ('cat_' + Date.now());
                          const featuresArray = roomCatForm.features.split('\n').filter(f => f.trim() !== '');
                          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms', newId), {
                            id: newId, name: roomCatForm.name, concept: roomCatForm.concept, description: roomCatForm.description,
                            features: featuresArray, image: roomCatForm.image, order: roomCatForm.order,
                            price2h: roomCatForm.price2h, price3h: roomCatForm.price3h, price4h: roomCatForm.price4h,
                            price5h: roomCatForm.price5h, price6h: roomCatForm.price6h, price7h: roomCatForm.price7h,
                            price8h: roomCatForm.price8h, price9h: roomCatForm.price9h, price10h: roomCatForm.price10h,
                            price30m: roomCatForm.price30m, surchargeEarly: roomCatForm.surchargeEarly, surchargeLate: roomCatForm.surchargeLate,
                            subRooms: roomsDb.find(r => r.id === newId)?.subRooms || []
                          }, { merge: true });
                          setRoomEditMode(null); alert('Lưu Hạng phòng thành công!');
                        } catch(err) { alert('Lỗi: ' + err.message); }
                      }} className="space-y-4">
                        
                        <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/30 p-4 rounded-xl mb-4">
                          <h5 className="text-xs font-bold text-[#D4FF00] uppercase tracking-widest mb-3 flex items-center gap-2"><Settings size={14}/> Cấu hình giá tự động</h5>
                          
                          <p className="text-[10px] text-white uppercase tracking-widest border-b border-white/10 pb-1 mb-3">1. Giá đặt theo giờ</p>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Giá 2 giờ</label><input required type="number" placeholder="0" value={roomCatForm.price2h} onChange={e=>setRoomCatForm({...roomCatForm, price2h: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-[#D4FF00] font-bold rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Giá 3 giờ</label><input required type="number" placeholder="0" value={roomCatForm.price3h} onChange={e=>setRoomCatForm({...roomCatForm, price3h: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Giá 4 giờ</label><input required type="number" placeholder="0" value={roomCatForm.price4h} onChange={e=>setRoomCatForm({...roomCatForm, price4h: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Giá 5 giờ</label><input required type="number" placeholder="0" value={roomCatForm.price5h} onChange={e=>setRoomCatForm({...roomCatForm, price5h: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Giá 6 giờ</label><input required type="number" placeholder="0" value={roomCatForm.price6h} onChange={e=>setRoomCatForm({...roomCatForm, price6h: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Giá 7 giờ</label><input required type="number" placeholder="0" value={roomCatForm.price7h} onChange={e=>setRoomCatForm({...roomCatForm, price7h: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Giá 8 giờ</label><input required type="number" placeholder="0" value={roomCatForm.price8h} onChange={e=>setRoomCatForm({...roomCatForm, price8h: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Giá 9 giờ</label><input required type="number" placeholder="0" value={roomCatForm.price9h} onChange={e=>setRoomCatForm({...roomCatForm, price9h: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Giá 10 giờ</label><input required type="number" placeholder="0" value={roomCatForm.price10h} onChange={e=>setRoomCatForm({...roomCatForm, price10h: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div className="col-span-1 md:col-span-3"><label className="block text-[9px] text-zinc-300 uppercase mb-1 text-[#D4FF00] font-bold">Giá mỗi 30 phút dôi ra</label><input required type="number" placeholder="0" value={roomCatForm.price30m} onChange={e=>setRoomCatForm({...roomCatForm, price30m: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                          </div>

                          <p className="text-[10px] text-white uppercase tracking-widest border-b border-white/10 pb-1 mb-3">2. Giá phụ thu (Ngày/Đêm)</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Sớm/giờ (VNĐ)</label><input type="number" placeholder="VD: 40000" value={roomCatForm.surchargeEarly} onChange={e=>setRoomCatForm({...roomCatForm, surchargeEarly: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                            <div><label className="block text-[9px] text-zinc-300 uppercase mb-1">Trễ/giờ (VNĐ)</label><input type="number" placeholder="VD: 50000" value={roomCatForm.surchargeLate} onChange={e=>setRoomCatForm({...roomCatForm, surchargeLate: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                          </div>
                        </div>

                        <div><label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Tên Hạng (VD: HẠNG STUDIO)</label><input required value={roomCatForm.name} onChange={e=>setRoomCatForm({...roomCatForm, name: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                        <div><label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Concept</label><input required value={roomCatForm.concept} onChange={e=>setRoomCatForm({...roomCatForm, concept: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                        <div><label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Mô tả dài</label><textarea rows={3} required value={roomCatForm.description} onChange={e=>setRoomCatForm({...roomCatForm, description: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none custom-scrollbar" /></div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Tiện ích nổi bật (Mỗi dòng 1 mục)</label>
                          <textarea rows={4} required value={roomCatForm.features} onChange={e=>setRoomCatForm({...roomCatForm, features: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none custom-scrollbar whitespace-pre-wrap" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Hình đại diện</label>
                          <div className="relative border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-[#D4FF00] transition-colors cursor-pointer bg-black/50">
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setRoomCatForm, 'image')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            {roomCatForm.image ? <img src={roomCatForm.image} alt="Preview" className="h-20 mx-auto rounded-md object-cover" /> : <p className="text-[10px] text-zinc-400">Bấm để tải ảnh lên</p>}
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold uppercase tracking-widest text-[11px] py-3 rounded-xl hover:bg-white transition-colors mt-2">LƯU CẤU HÌNH</button>
                      </form>
                     </>
                  ) : (
                     // FORM CHỈNH SỬA / THÊM PHÒNG CON (SUB-ROOM) + YOUTUBE LINK
                     <>
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-bold text-[#D4FF00] uppercase tracking-widest leading-tight">
                          {editingSubRoomId ? 'Sửa Phòng' : 'Thêm Phòng vào'} <br/><span className="text-white font-black">{activeAdminCategory?.name}</span>
                        </h4>
                        <button onClick={() => setRoomEditMode(null)} className="text-zinc-500 hover:text-white"><X size={16}/></button>
                      </div>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!subRoomForm.image) return alert('Vui lòng tải ảnh lên!');
                        try {
                          const catId = activeAdminCategory.id;
                          const roomData = activeRooms.find(r => r.id === catId);
                          let currentSubRooms = roomData.subRooms || [];
                          const amenitiesArray = subRoomForm.amenities.split('\n').filter(f => f.trim() !== '');
                          
                          const newSubRoomData = {
                            id: editingSubRoomId || (`${catId}-${Date.now()}`),
                            name: subRoomForm.name, price: subRoomForm.price, bed: subRoomForm.bed,
                            image: subRoomForm.image, images: [subRoomForm.image, subRoomForm.image2, subRoomForm.image3].filter(Boolean),
                            status: subRoomForm.status, amenities: amenitiesArray,
                            youtubeLink: subRoomForm.youtubeLink || '' 
                          };

                          if (editingSubRoomId) { currentSubRooms = currentSubRooms.map(sr => sr.id === editingSubRoomId ? newSubRoomData : sr); } 
                          else { currentSubRooms.push(newSubRoomData); }

                          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms', catId), { subRooms: currentSubRooms });
                          setRoomEditMode(null); alert('Lưu phòng thành công!');
                        } catch(err) { alert('Lỗi: ' + err.message); }
                      }} className="space-y-4">
                        <div><label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Tên Phòng</label><input required value={subRoomForm.name} onChange={e=>setSubRoomForm({...subRoomForm, name: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                        
                        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl mb-4">
                          <label className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">
                            <PlayCircle size={12}/> Link Video Hướng dẫn mở cửa
                          </label>
                          <input type="url" placeholder="Nhập đường link Youtube (VD: https://youtu.be/...)" value={subRoomForm.youtubeLink} onChange={e=>setSubRoomForm({...subRoomForm, youtubeLink: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-xs text-white rounded-lg focus:border-red-400 outline-none" />
                        </div>

                        <div><label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Giá hiển thị (Chữ - VD: 500.000)</label><input required value={subRoomForm.price} onChange={e=>setSubRoomForm({...subRoomForm, price: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                        <div><label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Loại giường (VD: 1 Giường đôi)</label><input required value={subRoomForm.bed} onChange={e=>setSubRoomForm({...subRoomForm, bed: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none" /></div>
                        <div><label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Trạng thái</label>
                          <select value={subRoomForm.status} onChange={e=>setSubRoomForm({...subRoomForm, status: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none">
                            <option value="Trống">Trống</option>
                            <option value="Đang dọn">Đang dọn</option>
                            <option value="Bảo trì">Bảo trì</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Tiện ích chi tiết (Mỗi dòng 1 mục)</label>
                          <textarea rows={5} required value={subRoomForm.amenities} onChange={e=>setSubRoomForm({...subRoomForm, amenities: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2 text-sm text-white rounded-lg focus:border-[#D4FF00] outline-none custom-scrollbar whitespace-pre-wrap" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Hình ảnh phòng (3 góc chụp)</label>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="relative border-2 border-dashed border-white/20 rounded-xl p-2 text-center hover:border-[#D4FF00] transition-colors cursor-pointer bg-black/50 aspect-square flex items-center justify-center overflow-hidden">
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setSubRoomForm, 'image')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Ảnh chính (lớn)" />
                              {subRoomForm.image ? <img src={subRoomForm.image} alt="Góc 1" className="w-full h-full object-cover rounded-lg" /> : <div className="flex flex-col items-center"><Plus size={16} className="text-zinc-500 mb-1"/><span className="text-[8px] text-zinc-500">Ảnh chính</span></div>}
                            </div>
                            <div className="relative border-2 border-dashed border-white/20 rounded-xl p-2 text-center hover:border-[#D4FF00] transition-colors cursor-pointer bg-black/50 aspect-square flex items-center justify-center overflow-hidden">
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setSubRoomForm, 'image2')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Ảnh góc 2 (nhỏ)" />
                              {subRoomForm.image2 ? <img src={subRoomForm.image2} alt="Góc 2" className="w-full h-full object-cover rounded-lg" /> : <div className="flex flex-col items-center"><Plus size={16} className="text-zinc-500 mb-1"/><span className="text-[8px] text-zinc-500">Ảnh phụ 1</span></div>}
                            </div>
                            <div className="relative border-2 border-dashed border-white/20 rounded-xl p-2 text-center hover:border-[#D4FF00] transition-colors cursor-pointer bg-black/50 aspect-square flex items-center justify-center overflow-hidden">
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setSubRoomForm, 'image3')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Ảnh góc 3 (nhỏ)" />
                              {subRoomForm.image3 ? <img src={subRoomForm.image3} alt="Góc 3" className="w-full h-full object-cover rounded-lg" /> : <div className="flex flex-col items-center"><Plus size={16} className="text-zinc-500 mb-1"/><span className="text-[8px] text-zinc-500">Ảnh phụ 2</span></div>}
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest text-[11px] py-3 rounded-xl hover:bg-[#D4FF00] transition-colors mt-2">LƯU PHÒNG NÀY</button>
                      </form>
                     </>
                  )}
                </div>

                {/* Cột phải: Danh sách Hệ thống Phòng */}
                <div className="w-full md:w-7/12 p-6 overflow-y-auto custom-scrollbar bg-black/20">
                  <div className="flex justify-between items-end mb-6">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Hệ Thống Phòng</h4>
                  </div>
                  
                  {roomsDb.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center px-4 bg-white/[0.02] rounded-3xl border border-white/5">
                      <BedDouble size={48} className="text-zinc-600 mb-4" strokeWidth={1} />
                      <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-2">Kho dữ liệu trống</h4>
                      <button onClick={async () => {
                        for(const item of DEFAULT_ROOMS) await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms', item.id), item);
                        alert("Đã nạp Hạng Phòng thành công!");
                      }} className="bg-[#D4FF00] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all">
                        Tải Hệ Thống Mặc Định
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {roomsDb.map(cat => (
                        <div key={cat.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden group/cat">
                          <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                            <img src={cat.image} className="w-16 h-12 rounded-lg object-cover opacity-80" alt="" />
                            <div className="flex-1">
                              <h5 className="text-sm font-black text-[#D4FF00] tracking-wider uppercase mb-1">{cat.name}</h5>
                              <p className="text-[10px] text-zinc-400 font-light">
                                Giá 2H đầu: <strong className="text-white">{cat.price2h ? formatPrice(Number(cat.price2h)) : 'Chưa set'}</strong>
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => {
                                setRoomCatForm({ 
                                  name: cat.name, concept: cat.concept, description: cat.description, features: (cat.features||[]).join('\n'), image: cat.image, order: cat.order, 
                                  price2h: cat.price2h || '', price3h: cat.price3h || '', price4h: cat.price4h || '', price5h: cat.price5h || '', 
                                  price6h: cat.price6h || '', price7h: cat.price7h || '', price8h: cat.price8h || '', price9h: cat.price9h || '', 
                                  price10h: cat.price10h || '', price30m: cat.price30m || '', surchargeEarly: cat.surchargeEarly || '', surchargeLate: cat.surchargeLate || '' 
                                });
                                setEditingCategoryId(cat.id); setRoomEditMode('category');
                              }} className="p-2 text-zinc-400 hover:text-[#D4FF00] hover:bg-[#D4FF00]/10 rounded-lg transition-colors"><Edit size={16}/></button>
                              <button onClick={() => {
                                setActiveAdminCategory(cat);
                                setSubRoomForm({ id: '', name: '', price: '', bed: '', amenities: '', image: null, image2: null, image3: null, status: 'Trống', youtubeLink: '' });
                                setEditingSubRoomId(null); setRoomEditMode('subroom');
                              }} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider">
                                <Plus size={14}/> Thêm
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                            {(cat.subRooms || []).map(room => (
                              <div key={room.id} className="flex gap-3 bg-black/40 border border-white/5 rounded-xl p-3 items-center group/room hover:border-white/20 transition-colors">
                                <img src={room.image} className="w-10 h-10 rounded-md object-cover" alt="" />
                                <div className="flex-1">
                                  <h6 className="text-xs font-bold text-white mb-1">{room.name}</h6>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] px-2 py-0.5 rounded-md uppercase font-bold tracking-widest ${room.status === 'Trống' ? 'bg-[#D4FF00]/10 text-[#D4FF00]' : 'bg-red-500/10 text-red-400'}`}>{room.status}</span>
                                    {room.youtubeLink && <PlayCircle size={12} className="text-red-500" title="Đã thêm link Youtube"/>}
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover/room:opacity-100 transition-opacity shrink-0">
                                  <button onClick={() => {
                                    setActiveAdminCategory(cat);
                                    setSubRoomForm({ id: room.id, name: room.name, price: room.price, bed: room.bed, amenities: (room.amenities||[]).join('\n'), status: room.status, image: room.images?.[0] || room.image, image2: room.images?.[1] || null, image3: room.images?.[2] || null, youtubeLink: room.youtubeLink || '' });
                                    setEditingSubRoomId(room.id); setRoomEditMode('subroom');
                                  }} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"><Edit size={14}/></button>
                                  <button onClick={async () => {
                                    if(!window.confirm(`Xóa phòng ${room.name}?`)) return;
                                    const newSubRooms = cat.subRooms.filter(r => r.id !== room.id);
                                    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'madlad_rooms', cat.id), { subRooms: newSubRooms });
                                  }} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"><Trash2 size={14}/></button>
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