const API_BASE_URL = "https://goldsilk.net";

/**
 * 결제 승인
 * @param {Object} paymentData - 결제 데이터 (paymentKey, orderId, amount)
 * @returns {Promise<Object>} - 결제 승인 결과
 */
export async function confirmPayment(paymentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "결제 승인 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error confirming payment:", error.message);
    throw error;
  }
}
