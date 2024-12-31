const API_BASE_URL = "https://goldsilkaws.metashopping.kr";

/**
 * 배송 추적
 * @param {string} orderId - 주문 ID
 * @returns {Promise<Object>} - 배송 추적 정보
 */
export async function trackShipping(orderId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/shipping/${orderId}/track`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "배송 추적 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error tracking shipping:", error.message);
    throw error;
  }
}
