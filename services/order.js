const ORDER_BASE_URL = "https://goldsilkaws.metashopping.kr/orders"; // 수정된 URL

// **주문 생성**
export async function createOrder(orderData) {
  try {
    const response = await fetch(ORDER_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // 인증 헤더
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.status}`);
    }

    return await response.json(); // 생성된 주문 반환
  } catch (error) {
    console.error("Error creating order:", error.message);
    return null;
  }
}

// **주문 상태 업데이트**
export async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // 인증 헤더
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.status}`);
    }

    return await response.json(); // 업데이트된 주문 반환
  } catch (error) {
    console.error("Error updating order status:", error.message);
    return null;
  }
}

// **특정 주문 조회**
export async function fetchOrderDetails(orderId) {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // 인증 헤더
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order details: ${response.status}`);
    }

    return await response.json(); // { order, orderItems }
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    return null;
  }
}

// **주문 상세 정보 업데이트**
export async function updateOrderDetails(orderId, orderData) {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/${orderId}/details`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // 인증 헤더
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order details: ${response.status}`);
    }

    return await response.json(); // 업데이트된 주문 반환
  } catch (error) {
    console.error("Error updating order details:", error.message);
    return null;
  }
}

export async function fetchOrders() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch("/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    throw error;
  }
}
