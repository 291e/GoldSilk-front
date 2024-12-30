// orderPage.js

import { fetchOrderDetails, updateOrderDetails } from "../app/order.js";
import { fetchUserProfile } from "../app/auth.js";
import { formatImagePath } from "../components/utils/image.js";

// URL에서 orderId 추출 (ex: ?orderId=...)
const urlParams = new URLSearchParams(window.location.search);
const orderIdParam = urlParams.get("orderId"); // DB에 있는 serial/uuid와 매핑해도 좋음

// DOM 요소
const orderDetailsContainer = document.getElementById("order-details");
const totalAmountEl = document.getElementById("total-amount");
const paymentButton = document.getElementById("payment-button");

const recipientNameInput = document.getElementById("recipient-name");
const phoneNumberInput = document.getElementById("phone-number");
const shippingAddressInput = document.getElementById("shipping-address");
const postalCodeInput = document.getElementById("postal-code");
const messageInput = document.getElementById("message");

const ordererNameInput = document.getElementById("orderer-name");
const ordererEmailInput = document.getElementById("orderer-email");
const ordererPhoneInput = document.getElementById("orderer-phone");

const sameAsOrdererCheckbox = document.getElementById("same-as-orderer");
const searchAddressButton = document.getElementById("search-address-button");
const detailAddressInput = document.getElementById("detail-address");

// ----- [1] Daum 주소 검색 -----
function openAddressSearch() {
  new daum.Postcode({
    oncomplete: function (data) {
      postalCodeInput.value = data.zonecode;
      shippingAddressInput.value = data.roadAddress || data.jibunAddress;
      detailAddressInput.focus();
    },
    width: "100%",
    height: "100%",
  }).open();
}
searchAddressButton.addEventListener("click", openAddressSearch);

// ----- [2] 주문자 정보 렌더링 -----
async function renderOrdererDetails() {
  try {
    const userProfile = await fetchUserProfile(); // 토큰 인증 후 사용자 정보
    if (!userProfile) {
      throw new Error("사용자 정보를 가져올 수 없습니다.");
    }
    ordererNameInput.value = userProfile.username || "";
    ordererEmailInput.value = userProfile.email || "";
    ordererPhoneInput.value = userProfile.phone || "";
  } catch (error) {
    console.error("주문자 정보 로드 오류:", error.message);
  }
}

// ----- [3] 주문 상세 정보 렌더링 -----
async function renderOrderDetails() {
  try {
    const orderDetails = await fetchOrderDetails(orderIdParam);
    if (!orderDetails) {
      throw new Error("주문 정보를 불러올 수 없습니다.");
    }

    const renderedItems = await Promise.all(
      orderDetails.orderItems.map(async (item) => {
        const imagePath = await formatImagePath(item.images?.[0]);
        return `
          <div class="order-item">
            <img src="${imagePath}" alt="${item.name}" />
            <div class="order-info">
              <p>${item.name}</p>
              <p>수량: ${item.quantity}</p>
              <p>${(item.price * item.quantity).toLocaleString()} 원</p>
            </div>
          </div>
        `;
      })
    );

    orderDetailsContainer.innerHTML = renderedItems.join("");
    totalAmountEl.textContent = `${(
      orderDetails.order.total_amount || 0
    ).toLocaleString()} 원`;

    // 배송정보
    recipientNameInput.value = orderDetails.order.recipient_name || "";
    phoneNumberInput.value = orderDetails.order.phone_number || "";
    shippingAddressInput.value = orderDetails.order.shipping_address || "";
    messageInput.value = orderDetails.order.message || "";
  } catch (error) {
    console.error("주문 상세 정보 로드 오류:", error.message);
  }
}

// ----- [4] "주문자 정보와 동일" 체크 -----
sameAsOrdererCheckbox.addEventListener("change", () => {
  if (sameAsOrdererCheckbox.checked) {
    recipientNameInput.value = ordererNameInput.value;
    phoneNumberInput.value = ordererPhoneInput.value;
  } else {
    recipientNameInput.value = "";
    phoneNumberInput.value = "";
  }
});

// ----- [5] 유효한 orderId 생성 함수 -----
// 영문 대소문자, 숫자, -, _만 허용, 길이 6~64자
function generateValidOrderId(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  if (length < 6) length = 6;
  if (length > 64) length = 64;

  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

// ----- [6] 토스페이먼츠 표준 결제창 초기화 -----
const clientKey = "test_ck_AQ92ymxN34Zj26oj17mArajRKXvd"; // 예시용
const customerKey = "RiXaHh9k1gEshLSX299N9"; // 유추 불가능한 식별자(회원ID 등)
const tossPayments = TossPayments(clientKey);
const payment = tossPayments.payment({ customerKey });

// ----- [7] 결제하기 버튼 -----
paymentButton.addEventListener("click", async () => {
  try {
    // 1) 배송 정보 업데이트
    const updatedOrder = {
      recipient_name: recipientNameInput.value.trim(),
      phone_number: phoneNumberInput.value.trim(),
      shipping_address: shippingAddressInput.value.trim(),
      message: messageInput.value.trim(),
    };
    if (
      !updatedOrder.recipient_name ||
      !updatedOrder.phone_number ||
      !updatedOrder.shipping_address
    ) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }
    // 서버에 배송정보 업데이트
    await updateOrderDetails(orderIdParam, updatedOrder);

    // 2) 최종 결제 금액
    const amount = parseInt(
      totalAmountEl.textContent.replace(" 원", "").replace(/,/g, ""),
      10
    );

    // 3) 결제용 orderId 생성 (영문/숫자/-/_; 6~64자)
    //    혹은 DB에 이미 난수 형태로 저장된 order_uuid가 있다면 그 값을 사용
    const validOrderId = generateValidOrderId(12);

    // 4) 결제창 호출
    await payment.requestPayment({
      method: "CARD",
      amount: {
        currency: "KRW",
        value: amount,
      },
      orderId: validOrderId, // 토스페이먼츠에서 요구하는 형식
      orderName: "Gold Silk Shop Order",
      successUrl: window.location.origin + "/toss/success.html",
      failUrl: window.location.origin + `/toss/fail.html`,
      customerEmail: ordererEmailInput.value || "customer123@gmail.com",
      customerName: ordererNameInput.value || "김토스",
      card: {
        useEscrow: false,
        flowMode: "DEFAULT",
        useCardPoint: false,
        useAppCardOnly: false,
      },
    });
  } catch (error) {
    console.error("결제 요청 오류:", error.message);
    alert("결제 요청 중 문제가 발생했습니다.\n" + error.message);
  }
});

// ----- [8] 페이지 로드 시 실행 -----
document.addEventListener("DOMContentLoaded", () => {
  renderOrdererDetails();
  renderOrderDetails();
});
