import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Calendar, MapPin, Phone, CheckCircle, 
  MonitorPlay, Gamepad2, Bath, ChevronRight, Info,
  Bike, Map, AlertTriangle, Sparkles, ArrowUpRight,
  ShoppingCart, Plus, Minus, Trash2, UtensilsCrossed, ArrowLeft, BedDouble, Clock, QrCode, User, Search, Shirt,
  Filter, ChevronDown
} from 'lucide-react';

// --- DATA ---
const FOOD_CATEGORIES = [
  'Tất cả', 'Snack bịch', 'Snack 12k', 'Mì tôm', 'Xúc xích', 
  'Nước ngọt', 'Đồ có cồn', 'Bánh tráng', 'Kem', 'Chân gà', 
  'Các loại bánh', 'Các loại kẹo'
];

const ROOM_CATEGORIES = [
  {
    id: 'studio',
    name: 'HẠNG STUDIO',
    concept: 'Vũ trụ & Giải trí',
    // Tạm thời dùng link ảnh online để khung Preview không bị lỗi. 
    // Khi tải code về máy để chạy thật, bạn đổi dòng này thành: 
    // image: '508660902_1025153949816619_6175266070300112385_n.jpg',
    image: 'studio bìa.jpg',
    priceFrom: '500.000 - 600.000',
    features: ['Máy chiếu 4K, app phim độc quyền', 'Phòng tắm riêng, bàn ủi', 'Board game đa dạng', 'Bếp riêng đầy đủ đồ'],
    description: 'Không gian giải trí đỉnh cao với tiện ích chung gồm máy chiếu, bếp riêng và board game. (Áp dụng: 500.000đ/2 người — 600.000đ/4 người).',
    subRooms: [
      { 
        id: 'studio-sun', name: 'Phòng Sun', price: '500.000 - 600.000', bed: '2 Giường đôi (2-4 Người)', status: 'Trống', 
        image: 'bìa-sun.jpg',
        images: [
          'sun1.jpg',
          'sun2.jpg',
          'sun3.jpg'
        ],
        amenities: ['Game Nintendo, bồn tắm, ban công', 'Diện tích 20m2', 'Máy chiếu Netflix, Youtube Premium...', 'Bếp riêng: gia vị, xoong nồi, bếp từ...', 'Phòng tắm riêng, máy sấy tóc, bàn ủi', 'Board Game: Drinking Card, Cá sấu...']
      },
      { 
        id: 'studio-pluto', name: 'Phòng Pluto', price: '500.000 - 600.000', bed: '2 Giường đôi (2-4 Người)', status: 'Đang dọn', 
        image: 'bìa-pluto.jpg',
        images: [
          'plut1.jpg',
          'plut2.jpg',
          'plut3.jpg'
        ],
        amenities: ['Game PS4, Bàn bida, Vô lăng giả lập', 'Diện tích 25m2', 'Máy chiếu Netflix, Youtube Premium...', 'Bếp riêng: gia vị, xoong nồi, bếp từ...', 'Phòng tắm riêng, máy sấy tóc, bàn ủi', 'Board Game: Drinking Card, Cá sấu...']
      }
    ]
  },
  {
    id: 'concept-plus',
    name: 'HẠNG CONCEPT PLUS',
    concept: 'Nghệ thuật & Mở rộng',
    image: 'plus-bìa.jpg',
    priceFrom: '400.000',
    features: ['Máy chiếu FullHD', 'App phim độc quyền', 'Bếp mini riêng', 'Ghế sofa, Máy PS4'],
    description: 'Sự nâng cấp tuyệt vời với không gian rộng rãi hơn, trang bị máy chiếu FullHD, app phim rạp độc quyền, bếp mini và máy game PS4 giải trí cực đã.',
    subRooms: [
      { 
        id: 'cplus-mercury', name: 'Phòng Mercury', price: '400.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'mer1.jpg',
        images: [
          'mer1.jpg',
          'mer2.jpg',
          'mer3.jpg'
        ],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa, Máy PS4']
      }
    ]
  },
  {
    id: 'concept',
    name: 'HẠNG CONCEPT',
    concept: 'Ấm áp & Chữa lành',
    image: 'con-bìa.jpg',
    priceFrom: '300.000 - 350.000',
    features: ['Máy chiếu FullHD', 'App phim chiếu rạp', 'Bếp riêng mini', 'Diện tích 13-15m2'],
    description: 'Một trạm dừng chân ấm áp. Tận hưởng trọn vẹn tiện ích từ máy chiếu FullHD, app phim độc quyền, bếp mini riêng và board game trong không gian từ 13m2 - 15m2.',
    subRooms: [
      { 
        id: 'concept-jupiter', name: 'Phòng Jupiter', price: '300.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'bìa-jupi.jpg',
        images: [
          'jupi1.jpg',
          'jupi2.jpg',
          'jupi3.jpg'
        ],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game', 'Kích thước phòng: 13m2']
      },
      { 
        id: 'concept-mars', name: 'Phòng Mars', price: '350.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'bìa-mars.jpg',
        images: [
          'mars1.jpg',
          'mars2.jpg',
          'mars3.jpg'
        ],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa', 'Kích thước phòng: 15m2']
      },
      { 
        id: 'concept-moon', name: 'Phòng Moon', price: '350.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa', 'Kích thước phòng: 15m2']
      },
      { 
        id: 'concept-venus', name: 'Phòng Venus', price: '350.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game, ghế sofa', 'Kích thước phòng: 15m2']
      },
      { 
        id: 'concept-uranus', name: 'Phòng Uranus', price: '300.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'ura-bìa.jpg',
        images: [
          'ura1.jpg',
          'ura2.jpg',
          'ura3.jpg'
        ],
        amenities: ['Máy chiếu FullHD, app phim chiếu rạp độc quyền', 'Nhà vệ sinh riêng, máy sấy tóc', 'Bếp riêng mini', 'Board game', 'Kích thước phòng: 13m2']
      }
    ]
  },
  {
    id: 'basic',
    name: 'HẠNG PHÒNG BASIC',
    concept: 'Tối giản & Tiện nghi',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    priceFrom: '270.000',
    features: ['Máy chiếu HD', 'Netflix & Youtube', 'NVS riêng, máy sấy', 'Kích thước 13m2'],
    description: 'Sự lựa chọn hoàn hảo cho những chuyến lưu trú ngắn ngày. Không gian tối giản 13m2 nhưng trang bị đầy đủ máy chiếu HD để xem phim giải trí thư giãn.',
    subRooms: [
      { 
        id: 'basic-earth', name: 'Phòng Earth', price: '270.000', bed: '1 Giường đôi', status: 'Trống', 
        image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Máy chiếu HD', 'App phim Netflix và Youtube', 'Nhà vệ sinh riêng, máy sấy tóc', 'Kích thước phòng: 13m2']
      }
    ]
  }
];

const SERVICES = [
  { title: 'Thuê xe di chuyển', desc: 'Xe số: 120k/ngày — Xe ga: 150k/ngày. Giao nhận tận nơi.', icon: Bike },
  { title: 'Decor Anniversary, Sinh nhật', desc: 'Hỗ trợ setup không gian lãng mạn, sinh nhật, kỷ niệm theo yêu cầu.', icon: Sparkles },
  { title: 'Dịch vụ giặt sấy', desc: '20.000vnđ/kg. Xử lý nhanh chóng, sấy khô thơm tho, giao tận phòng.', icon: Shirt },
];

const SNACKS = [
  // --- SNACK BỊCH ---
  { id: 'sb1', category: 'Snack bịch', name: 'Snack Khoai Tây O\'Star', desc: 'Khoai tây chiên giòn vị tự nhiên', price: 20000, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'sb2', category: 'Snack bịch', name: 'Snack Bắp Ngọt Swing', desc: 'Giòn rụm, vị bắp bơ sữa thơm lừng', price: 20000, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'sb3', category: 'Snack bịch', name: 'Snack Rong Biển', desc: 'Rong biển cháy tỏi đậm đà', price: 25000, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- SNACK 12K ---
  { id: 's12-1', category: 'Snack 12k', name: 'Đậu Phộng Tân Tân', desc: 'Hạt giòn béo ngậy, nhắm bia cực cuốn', price: 12000, image: 'https://images.unsplash.com/photo-1600115504107-1604a112cd53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 's12-2', category: 'Snack 12k', name: 'Snack Mực Bento', desc: 'Mực cay Thái Lan xé sợi', price: 12000, image: 'https://images.unsplash.com/photo-1599599810069-8a24443bc20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 's12-3', category: 'Snack 12k', name: 'Bánh Gạo Tròn', desc: 'Bánh gạo vị ngọt/mặn cơ bản', price: 12000, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- MÌ TÔM ---
  { id: 'mt1', category: 'Mì tôm', name: 'Mì Indomie Trứng Xúc Xích', desc: 'Mì xào khô cứu đói đêm khuya', price: 35000, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'mt2', category: 'Mì tôm', name: 'Mì Nước Hảo Hảo Trứng', desc: 'Hương vị tôm chua cay quen thuộc', price: 25000, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'mt3', category: 'Mì tôm', name: 'Mì Cay Samyang Phô Mai', desc: 'Cay nồng đậm vị Hàn Quốc', price: 45000, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- XÚC XÍCH ---
  { id: 'xx1', category: 'Xúc xích', name: 'Xúc xích Đức nướng', desc: 'Nướng nóng hổi, thơm mùi khói', price: 25000, image: 'https://images.unsplash.com/photo-1585325701956-60dd9c858a81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'xx2', category: 'Xúc xích', name: 'Xúc xích Phô Mai', desc: 'Béo ngậy nhân phô mai tan chảy', price: 20000, image: 'https://images.unsplash.com/photo-1626804475297-4160aeea4a07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'xx3', category: 'Xúc xích', name: 'Xúc xích Vissan', desc: 'Xúc xích tiệt trùng ăn liền', price: 15000, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- NƯỚC NGỌT ---
  { id: 'nn1', category: 'Nước ngọt', name: 'Coca Cola / Pepsi', desc: 'Giải khát sảng khoái tức thì', price: 15000, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'nn2', category: 'Nước ngọt', name: '7Up / Sprite', desc: 'Hương chanh mát mẻ', price: 15000, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'nn3', category: 'Nước ngọt', name: 'Trà Đào / Trà Ô Long', desc: 'Thơm ngon, nhẹ nhàng', price: 20000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- ĐỒ CÓ CỒN ---
  { id: 'dc1', category: 'Đồ có cồn', name: 'Bia Corona', desc: 'Thưởng thức cùng một lát chanh', price: 40000, image: 'https://images.unsplash.com/photo-1614315584648-968b209e7de7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'dc2', category: 'Đồ có cồn', name: 'Strongbow (Táo/Dâu)', desc: 'Cider trái cây dễ uống', price: 35000, image: 'https://images.unsplash.com/photo-1558334460-705cdb21c432?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'dc3', category: 'Đồ có cồn', name: 'Bia Tiger Bạc / Heineken', desc: 'Bia lạnh nhắm mồi cực chill', price: 25000, image: 'https://images.unsplash.com/photo-1563514972338-7f9389c9d5d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- BÁNH TRÁNG ---
  { id: 'bt1', category: 'Bánh tráng', name: 'Bánh Tráng Trộn Sa Tế', desc: 'Đậm đà cay cay dễ nghiện', price: 25000, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'bt2', category: 'Bánh tráng', name: 'Bánh Tráng Cuốn Bơ', desc: 'Béo ngậy vị bơ, dai dẻo', price: 25000, image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'bt3', category: 'Bánh tráng', name: 'Bánh Tráng Cháy Tỏi', desc: 'Giòn rụm thơm lừng', price: 20000, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- KEM ---
  { id: 'k1', category: 'Kem', name: 'Kem Ốc Quế Cornetto', desc: 'Socola và Vani ngọt ngào', price: 25000, image: 'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'k2', category: 'Kem', name: 'Kem Trái Cây Celano', desc: 'Mát lạnh hương trái cây nhiệt đới', price: 20000, image: 'https://images.unsplash.com/photo-1570197781417-0c7f42ecb123?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'k3', category: 'Kem', name: 'Kem Hộp Merino', desc: 'Phù hợp ăn chung khi xem phim', price: 45000, image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- CHÂN GÀ ---
  { id: 'cg1', category: 'Chân gà', name: 'Chân Gà Sả Tắc', desc: 'Chua ngọt giòn sần sật', price: 50000, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'cg2', category: 'Chân gà', name: 'Chân Gà Rút Xương', desc: 'Tiện lợi, dễ ăn, siêu cuốn', price: 60000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'cg3', category: 'Chân gà', name: 'Chân Gà Cay Tứ Xuyên', desc: 'Cay nồng xé lưỡi mồi nhắm bia', price: 55000, image: 'https://images.unsplash.com/photo-1588675646184-f5b0b0b0b2ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- CÁC LOẠI BÁNH ---
  { id: 'clb1', category: 'Các loại bánh', name: 'Bánh Chocopie', desc: 'Bánh mềm nhân marshmallow', price: 15000, image: 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'clb2', category: 'Các loại bánh', name: 'Bánh Custas', desc: 'Nhân kem trứng béo ngậy', price: 20000, image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'clb3', category: 'Các loại bánh', name: 'Bánh Quy Danisa Mini', desc: 'Bánh quy bơ giòn tan', price: 35000, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

  // --- CÁC LOẠI KẸO ---
  { id: 'clk1', category: 'Các loại kẹo', name: 'Kẹo Dẻo Chupa Chups', desc: 'Chua ngọt hương trái cây', price: 15000, image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'clk2', category: 'Các loại kẹo', name: 'Singum Coolmint', desc: 'Thơm mát, sảng khoái', price: 10000, image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'clk3', category: 'Các loại kẹo', name: 'Kẹo Mút Alpenliebe', desc: 'Hương dâu/caramel béo ngọt', price: 10000, image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const RULES = [
  { fee: '150K', text: 'Nếu check out không rửa chén' },
  { fee: '50K+', text: 'Tháo dỡ, di chuyển đồ đạc. Đền bù nếu làm hư hỏng.' },
  { fee: '100K+', text: 'Vết bẩn khó giặt trên ga, gối. Đền mới nếu rách, cháy.' },
  { fee: '500K', text: 'Tự ý dẫn thêm bạn ở qua đêm không báo trước' },
];

// Tạo danh sách giờ cách nhau 30 phút (00:00 -> 23:30) định dạng 24h
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours24 = Math.floor(i / 2);
  const h24Str = hours24.toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return { value: `${h24Str}:${m}`, label: `${h24Str}:${m}` };
});

// --- ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT ĐỂ MỞ HÀM APP ---
export default function App() {

  // --- USER AUTH STATE ---
  const [currentUser, setCurrentUser] = useState(null); // null = chưa đăng nhập

  // --- DATABASE MÔ PHỎNG (Lưu mã đặt phòng) ---
  const [bookingsDb, setBookingsDb] = useState([]);
  const [authState, setAuthState] = useState({ isOpen: false, view: 'login' });
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);

  // --- Booking Flow State ---
  const [bookingForm, setBookingForm] = useState({
    type: 'hourly',
    dateIn: '', timeIn: '', dateOut: '', timeOut: ''
  });
  
  // Views: 'form' -> 'results' -> 'guest_info' (if not logged in) -> 'payment' -> 'success'
  const [bookingView, setBookingView] = useState('form'); 
  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchSummary, setSearchSummary] = useState({ text: '', duration: 0 });
  const [selectedBookingRoom, setSelectedBookingRoom] = useState(null);
  
  // Thông tin khách đặt phòng
  const [guestInfo, setGuestInfo] = useState({ name: '', dob: '', phone: '', email: '' });
  const [finalBookingData, setFinalBookingData] = useState(null);

  // --- Search Booking State ---
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // --- Cart State ---
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [foodPaymentMethod, setFoodPaymentMethod] = useState('cash'); // Trạng thái chọn phương thức thanh toán đồ ăn
  const [addedItemId, setAddedItemId] = useState(null); // Trạng thái hiệu ứng nút "Đã thêm"

  // --- Food Menu Modal State ---
  const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);

  // --- Food Category State ---
  const [activeFoodCategory, setActiveFoodCategory] = useState('Tất cả');
  const [isFoodCategoryOpen, setIsFoodCategoryOpen] = useState(false);

  // --- Active Menu State ---
  const [activeSection, setActiveSection] = useState('');

  // Reset form khi đóng cửa sổ Đặt phòng
  useEffect(() => {
    if (!bookingModalOpen) {
      setBookingForm({ type: 'hourly', dateIn: '', timeIn: '', dateOut: '', timeOut: '' });
      setBookingView('form');
      setSelectedBookingRoom(null);
      setFinalBookingData(null);
      if (!currentUser) setGuestInfo({ name: '', dob: '', phone: '', email: '' });
    }
  }, [bookingModalOpen, currentUser]);

  // Ngăn chặn cuộn trang khi mở modal
  useEffect(() => {
    if (authState.isOpen || isCartOpen || selectedCategory || viewingRoom || bookingModalOpen || searchModalOpen || isFoodMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [authState.isOpen, isCartOpen, selectedCategory, viewingRoom, bookingModalOpen, searchModalOpen, isFoodMenuOpen]);

  // Xử lý hiệu ứng thanh menu và nhận diện khu vực đang xem (Scroll Spy)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['rooms', 'services', 'rules'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookingTypeChange = (type) => {
    let updates = { type };
    if (type === 'daily') {
      updates.timeIn = '14:00';
      updates.timeOut = '12:00';
    } else if (type === 'overnight') {
      updates.timeIn = '22:00';
      updates.timeOut = '10:00';
    }
    setBookingForm(prev => ({ ...prev, ...updates }));
  };

  const getHourlyWarning = () => {
    if (bookingForm.type !== 'hourly' || !bookingForm.timeIn || !bookingForm.timeOut) return null;
    const [hIn, mIn] = bookingForm.timeIn.split(':').map(Number);
    const [hOut, mOut] = bookingForm.timeOut.split(':').map(Number);
    let diffMinutes = (hOut * 60 + mOut) - (hIn * 60 + mIn);
    if (diffMinutes <= 0) diffMinutes += 24 * 60;
    if (diffMinutes > 0 && diffMinutes < 120) {
      return "Home nhận ít nhất là 2 giờ, nếu book ít hơn 2 giờ vẫn sẽ tính tiền 2 giờ.";
    }
    return null;
  };

  const getDailyWarning = () => {
    if (bookingForm.type !== 'daily' || !bookingForm.timeIn || !bookingForm.timeOut) return null;
    if (bookingForm.timeIn < "14:00" || bookingForm.timeOut > "12:00") {
      return "Nhận sớm hơn hay trả trễ hơn giờ quy định sẽ có phụ thu.";
    }
    return null;
  };

  const getOvernightWarning = () => {
    if (bookingForm.type !== 'overnight' || !bookingForm.timeIn || !bookingForm.timeOut) return null;
    const hIn = parseInt(bookingForm.timeIn.split(':')[0], 10);
    const isEarlyCheckin = (hIn < 22 && hIn > 12); 
    const isLateCheckout = bookingForm.timeOut > "10:00";
    if (isEarlyCheckin || isLateCheckout) {
      return "Nhận sớm hơn hay trả trễ hơn giờ quy định sẽ có phụ thu.";
    }
    return null;
  };

  const getDateWarning = () => {
    if (bookingForm.type === 'hourly') return null;
    if (bookingForm.dateIn && bookingForm.dateOut && bookingForm.dateIn === bookingForm.dateOut) {
      return "Ngày nhận và ngày trả không được trùng nhau.";
    }
    return null;
  };

  const handleSearchRooms = async (e) => {
  e.preventDefault();
  if (getDateWarning()) {
    alert('Vui lòng kiểm tra lại ngày tháng!'); return;
  }

  let durationHours = 0, durationText = '', multiplier = 1;

  if (bookingForm.type === 'hourly') {
    const [hIn, mIn] = bookingForm.timeIn.split(':').map(Number);
    const [hOut, mOut] = bookingForm.timeOut.split(':').map(Number);
    let diffMinutes = (hOut * 60 + mOut) - (hIn * 60 + mIn);
    if (diffMinutes <= 0) diffMinutes += 24 * 60;
    durationHours = Math.max(2, diffMinutes / 60);
    multiplier = durationHours;
    durationText = `${durationHours} giờ`;
  } else {
    if (!bookingForm.dateIn || !bookingForm.dateOut) {
      alert('Vui lòng chọn đầy đủ ngày nhận và ngày trả!'); return;
    }
    const dIn = new Date(bookingForm.dateIn);
    const dOut = new Date(bookingForm.dateOut);
    const diffTime = Math.abs(dOut - dIn);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    multiplier = diffDays;
    durationText = `${diffDays} ${bookingForm.type === 'daily' ? 'ngày' : 'đêm'}`;
  }

  setSearchSummary({ text: durationText, duration: multiplier });

  // --- KẾT NỐI MAKE.COM & GOOGLE CALENDAR ---
  const webhookURL = "https://hook.us2.make.com/a6414uz7fvfgjrscn54yyl8cvinaan2u";
  const bookingData = {
    type: bookingForm.type,
    dateIn: bookingForm.dateIn,
    dateOut: bookingForm.dateOut,
    timeIn: bookingForm.timeIn,
    timeOut: bookingForm.timeOut
  };

 // Dòng 423
  try {
    // Đợi phản hồi từ Make
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    // --- ĐOẠN DÁN MỚI BẮT ĐẦU TỪ ĐÂY ---
    const data = await response.json(); 

    let results = [];
    ROOM_CATEGORIES.forEach(cat => {
      cat.subRooms.forEach(room => {
        if (room.status === 'Trống') {
          const roomKey = room.id.split('-').pop(); 
          let isActuallyFree = true;

          if (data[roomKey] === "false") {
            isActuallyFree = false;
          }

          if (isActuallyFree) {
            const parsedBasePrice = parseInt(room.price.replace(/\./g, ''));
            let basePrice = bookingForm.type === 'hourly' ? Math.round(parsedBasePrice * 0.2)
              : bookingForm.type === 'daily' ? parsedBasePrice : parsedBasePrice - 150000;
            
            results.push({ 
              ...room, 
              categoryName: cat.name, 
              totalPrice: basePrice * multiplier, 
              calculatedBasePrice: basePrice 
            });
          }
        }
      });
    });
    // --- ĐOẠN DÁN MỚI KẾT THÚC TẠI ĐÂY ---

    setAvailableRooms(results);
    setBookingView('results');

  } catch (error) {
    console.error("Lỗi kiểm tra phòng:", error);
    alert("Có lỗi khi kiểm tra lịch phòng, vui lòng thử lại!");
  }
  };


  // --- XỬ LÝ KHI KHÁCH BẤM NÚT "CHỌN PHÒNG" ---
  const handleSelectRoom = (room) => {
    setSelectedBookingRoom(room);
    if (currentUser) {
      setGuestInfo(currentUser);
      setBookingView('payment'); // Đã ĐN -> Tới thanh toán QR luôn
    } else {
      setBookingView('guest_info'); // Chưa ĐN -> Yêu cầu điền thông tin
    }
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    setBookingView('payment');
  };

  const handlePaymentComplete = () => {
    const code = generateBookingCode();
    const newBooking = {
      code: code,
      passcode: generatePasscode(guestInfo.dob),
      name: guestInfo.name,
      roomName: selectedBookingRoom.name,
      categoryName: selectedBookingRoom.categoryName,
      dateIn: bookingForm.dateIn,
      timeIn: bookingForm.timeIn,
      dateOut: bookingForm.type === 'hourly' ? bookingForm.dateIn : bookingForm.dateOut,
      timeOut: bookingForm.timeOut,
      type: bookingForm.type
    };

    setFinalBookingData(newBooking);
    setBookingsDb(prev => [...prev, newBooking]); // Lưu vào Database mô phỏng
    setBookingView('success');
  };

  const handleSearchBooking = (e) => {
    e.preventDefault();
    setSearchResult(null);
    
    const found = bookingsDb.find(b => b.code.toUpperCase() === searchCode.toUpperCase());
    
    if (!found) {
      setSearchResult({ status: 'error', message: 'Không tìm thấy thông tin đặt phòng. Mã không tồn tại hoặc đã bị xóa.' });
      return;
    }

    // Kiểm tra hết hạn: So sánh thời gian hiện tại với Check-in
    const checkInDateTime = new Date(`${found.dateIn}T${found.timeIn}`);
    const now = new Date();

    if (now >= checkInDateTime) {
      setSearchResult({ status: 'error', message: 'Mã đặt phòng đã hết hạn do đã vượt quá thời gian nhận phòng.' });
      // Tự động xóa mã hết hạn khỏi DB
      setBookingsDb(prev => prev.filter(b => b.code !== found.code));
      return;
    }

    setSearchResult({ status: 'success', data: found });
  };

  // --- LOGIC GIỎ HÀNG ---
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) return prev.map(cartItem => cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem);
      return [...prev, { ...item, qty: 1 }];
    });
    
    // Hiển thị hiệu ứng "Đã thêm" trong 1 giây
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1000);
  };
  
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const cartTotalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-200 font-sans selection:bg-[#D4FF00] selection:text-black overflow-x-hidden relative scroll-smooth">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-20"></div>


      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/[0.02] backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex flex-col">
            <span className="text-2xl font-black tracking-[0.1em] uppercase text-white leading-none">Madlad</span>
            <span className="text-[10px] font-light tracking-[0.4em] uppercase text-zinc-500 mt-1">Space & Retreat</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 lg:space-x-12 items-center">
            <a href="#rooms" onClick={() => setActiveSection('rooms')} className={`text-[11px] lg:text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${activeSection === 'rooms' ? 'text-[#D4FF00]' : 'text-zinc-400 hover:text-white'}`}>Hạng phòng</a>
            <button onClick={() => setBookingModalOpen(true)} className="text-[11px] lg:text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 hover:text-white transition-colors">Đặt Phòng</button>
            <button onClick={() => setIsFoodMenuOpen(true)} className={`text-[11px] lg:text-xs font-semibold uppercase tracking-[0.15em] transition-colors flex items-center gap-2 ${isFoodMenuOpen ? 'text-[#D4FF00]' : 'text-zinc-400 hover:text-white'}`}><UtensilsCrossed size={14}/> Đồ ăn</button>
            <a href="#services" onClick={() => setActiveSection('services')} className={`text-[11px] lg:text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${activeSection === 'services' ? 'text-[#D4FF00]' : 'text-zinc-400 hover:text-white'}`}>Dịch vụ</a>
            
            {/* Search Icon */}
            <button onClick={() => { setSearchModalOpen(true); setSearchCode(''); setSearchResult(null); }} className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Cart Icon */}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-white hover:text-[#D4FF00] transition-colors">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartTotalQty > 0 && (
                <span className="absolute 0 right-0 top-0 bg-[#D4FF00] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-[0_0_10px_rgba(212,255,0,0.5)]">
                  {cartTotalQty}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full cursor-pointer hover:border-[#D4FF00] transition-colors group" onClick={() => {if(window.confirm('Đăng xuất?')) setCurrentUser(null)}}>
                <User size={16} className="text-[#D4FF00]" />
                <span className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-[#D4FF00]">{currentUser.name.split(' ').pop()}</span>
              </div>
            ) : (
              <button onClick={() => setAuthState({ isOpen: true, view: 'login' })} className="relative group px-6 py-2.5 overflow-hidden rounded-full ml-2">
                <div className="absolute inset-0 w-full h-full border border-white/20 rounded-full group-hover:border-[#D4FF00] transition-colors duration-500"></div>
                <div className="absolute inset-0 w-0 h-full bg-[#D4FF00] opacity-0 group-hover:w-full group-hover:opacity-10 transition-all duration-500 ease-out rounded-full"></div>
                <span className="relative text-xs font-bold uppercase tracking-[0.15em] text-white group-hover:text-[#D4FF00] transition-colors duration-300">Đăng nhập</span>
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-6">
            <button onClick={() => { setSearchModalOpen(true); setSearchCode(''); setSearchResult(null); }} className="relative text-zinc-400 hover:text-white">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative text-white">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartTotalQty > 0 && <span className="absolute 0 right-0 top-0 bg-[#D4FF00] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">{cartTotalQty}</span>}
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
                Đăng xuất ({currentUser.name})
              </button>
            ) : (
              <button onClick={() => { setIsMenuOpen(false); setAuthState({ isOpen: true, view: 'login' }); }} className="w-fit text-sm font-bold uppercase tracking-[0.2em] text-[#D4FF00] mt-4 flex items-center gap-2">
                Đăng nhập <ArrowUpRight size={16} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 z-10">
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-8 bg-[#D4FF00]"></div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4FF00]">Madlad Space</span>
            <div className="h-px w-8 bg-[#D4FF00]"></div>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl tracking-tighter flex flex-col items-center">
            <span className="font-black text-white uppercase drop-shadow-2xl">It's Good,</span>
            <span className="font-serif italic text-zinc-500 font-light lowercase text-5xl md:text-7xl lg:text-8xl -mt-2 md:-mt-6">because we care</span>
          </h1>
          
          <p className="mt-10 max-w-xl text-zinc-400 font-light text-sm md:text-base tracking-wide leading-relaxed">
            Một định nghĩa khác về lưu trú. Nơi ranh giới giữa nghệ thuật sắp đặt, không gian điện ảnh và sự xa xỉ cá nhân được xóa nhòa.
          </p>

          <button onClick={() => document.getElementById('rooms')?.scrollIntoView({behavior: 'smooth'})} className="mt-14 group relative flex items-center gap-4 text-white hover:text-[#D4FF00] transition-colors duration-500">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Khám phá hạng phòng</span>
            <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:border-[#D4FF00] group-hover:bg-[#D4FF00]/10 transition-all duration-500">
              <ChevronRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </section>

      {/* --- ROOM CATEGORIES SECTION --- */}
      <section id="rooms" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-4">Danh mục</h2>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Hạng phòng<br/><span className="font-serif italic font-light text-zinc-500 lowercase">lưu trú</span></h3>
            </div>
            <p className="text-zinc-400 font-light max-w-sm text-sm leading-relaxed">Mỗi hạng phòng là một tác phẩm nguyên bản, được thiết kế để đánh thức những cảm xúc thuần khiết nhất.</p>
          </div>

          <div className="space-y-40">
            {ROOM_CATEGORIES.map((category, idx) => (
              <div key={category.id} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center group relative`}>
                <div className="w-full lg:w-2/3 relative z-0">
                  <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
                  </div>
                </div>

                <div className={`w-[90%] lg:w-5/12 relative z-10 -mt-20 lg:mt-0 ${idx % 2 !== 0 ? 'lg:-mr-32' : 'lg:-ml-32'}`}>
                  <div className="p-8 md:p-12 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl transition-all duration-500">
                    <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2 drop-shadow-sm">{category.name}</h4>
                    <p className="text-xl font-serif italic text-[#D4FF00] mb-8">{category.priceFrom} VNĐ<span className="text-sm font-sans not-italic text-zinc-400"> / đêm</span></p>
                    <p className="text-sm font-light text-zinc-300 leading-relaxed mb-8">{category.description}</p>
                    <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent mb-8"></div>
                    <ul className="grid grid-cols-1 gap-4 mb-10">
                      {category.features.map((feat, i) => (
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
            {SERVICES.map((srv, idx) => (
              <div key={idx} className="group p-8 md:p-10 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-lg border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col md:flex-row md:items-start gap-6 cursor-default">
                <div className="text-white/50 group-hover:text-[#D4FF00] transition-colors duration-500 bg-white/5 p-4 rounded-2xl w-fit">
                  <srv.icon size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-[#D4FF00] transition-colors duration-500 mb-3">{srv.title}</h4>
                  <p className="text-sm font-light text-zinc-400 leading-relaxed">{srv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- RULES SECTION --- */}
      <section id="rules" className="py-32 relative z-10">
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

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 bg-[#030303]/80 backdrop-blur-xl py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-black tracking-[0.1em] uppercase text-white leading-none">Madlad</span>
            <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-zinc-400 mt-1">Hotel & Cineroom</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-zinc-500 hover:text-[#D4FF00] transition-colors cursor-pointer">
              <MapPin size={20} strokeWidth={1.5} />
              <span className="text-xs font-light">292 Yên Ninh, Mỹ Đông, TP. Phan Rang-Tháp Chàm</span>
            </div>
          </div>
          <p className="text-[10px] font-light uppercase tracking-[0.2em] text-zinc-600">© 2024 Madlad Space. All rights reserved.</p>
        </div>
      </footer>

      {/* --- CART DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[170] flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          {/* Drawer Content */}
          <div className="w-full max-w-md bg-[#080808]/90 backdrop-blur-2xl h-full relative z-10 border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
            {/* Drawer Header */}
            <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-[#D4FF00]"/> Khay đồ ăn
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white p-2">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items List */}
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
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-2 py-1">
                      <button onClick={() => updateQty(item.id, -1)} className="text-zinc-400 hover:text-white">
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="text-zinc-400 hover:text-white">
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    {/* Delete button */}
                    <button onClick={() => removeFromCart(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors ml-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer (Checkout) */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 bg-black/60 p-6">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-xs font-light text-zinc-400 uppercase tracking-widest">Tổng cộng</span>
                  <span className="text-2xl font-black text-[#D4FF00] font-serif italic">{formatPrice(cartTotalPrice)}</span>
                </div>
                
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  let message = '';
                  if (foodPaymentMethod === 'transfer') {
                    message = 'Đơn hàng đang được nhân viên đem lên phòng cho mình, tầm 5p nữa sẽ có người gõ cửa ạ, mình thanh toán mã QR trong hóa đơn giúp home luôn ạ';
                  } else {
                    message = 'Đơn hàng đang được nhân viên đem lên phòng cho mình, tầm 5p nữa sẽ có người gõ cửa ạ, mình vui lòng chuẩn bị sẵn tiền mặt để đưa cho nhân viên ạ';
                  }
                  alert(message);
                  setCart([]);
                  setIsCartOpen(false);
                }}>
                  <div className="mb-4 relative group/input">
                    <select required name="room" defaultValue="" className="w-full bg-white/5 border border-white/20 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors appearance-none cursor-pointer">
                      <option value="" disabled className="text-zinc-500 bg-zinc-900">Bạn đang ở phòng nào?</option>
                      <option value="Phòng Sun" className="bg-zinc-900 text-white">Phòng Sun (Hạng Studio)</option>
                      <option value="Phòng Pluto" className="bg-zinc-900 text-white">Phòng Pluto (Hạng Studio)</option>
                      <option value="Phòng Mercury" className="bg-zinc-900 text-white">Phòng Mercury (Hạng Concept Plus)</option>
                      <option value="Phòng Jupiter" className="bg-zinc-900 text-white">Phòng Jupiter (Hạng Concept)</option>
                      <option value="Phòng Mars" className="bg-zinc-900 text-white">Phòng Mars (Hạng Concept)</option>
                      <option value="Phòng Moon" className="bg-zinc-900 text-white">Phòng Moon (Hạng Concept)</option>
                      <option value="Phòng Venus" className="bg-zinc-900 text-white">Phòng Venus (Hạng Concept)</option>
                      <option value="Phòng Uranus" className="bg-zinc-900 text-white">Phòng Uranus (Hạng Concept)</option>
                      <option value="Phòng Earth" className="bg-zinc-900 text-white">Phòng Earth (Hạng Basic)</option>
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

                  <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(212,255,0,0.3)]">
                    Đặt Món
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- BOOKING MODAL (LUỒNG ĐẶT PHÒNG TỔNG HỢP) --- */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setBookingModalOpen(false)}></div>
          
          <div className="w-full max-w-xl bg-white/[0.05] backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header chung */}
            <div className="p-8 pb-0 flex justify-between items-start relative z-10 shrink-0">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">Reservation</h3>
                <h4 className="text-2xl font-black uppercase text-white tracking-tight">Đặt Phòng</h4>
              </div>
              <button onClick={() => setBookingModalOpen(false)} className="text-zinc-500 hover:text-white p-2 transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            {/* VIEW 1: FORM CHỌN GIỜ */}
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
                    <div className={bookingForm.type === 'hourly' ? 'col-span-2' : 'col-span-1'}>
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-2">Ngày nhận phòng</label>
                      <input required type="date" value={bookingForm.dateIn} onChange={e => setBookingForm({...bookingForm, dateIn: e.target.value})} onClick={(e) => { try { e.target.showPicker && e.target.showPicker(); } catch(err) {} }} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 relative z-10" />
                    </div>
                    {bookingForm.type !== 'hourly' && (
                      <div className="col-span-1">
                        <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-2">Ngày trả phòng</label>
                        <input required type="date" value={bookingForm.dateOut} onChange={e => setBookingForm({...bookingForm, dateOut: e.target.value})} onClick={(e) => { try { e.target.showPicker && e.target.showPicker(); } catch(err) {} }} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 relative z-10" />
                      </div>
                    )}
                    <div className="col-span-1">
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-2">Giờ nhận phòng</label>
                      <div className="relative group/time">
                        <select required value={bookingForm.timeIn} onChange={e => setBookingForm({...bookingForm, timeIn: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors cursor-pointer appearance-none relative z-10">
                          <option value="" disabled className="text-zinc-500">--:-- --</option>
                          {TIME_OPTIONS.map(time => <option key={`in-${time.value}`} value={time.value} className="bg-zinc-900 text-white">{time.label}</option>)}
                        </select>
                        <Clock size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 group-hover/time:text-white transition-colors z-0 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-2">Giờ trả phòng</label>
                      <div className="relative group/time">
                        <select required value={bookingForm.timeOut} onChange={e => setBookingForm({...bookingForm, timeOut: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors cursor-pointer appearance-none relative z-10">
                          <option value="" disabled className="text-zinc-500">--:-- --</option>
                          {TIME_OPTIONS.map(time => <option key={`out-${time.value}`} value={time.value} className="bg-zinc-900 text-white">{time.label}</option>)}
                        </select>
                        <Clock size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 group-hover/time:text-white transition-colors z-0 pointer-events-none" />
                      </div>
                    </div>
                </div>

                <div className="space-y-1 min-h-[20px] mt-2">
                    {bookingForm.type === 'hourly' && getHourlyWarning() && <p className="text-red-500 text-[11px] italic flex items-start gap-1.5"><AlertTriangle size={14} className="shrink-0 mt-0.5"/> {getHourlyWarning()}</p>}
                    {bookingForm.type === 'daily' && getDailyWarning() && <p className="text-red-500 text-[11px] italic flex items-start gap-1.5"><AlertTriangle size={14} className="shrink-0 mt-0.5"/> {getDailyWarning()}</p>}
                    {bookingForm.type === 'overnight' && getOvernightWarning() && <p className="text-red-500 text-[11px] italic flex items-start gap-1.5"><AlertTriangle size={14} className="shrink-0 mt-0.5"/> {getOvernightWarning()}</p>}
                    {getDateWarning() && <p className="text-red-500 text-[11px] italic flex items-start gap-1.5"><AlertTriangle size={14} className="shrink-0 mt-0.5"/> {getDateWarning()}</p>}
                </div>

                <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold uppercase tracking-[0.2em] text-xs py-5 mt-4 rounded-xl hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 flex justify-center items-center gap-3 group">
                  Tìm Phòng Trống <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            {/* VIEW 2: KẾT QUẢ PHÒNG TRỐNG */}
            {bookingView === 'results' && (
              <div className="p-8 pt-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4 shrink-0">
                  <button onClick={() => setBookingView('form')} className="text-zinc-400 hover:text-[#D4FF00] transition-colors p-1"><ArrowLeft size={20}/></button>
                  <span className="text-sm font-light text-zinc-300">
                    Hiển thị phòng trống: <strong className="text-white">{bookingForm.type === 'hourly' ? 'Theo giờ' : bookingForm.type === 'daily' ? 'Theo ngày' : 'Qua đêm'}</strong> ({searchSummary.text})
                  </span>
                </div>

                {availableRooms.map((room) => (
                  <div key={room.id} className="flex flex-col sm:flex-row bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4FF00]/40 transition-colors group shrink-0">
                    <img src={room.image} alt={room.name} className="w-full sm:w-32 h-32 object-cover shrink-0" />
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4FF00]">{room.categoryName}</span>
                        <h5 className="text-base font-bold text-white mb-1 line-clamp-1">{room.name}</h5>
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          {bookingForm.type === 'hourly' && (
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{formatPrice(room.calculatedBasePrice)} / giờ</p>
                          )}
                          <p className="text-lg font-serif italic text-[#D4FF00] leading-none mt-1">{formatPrice(room.totalPrice)}</p>
                        </div>
                        <button 
                          onClick={() => handleSelectRoom(room)}
                          className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 bg-white text-black hover:bg-[#D4FF00] rounded-xl transition-all"
                        >
                          Chọn
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {availableRooms.length === 0 && <p className="text-zinc-500 text-center py-8 text-sm italic">Không tìm thấy phòng trống phù hợp.</p>}
              </div>
            )}

            {/* VIEW 3: ĐIỀN THÔNG TIN (DÀNH CHO KHÁCH CHƯA ĐĂNG NHẬP) */}
            {bookingView === 'guest_info' && (
              <form className="p-8 pt-4 overflow-y-auto custom-scrollbar flex flex-col space-y-6" onSubmit={handleGuestSubmit}>
                <div className="flex items-center gap-3 mb-2 border-b border-white/10 pb-4 shrink-0">
                  <button type="button" onClick={() => setBookingView('results')} className="text-zinc-400 hover:text-[#D4FF00] transition-colors p-1"><ArrowLeft size={20}/></button>
                  <span className="text-sm font-light text-zinc-300">Thông tin liên hệ đặt phòng</span>
                </div>
                
                <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/20 p-4 rounded-xl flex items-start gap-3">
                  <Info size={16} className="text-[#D4FF00] shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-300 font-light">Vui lòng nhập <strong className="text-[#D4FF00]">chính xác ngày sinh</strong>. Hệ thống sẽ dùng ngày sinh của bạn để tạo mật khẩu mở cửa phòng tự động.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 relative group/input">
                    <input required type="text" id="g-name" value={guestInfo.name} onChange={e => setGuestInfo({...guestInfo, name: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors peer placeholder-transparent" placeholder="Họ và tên" />
                    <label htmlFor="g-name" className="absolute left-0 top-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Họ và tên</label>
                  </div>
                  
                  <div className="col-span-1 relative group/input">
                    <input required type="date" id="g-dob" value={guestInfo.dob} onChange={e => setGuestInfo({...guestInfo, dob: e.target.value})} onClick={(e) => { try { e.target.showPicker && e.target.showPicker(); } catch(err) {} }} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors peer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100" />
                    <label htmlFor="g-dob" className="absolute left-0 -top-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest transition-all">Ngày sinh</label>
                  </div>

                  <div className="col-span-1 relative group/input">
                    <input required type="tel" id="g-phone" value={guestInfo.phone} onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors peer placeholder-transparent" placeholder="Số ĐT" />
                    <label htmlFor="g-phone" className="absolute left-0 top-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Số ĐT</label>
                  </div>

                  <div className="col-span-2 relative group/input">
                    <input required type="email" id="g-email" value={guestInfo.email} onChange={e => setGuestInfo({...guestInfo, email: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors peer placeholder-transparent" placeholder="Email" />
                    <label htmlFor="g-email" className="absolute left-0 top-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Email</label>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold uppercase tracking-[0.2em] text-xs py-5 mt-4 rounded-xl hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 flex justify-center items-center gap-3 group">
                  Tiếp tục thanh toán <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            {/* VIEW 4: MÃ QR THANH TOÁN */}
            {bookingView === 'payment' && (
              <div className="p-8 pt-4 overflow-y-auto custom-scrollbar flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-6 border-b border-white/10 pb-4 shrink-0">
                  <button onClick={() => setBookingView(currentUser ? 'results' : 'guest_info')} className="text-zinc-400 hover:text-[#D4FF00] transition-colors p-1"><ArrowLeft size={20}/></button>
                  <span className="text-sm font-bold uppercase tracking-widest text-[#D4FF00]">Thanh toán an toàn</span>
                  <div className="w-6"></div> {/* Spacer */}
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(212,255,0,0.15)] mb-6">
                  {/* Mã QR giả định */}
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=madlad_pay_${selectedBookingRoom?.totalPrice}&color=000000`} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                </div>

                <h4 className="text-2xl font-serif italic text-white mb-2">{formatPrice(selectedBookingRoom?.totalPrice || 0)}</h4>
                <p className="text-xs font-light text-zinc-400 mb-8 text-center">Quét mã QR để thanh toán cho phòng <strong className="text-white">{selectedBookingRoom?.name}</strong>. Hệ thống sẽ tự động xác nhận sau vài giây.</p>

                <button onClick={handlePaymentComplete} className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] text-xs py-5 rounded-xl hover:bg-[#D4FF00] shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 flex justify-center items-center gap-3">
                  Tôi đã chuyển khoản xong <CheckCircle size={16} />
                </button>
              </div>
            )}

            {/* VIEW 5: THÀNH CÔNG VÀ HIỂN THỊ PASSCODE */}
            {bookingView === 'success' && finalBookingData && (
              <div className="p-8 pt-6 overflow-y-auto custom-scrollbar flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#D4FF00]/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-[#D4FF00]" />
                </div>
                
                <h4 className="text-2xl font-black uppercase text-white tracking-tight mb-2">Đặt phòng thành công!</h4>
                <p className="text-xs font-light text-zinc-400 mb-8">Cảm ơn <strong className="text-white">{finalBookingData.name}</strong>. Chào mừng bạn đến với Madlad Space.</p>

                <div className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-left space-y-4 mb-8">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mã đặt phòng</span>
                    <span className="text-sm font-mono text-white">{finalBookingData.code}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Không gian</span>
                    <span className="text-sm font-bold text-[#D4FF00]">{finalBookingData.roomName}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 bg-black/30 p-3 rounded-xl border border-white/5 my-2">
                    <div>
                      <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-in</span>
                      <span className="block text-sm font-bold text-white">{finalBookingData.timeIn}</span>
                      <span className="block text-[10px] text-zinc-400 mt-0.5">{finalBookingData.dateIn}</span>
                    </div>
                    <div className="text-right border-l border-white/10 pl-4">
                      <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-out</span>
                      <span className="block text-sm font-bold text-white">{finalBookingData.timeOut}</span>
                      <span className="block text-[10px] text-zinc-400 mt-0.5">{finalBookingData.dateOut}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Passcode mở cửa</span>
                    <div className="bg-[#D4FF00] text-black px-4 py-2 rounded-lg font-mono font-black text-xl tracking-widest shadow-[0_0_15px_rgba(212,255,0,0.4)]">
                      {finalBookingData.passcode}
                    </div>
                  </div>
                </div>

                <button onClick={() => setBookingModalOpen(false)} className="text-xs font-bold text-white uppercase tracking-[0.2em] border-b border-white/30 hover:border-white hover:text-[#D4FF00] pb-1 transition-colors">
                  Về trang chủ
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- ROOM LIST MODAL (Khi bấm Xem thêm phòng) --- */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setSelectedCategory(null)}></div>
          
          <div className="w-full max-w-5xl bg-zinc-950/90 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-start shrink-0 relative bg-black/50">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">Danh sách phòng trống</h3>
                <h4 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">{selectedCategory.name}</h4>
              </div>
              <button onClick={() => setSelectedCategory(null)} className="text-zinc-500 hover:text-white p-2 transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            
            {/* Đã tách riêng lớp cuộn (overflow) và lớp Grid để không bị ép mất chữ */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 min-h-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                {selectedCategory.subRooms.map((room) => (
                  <div key={room.id} className="flex flex-col bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden hover:bg-zinc-900/90 hover:border-[#D4FF00]/40 transition-all group">
                    <div className="relative h-48 w-full overflow-hidden shrink-0">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-5 flex flex-col flex-1 justify-between bg-white/[0.02]">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h5 className="text-lg font-bold text-white group-hover:text-[#D4FF00] transition-colors leading-tight line-clamp-2">{room.name}</h5>
                          <button onClick={() => setViewingRoom(room)} className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white border-b border-transparent hover:border-white transition-colors mt-1">Chi tiết phòng</button>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-light text-zinc-400 mt-2">
                          <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-zinc-500"/> {room.bed}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                        <p className="text-base font-serif italic text-[#D4FF00]">{room.price} VNĐ</p>
                        <button 
                          disabled={room.status !== 'Trống'}
                          onClick={() => {
                            setSelectedCategory(null);
                            setBookingModalOpen(true);
                          }}
                          className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl transition-all ${room.status === 'Trống' ? 'bg-white text-black hover:bg-[#D4FF00]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                        >
                          {room.status === 'Trống' ? 'Đặt Ngay' : 'Hết Phòng'}
                        </button>
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
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" onClick={() => setViewingRoom(null)}></div>
          <div className="w-full max-w-5xl bg-zinc-950 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center shrink-0 bg-black/50">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">Chi tiết không gian</h3>
                <h4 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">{viewingRoom.name}</h4>
              </div>
              <button onClick={() => setViewingRoom(null)} className="text-zinc-500 hover:text-white p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <div className="mb-10">
                <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">Góc nhìn không gian</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {viewingRoom.images.map((img, i) => (
                    <div key={i} className={`rounded-2xl overflow-hidden bg-zinc-900 ${i === 0 ? 'md:col-span-2 md:row-span-2 h-[300px] md:h-full' : 'h-[150px] md:h-[200px]'}`}>
                      <img src={img} alt="room view" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                  <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4FF00] mb-6 flex items-center gap-2"><Sparkles size={16} /> Tiện ích nổi bật</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    {viewingRoom.amenities.map((amenity, i) => (
                      <div key={i} className="flex items-center text-sm font-light text-zinc-300">
                        <CheckCircle size={16} className="text-[#D4FF00]/70 mr-3 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 flex flex-col justify-center items-center text-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Giá chỉ từ</p>
                  <p className="text-3xl font-serif italic text-white mb-8">{viewingRoom.price} <span className="text-sm font-sans not-italic text-zinc-500">VNĐ</span></p>
                  <button 
                    disabled={viewingRoom.status !== 'Trống'}
                    onClick={() => {
                      setViewingRoom(null);
                      setSelectedCategory(null);
                      setBookingModalOpen(true);
                    }} 
                    className={`w-full font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-xl transition-all shadow-lg ${viewingRoom.status === 'Trống' ? 'bg-[#D4FF00] text-black hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                  >
                    {viewingRoom.status === 'Trống' ? 'Đặt phòng ngay' : 'Đã hết phòng'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- AUTH MODAL --- */}
      {authState.isOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setAuthState({...authState, isOpen: false})}></div>
          
          <div className="w-full max-w-md bg-white/[0.05] backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
            
            <div className="p-8 pb-0 flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">
                  {authState.view === 'login' ? 'Welcome Back' : 'Join Us'}
                </h3>
                <h4 className="text-2xl font-black uppercase text-white tracking-tight">
                  {authState.view === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </h4>
              </div>
              <button onClick={() => setAuthState({...authState, isOpen: false})} className="text-zinc-500 hover:text-white p-2 transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-8 pt-6 relative z-10">
              {authState.view === 'login' ? (
                <form className="space-y-6" onSubmit={(e) => { 
                    e.preventDefault();
                    // Giả lập đăng nhập thành công với dữ liệu của 1 user
                    setCurrentUser({ name: 'Nguyễn Văn Madlad', dob: '2001-05-20', phone: '0901234567', email: 'madlad@gmail.com' });
                    setAuthState({...authState, isOpen: false}); 
                }}>
                  <div className="relative group/input">
                    <input required type="text" id="username" className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors peer placeholder-transparent" placeholder="Tên đăng nhập" />
                    <label htmlFor="username" className="absolute left-0 top-3 text-xs font-light text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Tên đăng nhập</label>
                  </div>
                  <div className="relative group/input">
                    <input required type="password" id="password" className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors peer placeholder-transparent" placeholder="Mật khẩu" />
                    <label htmlFor="password" className="absolute left-0 top-3 text-xs font-light text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Mật khẩu</label>
                  </div>
                  <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] text-xs py-5 mt-4 rounded-xl hover:bg-[#D4FF00] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-all duration-300 flex justify-center items-center gap-3 group">
                    Đăng Nhập <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <div className="text-center mt-6">
                    <p className="text-xs font-light text-zinc-400">
                      Chưa có tài khoản?{' '}
                      <button type="button" onClick={() => setAuthState({...authState, view: 'register'})} className="text-[#D4FF00] font-bold hover:underline underline-offset-4 transition-colors">
                        Đăng ký ngay
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={(e) => { 
                    e.preventDefault(); 
                    alert('Đăng ký tài khoản thành công!'); 
                    setAuthState({...authState, view: 'login'}); 
                }}>
                  <div className="relative group/input">
                    <input required type="text" id="reg-username" className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors peer placeholder-transparent" placeholder="Tên đăng nhập" />
                    <label htmlFor="reg-username" className="absolute left-0 top-3 text-xs font-light text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Tên đăng nhập</label>
                  </div>
                  <div className="relative group/input">
                    <input required type="text" id="reg-contact" className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors peer placeholder-transparent" placeholder="Email hoặc SĐT" />
                    <label htmlFor="reg-contact" className="absolute left-0 top-3 text-xs font-light text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Email hoặc SĐT</label>
                  </div>
                  <div className="relative group/input">
                    <input required type="password" id="reg-password" className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors peer placeholder-transparent" placeholder="Mật khẩu mới" />
                    <label htmlFor="reg-password" className="absolute left-0 top-3 text-xs font-light text-zinc-500 uppercase tracking-widest peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4FF00] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400 transition-all cursor-text">Tạo mật khẩu mới</label>
                  </div>
                  <button type="submit" className="w-full bg-[#D4FF00] text-black font-bold uppercase tracking-[0.2em] text-xs py-5 mt-4 rounded-xl hover:bg-white shadow-[0_0_20px_rgba(212,255,0,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 flex justify-center items-center gap-3 group">
                    Tạo Tài Khoản <CheckCircle size={16} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <div className="text-center mt-6">
                    <p className="text-xs font-light text-zinc-400">
                      Đã có tài khoản?{' '}
                      <button type="button" onClick={() => setAuthState({...authState, view: 'login'})} className="text-white font-bold hover:underline underline-offset-4 transition-colors">
                        Đăng nhập
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SEARCH BOOKING MODAL (Tra cứu đặt phòng) --- */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setSearchModalOpen(false)}></div>
          
          <div className="w-full max-w-md bg-[#080808]/90 backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
            
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-start shrink-0 relative">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2">Check in</h3>
                <h4 className="text-2xl font-black uppercase text-white tracking-tight">Tra cứu phòng</h4>
              </div>
              <button onClick={() => setSearchModalOpen(false)} className="text-zinc-500 hover:text-white p-2 transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <form onSubmit={handleSearchBooking} className="mb-6 flex gap-3">
                <input 
                  type="text" 
                  required
                  placeholder="Nhập mã đặt phòng (VD: MDL12345)" 
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-white/5 border border-white/20 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4FF00] transition-colors font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal" 
                />
                <button type="submit" className="bg-[#D4FF00] text-black px-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center">
                  <Search size={20} strokeWidth={2} />
                </button>
              </form>

              {searchResult?.status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200 font-light leading-relaxed">{searchResult.message}</p>
                </div>
              )}

              {searchResult?.status === 'success' && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 animate-in slide-in-from-bottom-4 fade-in">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#D4FF00]/20 flex items-center justify-center text-[#D4FF00]">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Khách hàng</span>
                      <strong className="text-sm text-white uppercase tracking-wider">{searchResult.data.name}</strong>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Không gian</span>
                      <div className="text-right">
                        <span className="block text-[9px] text-[#D4FF00] uppercase tracking-widest mb-1">{searchResult.data.categoryName}</span>
                        <span className="text-sm font-bold text-white">{searchResult.data.roomName}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 bg-black/30 p-3 rounded-xl border border-white/5">
                      <div>
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-in</span>
                        <span className="block text-xs font-bold text-white">{searchResult.data.timeIn}</span>
                        <span className="block text-[10px] text-zinc-400 mt-0.5">{searchResult.data.dateIn}</span>
                      </div>
                      <div className="text-right border-l border-white/10 pl-4">
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Check-out</span>
                        <span className="block text-xs font-bold text-white">{searchResult.data.timeOut}</span>
                        <span className="block text-[10px] text-zinc-400 mt-0.5">{searchResult.data.dateOut}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/30 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-bold text-[#D4FF00] uppercase tracking-widest mb-1">Mật khẩu mở cửa</span>
                      <span className="text-xs font-light text-zinc-300">Sử dụng trên bàn phím số</span>
                    </div>
                    <span className="text-lg font-black font-mono tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      {searchResult.data.passcode}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- FOOD MENU MODAL --- */}
      {isFoodMenuOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setIsFoodMenuOpen(false)}></div>
          
          <div className="w-full max-w-6xl h-full max-h-[90vh] bg-[#050505] backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center shrink-0 bg-black/40">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4FF00] mb-2 flex items-center gap-2"><UtensilsCrossed size={14}/> Room Service</h3>
                <h4 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">Thực đơn đồ ăn</h4>
              </div>
              <div className="flex items-center gap-4">
                {/* Nút Giỏ Hàng Mới */}
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-white hover:text-[#D4FF00] transition-colors">
                  <ShoppingCart size={24} strokeWidth={1.5} />
                  {cartTotalQty > 0 && (
                    <span className="absolute 0 right-0 top-0 bg-[#D4FF00] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-[0_0_10px_rgba(212,255,0,0.5)]">
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

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 relative">
              <div className="flex flex-col md:flex-row justify-between mb-12 gap-4 relative z-20">
                <p className="text-zinc-400 font-light max-w-sm text-sm leading-relaxed">Order trực tiếp trên web. Nhân viên sẽ mang đồ ăn lên tận phòng cho bạn chỉ sau vài phút.</p>
                
                {/* Nút bật/tắt Danh Mục */}
                <div className="relative">
                  <button 
                    onClick={() => setIsFoodCategoryOpen(!isFoodCategoryOpen)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all backdrop-blur-md border ${isFoodCategoryOpen || activeFoodCategory !== 'Tất cả' ? 'bg-[#D4FF00]/10 border-[#D4FF00] text-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300'}`}
                  >
                    <Filter size={16} className="text-[#D4FF00]" />
                    Danh mục: <span className="text-[#D4FF00]">{activeFoodCategory}</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isFoodCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Bảng Danh Mục Mở Rộng */}
                  <div className={`absolute top-full right-0 md:right-0 left-0 md:left-auto mt-4 w-full sm:w-[450px] bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 origin-top ${isFoodCategoryOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="flex flex-wrap gap-2.5">
                      {FOOD_CATEGORIES.map(cat => (
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

              {/* Lưới hiển thị món ăn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {SNACKS.filter(snack => activeFoodCategory === 'Tất cả' || snack.category === activeFoodCategory).length > 0 ? (
                  SNACKS.filter(snack => activeFoodCategory === 'Tất cả' || snack.category === activeFoodCategory).map((snack) => (
                    <div key={snack.id} className="group flex flex-col bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4FF00]/30 hover:bg-white/[0.04] transition-all duration-500">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img src={snack.image} alt={snack.name} className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                        <div className="absolute top-4 left-4">
                          <span className="text-[9px] font-bold uppercase tracking-widest bg-black/60 text-[#D4FF00] px-2 py-1 rounded-md backdrop-blur-md border border-[#D4FF00]/20">{snack.category}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <span className="text-lg font-bold text-[#D4FF00] font-serif italic tracking-wide">{formatPrice(snack.price)}</span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <h4 className="text-base font-bold uppercase tracking-tight text-white mb-2 line-clamp-1">{snack.name}</h4>
                          <p className="text-[11px] font-light text-zinc-400 mb-5 line-clamp-2">{snack.desc}</p>
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

    </div>
  );
}