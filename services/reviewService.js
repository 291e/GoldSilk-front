const API_BASE_URL = "https://goldsilk.net";

/**
 * 특정 상품의 리뷰 조회
 * @param {string} productId - 상품 ID
 * @returns {Promise<Array>} - 리뷰 리스트
 */
export async function getReviewsByProduct(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${productId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "리뷰 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    throw error;
  }
}
/**
 * 리뷰 작성
 * @param {Object} reviewData - 리뷰 데이터 (product_id, rating, comment)
 * @param {File} [image] - 리뷰 이미지 파일 (선택적)
 * @returns {Promise<Object>} - 생성된 리뷰
 */
export async function createReview(reviewData, image) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    // FormData 생성
    const formData = new FormData();
    formData.append("product_id", reviewData.product_id);
    formData.append("rating", reviewData.rating);
    if (reviewData.comment) formData.append("comment", reviewData.comment);
    if (image) formData.append("image", image);

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "리뷰 작성 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating review:", error.message);
    throw error;
  }
}

/**
 * 리뷰 수정
 * @param {string} reviewId - 리뷰 ID
 * @param {Object} updates - 수정할 데이터 (rating, comment)
 * @param {File} [image] - 새 이미지 파일 (선택적)
 * @returns {Promise<Object>} - 수정된 리뷰
 */
export async function updateReview(reviewId, updates, image) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    // FormData 생성
    const formData = new FormData();
    if (updates.rating) formData.append("rating", updates.rating);
    if (updates.comment) formData.append("comment", updates.comment);
    if (image) formData.append("image", image);

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "리뷰 수정 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating review:", error.message);
    throw error;
  }
}

/**
 * 리뷰 삭제
 * @param {string} reviewId - 리뷰 ID
 * @returns {Promise<Object>} - 삭제된 리뷰 정보
 */
export async function deleteReview(reviewId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "리뷰 삭제 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting review:", error.message);
    throw error;
  }
}
