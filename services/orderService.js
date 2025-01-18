const API_BASE_URL = "https://goldsilk.net";
const API_BASE_URL_DEV = "htttp://localhost:8080";

// 공통 유틸리티 함수: 요청 처리
async function handleRequest(url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `Unexpected response: ${response.statusText} (${response.status})`,
      }));
      throw new Error(error.message || "요청 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

// 공통 유틸리티 함수: 토큰 가져오기
function getRefreshToken() {
  const token = localStorage.getItem("refresh_token");
  if (!token) throw new Error("로그인이 필요합니다.");
  return token;
}

// **주문 생성**
export async function createOrder(orderData) {
  const token = getRefreshToken();

  return handleRequest(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
}

// **특정 주문 조회**
export async function getOrderById(orderId) {
  const token = getRefreshToken();

  return handleRequest(`${API_BASE_URL}/orders/detail/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// **주문 상태 업데이트**
export async function updateOrderStatus(orderId, updates) {
  const token = getRefreshToken();

  return handleRequest(`${API_BASE_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
}

// **주문 상세 정보 업데이트**
export async function updateOrderDetails(orderId, updates) {
  const token = getRefreshToken();

  return handleRequest(`${API_BASE_URL}/orders/${orderId}/details`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
}

// **사용자 주문 내역 조회**
export async function getUserOrders(page = 1, limit = 10) {
  const token = getRefreshToken();

  return handleRequest(
    `${API_BASE_URL}/orders/my_orders?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

// **주문 취소**
export async function cancelOrder(orderId) {
  const token = getRefreshToken();

  return handleRequest(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// **배송 상태 확인**
export async function checkShippingStatus(orderId) {
  const token = getRefreshToken();

  return handleRequest(`${API_BASE_URL}/orders/${orderId}/shipping-status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// **배송지 수정**
export async function updateShippingAddress(orderId, shippingAddress) {
  const token = getRefreshToken();

  return handleRequest(`${API_BASE_URL}/orders/${orderId}/shipping-address`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shipping_address: shippingAddress }),
  });
}

// **모든 주문 조회 (관리자 전용)**
export async function getAllOrders(page = 1, limit = 10) {
  const token = getRefreshToken();

  return handleRequest(
    `${API_BASE_URL}/orders/all-orders?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
