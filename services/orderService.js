const API_BASE_URL = "https://goldsilk.net";

// 공통 유틸리티 함수: 헤더 생성
function getAuthHeaders() {
  const token = localStorage.getItem("refresh_token");
  if (!token) throw new Error("JWT 토큰이 없습니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// 공통 유틸리티 함수: 요청 처리
async function handleRequest(url, options = {}) {
  try {
    const headers = {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `Unexpected response: ${response.statusText} (${response.status})`,
      }));
      throw new Error(error.message || "요청 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", {
      url,
      options,
      message: error.message,
    });
    throw error;
  }
}

// **주문 생성**
export async function createOrder(orderData) {
  return handleRequest(`${API_BASE_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

// **특정 주문 조회**
export async function getOrderById(orderId) {
  return handleRequest(`${API_BASE_URL}/orders/detail/${orderId}`);
}

// **주문 상태 업데이트**
export async function updateOrderStatus(orderId, updates) {
  return handleRequest(`${API_BASE_URL}/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// **주문 상세 정보 업데이트**
export async function updateOrderDetails(orderId, updates) {
  return handleRequest(`${API_BASE_URL}/orders/${orderId}/details`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// **사용자 주문 내역 조회**
export async function getUserOrders(page = 1, limit = 10) {
  const queryParams = new URLSearchParams({ page, limit });
  return handleRequest(`${API_BASE_URL}/orders/my_orders?${queryParams}`);
}

// **주문 취소**
export async function cancelOrder(orderId) {
  return handleRequest(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: "PUT",
  });
}

// **배송 상태 확인**
export async function checkShippingStatus(orderId) {
  return handleRequest(`${API_BASE_URL}/orders/${orderId}/shipping-status`);
}

// **배송지 수정**
export async function updateShippingAddress(orderId, shippingAddress) {
  return handleRequest(`${API_BASE_URL}/orders/${orderId}/shipping-address`, {
    method: "PUT",
    body: JSON.stringify({ shipping_address: shippingAddress }),
  });
}

// **모든 주문 조회 (관리자 전용)**
export async function getAllOrders(page = 1, limit = 10) {
  const queryParams = new URLSearchParams({ page, limit });
  return handleRequest(`${API_BASE_URL}/orders/all-orders?${queryParams}`);
}
