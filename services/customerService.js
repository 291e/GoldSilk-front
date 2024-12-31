const API_BASE_URL = "https://goldsilkaws.metashopping.kr";

/**
 * 고객 서비스 요청 생성
 * @param {Object} serviceRequestData - 서비스 요청 데이터
 * @returns {Promise<Object>} - 생성된 서비스 요청 정보
 */
export async function createCustomerServiceRequest(serviceRequestData) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/cs/service-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(serviceRequestData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "고객 서비스 요청 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating customer service request:", error.message);
    throw error;
  }
}

/**
 * 반품 및 환불 요청 생성
 * @param {Object} refundRequestData - 환불 요청 데이터
 * @returns {Promise<Object>} - 생성된 환불 요청 정보
 */
export async function createRefundRequest(refundRequestData) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/cs/refund-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(refundRequestData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "환불 요청 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating refund request:", error.message);
    throw error;
  }
}
