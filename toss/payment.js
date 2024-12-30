import { fetchOrderDetails } from "../app/order.js"; // 주문 정보 API
import { confirmPayment } from "../app/payment.js"; // 결제 확인 API

// DOM 요소 가져오기
const paymentRequestButton = document.getElementById("payment-request-button");

let orderDetails = {}; // 주문 정보를 저장할 객체

// 주문 상세 정보 로드
async function loadOrderDetails(orderId) {
  try {
    const order = await fetchOrderDetails(orderId);
    if (!order) {
      throw new Error("주문 정보를 가져올 수 없습니다.");
    }
    orderDetails = order;
    setupTossPayment(orderDetails);
  } catch (error) {
    console.error("주문 상세 정보 로드 실패:", error.message);
    alert("주문 정보를 불러오는 중 문제가 발생했습니다.");
    window.location.href = "/order/order.html"; // 실패 시 주문 페이지로 리디렉션
  }
}

// 토스 결제 위젯 설정
function setupTossPayment({ order_id, total_amount }) {
  const tossPayments = TossPayments("test_ck_DnyRpQWGrNbdwvRLRnqLrKwv1M9E");

  paymentRequestButton.addEventListener("click", () => {
    tossPayments
      .requestPayment("카드", {
        amount: total_amount,
        orderId: order_id,
        orderName: "주문상품",
        successUrl: `${window.location.origin}/payment/success?orderId=${order_id}&amount=${total_amount}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${order_id}`,
      })
      .catch((error) => {
        console.error("결제 요청 실패:", error.message);
        alert("결제 요청 중 문제가 발생했습니다.");
      });
  });
}

// 결제 성공 확인
async function handlePaymentSuccess(paymentKey, orderId, amount) {
  try {
    const response = await confirmPayment(paymentKey, orderId, amount);
    if (!response) {
      throw new Error("결제 확인 실패");
    }
    alert("결제가 성공적으로 완료되었습니다.");
    window.location.href = `/order/completed.html?orderId=${orderId}`;
  } catch (error) {
    console.error("결제 확인 오류:", error.message);
    alert("결제 확인 중 문제가 발생했습니다.");
  }
}

// URL에서 orderId 추출
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");
if (!orderId) {
  alert("주문 정보가 없습니다.");
  window.location.href = "/cart/cart.html"; // 주문 정보 없으면 장바구니로 리디렉션
} else {
  loadOrderDetails(orderId);
}
