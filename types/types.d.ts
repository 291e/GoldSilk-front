// 사용자
interface User {
  user_id: number;
  username: string;
  email: string;
  phone: string;
  password: string;
  created_at?: string;
  refresh_token?: string | null;
  is_admin?: boolean;
}

// 상품
interface Product {
  product_id: number;
  name?: string;
  price?: number;
  images: string[]; // 이미지 URL 배열
  description?: string;
  detail_images: string[];
  category?: string;
  tags: string[];
  default_etc?: string | null;
  reviews?: Review[]; // 리뷰 연결
  options?: ProductOption[]; // 상품 옵션 연결
}

// 상품 옵션
interface ProductOption {
  option_id: number;
  option_group_id: number;
  value: string; // 옵션 값 (예: 색상, 크기)
  additional_price?: number; // 추가 금액
}

// 장바구니 항목
interface CartItem {
  cart_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at?: string;
  updated_at?: string;
  options?: string | null; // JSON으로 저장된 옵션 데이터
  products: Product;
}

// 주문
interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  shipping_address?: string;
  recipient_name?: string;
  phone_number?: string;
  message?: string;
  order_status?: string;
  created_at?: string;
  updated_at?: string;
  tracking_number?: string | null;
  delivery_service?: string | null;
  order_group_date?: string;
  order_items: OrderItem[];
}

// 주문 항목
interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at?: string;
  options?: string | null;
  etc?: string | null;
  products: Product;
}

// 리뷰
interface Review {
  review_id: number;
  product_id: number;
  user_id: number;
  rating?: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  products: Product;
  users: User;
}

// 알림
interface Notification {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  type: string; // 예: "order", "promotion"
  is_read?: boolean;
  created_at?: string;
}

// 배너
interface Banner {
  banner_id: number;
  image_url: string;
  link_url: string;
  status?: string; // "active" | "inactive"
  created_at?: string;
  updated_at?: string;
}

// 커뮤니티
interface Community {
  community_id: number;
  user_id: number;
  title: string;
  content: string;
  type?: string; // 커뮤니티 타입 (공지사항, 이벤트 등)
  created_at?: string;
  updated_at?: string;
  status?: string; // "active" | "inactive"
  view_count?: number;
  image?: string;
  comments?: Comment[];
}

// 커뮤니티 댓글
interface Comment {
  comment_id: number;
  community_id: number;
  user_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
}

// 배송 정보
interface ShippingInfo {
  shipping_id: number;
  order_id: number;
  shipping_address: string;
  tracking_number?: string;
  shipping_date?: string;
  delivery_date?: string;
  shipping_status?: string; // "pending" | "shipped" | "delivered"
  created_at?: string;
  updated_at?: string;
}

// 환불 요청
interface RefundRequest {
  request_id: number;
  user_id: number;
  order_id: number;
  product_id: number;
  reason: string;
  status?: string; // "pending" | "approved" | "rejected"
  created_at?: string;
  updated_at?: string;
}

// 장바구니 추가 요청 데이터
interface AddCartItemRequest {
  product_id: number;
  quantity: number;
  options?: string | null;
}

// 주문 생성 요청 데이터
interface CreateOrderRequest {
  user_id: number;
  total_amount: number;
  shipping_address?: string;
  recipient_name?: string;
  phone_number?: string;
  message?: string;
  cart_items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

// 알림 생성 요청 데이터
interface CreateNotificationRequest {
  user_id: number;
  title: string;
  message: string;
  type: string; // 예: "order", "promotion"
}
