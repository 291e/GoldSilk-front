const API_BASE_URL = "https://goldsilk.net";

/**
 * 찜 목록에 상품 추가
 * @param {number} productId - 추가할 상품 ID
 * @returns {Promise<Object>} - 추가된 찜 항목 정보
 */
export async function addToWishlist(productId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "찜 목록에 추가 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding to wishlist:", error.message);
    throw error;
  }
}

/**
 * 찜 목록 조회
 * @returns {Promise<Array>} - 찜 목록 배열
 */
export async function getWishlist() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "찜 목록 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching wishlist:", error.message);
    throw error;
  }
}

/**
 * 찜 목록에서 상품 삭제
 * @param {number} productId - 삭제할 상품 ID
 * @returns {Promise<Object>} - 삭제된 찜 항목 정보
 */
export async function removeFromWishlist(productId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "찜 목록에서 삭제 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing from wishlist:", error.message);
    throw error;
  }
}
