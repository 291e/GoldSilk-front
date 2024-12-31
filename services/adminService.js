const API_BASE_URL = "https://goldsilkaws.metashopping.kr";

/**
 * 어드민 대시보드 데이터 가져오기
 * @returns {Promise<Object>}
 */
export async function fetchAdminDashboard() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admin dashboard");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching admin dashboard:", error.message);
    throw error;
  }
}

/**
 * 모든 사용자 조회
 * @returns {Promise<Array>}
 */
export async function fetchAllUsers() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    throw error;
  }
}

/**
 * 상품 생성
 * @param {Object} productData - 상품 데이터
 * @returns {Promise<Object>}
 */
export async function createProduct(productData) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error.message);
    throw error;
  }
}

/**
 * 상품 수정
 * @param {number} productId - 상품 ID
 * @param {Object} updates - 수정할 데이터
 * @returns {Promise<Object>}
 */
export async function updateProduct(productId, updates) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(
      `${API_BASE_URL}/admin/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw error;
  }
}

/**
 * 상품 삭제
 * @param {number} productId - 상품 ID
 * @returns {Promise<Object>}
 */
export async function deleteProduct(productId) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(
      `${API_BASE_URL}/admin/products/${productId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw error;
  }
}

/**
 * 모든 주문 조회
 * @returns {Promise<Array>}
 */
export async function fetchAllOrders() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    throw error;
  }
}

/**
 * 주문 상태 변경
 * @param {number} orderId - 주문 ID
 * @param {string} status - 새 상태
 * @returns {Promise<Object>}
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/admin/orders/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order_id: orderId, status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order status:", error.message);
    throw error;
  }
}

/**
 * 어드민 통계 데이터 가져오기
 * @param {string} type - 통계 유형 (예: "order_stats", "product_sales_stats")
 * @returns {Promise<Object>}
 */
export async function fetchAdminStats(type) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/admin/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type}:`, error.message);
    throw error;
  }
}
