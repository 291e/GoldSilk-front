const API_BASE_URL = "https://goldsilk.net";
const API_BASE_URL_DEV = "htttp://localhost:8080";

// 공통 헤더 설정 함수
function getAuthHeaders() {
  const token = localStorage.getItem("refresh_token");
  if (!token) throw new Error("JWT 토큰이 없습니다.");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

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
/**
 * 사용자 주문 내역 조회
 * @param {number} page - 현재 페이지 번호 (기본값: 1)
 * @param {number} limit - 한 페이지에 표시할 주문 개수 (기본값: 10)
 * @returns {Promise<Object>} - 주문 데이터, 총 개수, 총 페이지수 포함
 */
export async function getUserOrders(page = 1, limit = 10) {
  try {
    // API 호출
    const response = await fetch(
      `${API_BASE_URL}/orders/my_orders?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    // 응답 검증
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to fetch user orders");
    }

    // JSON 데이터 파싱
    const { orders, totalCount, totalPages, currentPage } =
      await response.json();

    // 필요한 데이터 반환
    return { orders, totalCount, totalPages, currentPage };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
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
