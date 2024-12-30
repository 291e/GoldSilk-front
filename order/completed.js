import "../styles/payment.css";

// URL에서 필요한 정보를 가져옴
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");
const totalAmount = urlParams.get("amount");

// DOM 요소 가져오기
const orderIdElement = document.getElementById("order-id");
const totalAmountElement = document.getElementById("total-amount");
const viewOrderButton = document.getElementById("view-order-btn");

// 주문 상세 정보 표시
orderIdElement.textContent = orderId || "알 수 없음";
totalAmountElement.textContent = totalAmount
  ? `${totalAmount} 원`
  : "알 수 없음";

// "주문 상세보기" 버튼에 링크 설정
if (orderId) {
  viewOrderButton.href = `/order/details.html?orderId=${orderId}`;
} else {
  viewOrderButton.style.display = "none"; // 주문 ID가 없으면 버튼 숨김
}

// 콘솔에 완료 정보 로깅 (디버깅 용도)
console.log("주문 완료 정보:", { orderId, totalAmount });
