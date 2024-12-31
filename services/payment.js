// app/payment.js

const PAYMENT_BASE_URL = "https://goldsilkaws.metashopping.kr/payments"; // 백엔드 URL

// 결제 요청
export async function requestPayment(orderId, amount) {
  try {
    const response = await fetch(`${PAYMENT_BASE_URL}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // JWT 토큰 인증
      },
      body: JSON.stringify({ orderId, amount }),
    });

    if (!response.ok) {
      throw new Error(`Failed to request payment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error requesting payment:", error.message);
    return null;
  }
}

// 결제 확인
export async function confirmPayment(paymentKey, orderId, amount) {
  try {
    const response = await fetch(`${PAYMENT_BASE_URL}/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // JWT 토큰 인증
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    if (!response.ok) {
      throw new Error(`Failed to confirm payment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error confirming payment:", error.message);
    return null;
  }
}
