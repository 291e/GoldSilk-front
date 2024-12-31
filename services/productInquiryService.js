const API_BASE_URL = "https://goldsilkaws.metashopping.kr";

/**
 * 상품 문의 작성
 * @param {Object} inquiryData - 문의 데이터 (user_id, product_id, question)
 * @returns {Promise<Object>} - 생성된 상품 문의 정보
 */
export async function createProductInquiry(inquiryData) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/product-inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inquiryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "상품 문의 작성 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating product inquiry:", error.message);
    throw error;
  }
}

/**
 * 상품 문의 조회
 * @param {string} productId - 조회할 상품의 ID
 * @returns {Promise<Array>} - 해당 상품의 문의 리스트
 */
export async function getProductInquiries(productId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/product-inquiries/${productId}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "상품 문의 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product inquiries:", error.message);
    throw error;
  }
}

/**
 * 상품 문의 답변 작성
 * @param {string} inquiryId - 답변할 문의 ID
 * @param {Object} answerData - 답변 데이터 (answer)
 * @returns {Promise<Object>} - 작성된 답변 정보
 */
export async function replyToProductInquiry(inquiryId, answerData) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/product-inquiries/${inquiryId}/reply`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answerData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "상품 문의 답변 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error replying to product inquiry:", error.message);
    throw error;
  }
}
