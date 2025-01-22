import { formatImagePath } from "../components/utils/image.js";
import { getOrderById, updateOrderDetails } from "../services/orderService.js";

// URL에서 orderId 추출 (ex: ?orderId=...)
const urlParams = new URLSearchParams(window.location.search);
const orderIdParam = urlParams.get("orderId"); // DB에 있는 serial/uuid와 매핑해도 좋음

console.log("Extracted orderId:", orderIdParam);
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
async function renderOrdererDetails(orderDetails) {
  try {
    const user = orderDetails?.users; // 안전하게 접근
    if (!user) throw new Error("주문자 정보를 가져올 수 없습니다.");

    ordererNameInput.value = user.username || "";
    ordererEmailInput.value = user.email || "";
    ordererPhoneInput.value = user.phone || "";

    console.log("주문자 정보:", user);
  } catch (error) {}
}

// ----- [3] 주문 상세 정보 렌더링 -----
async function renderOrderDetails() {
  try {
    if (!orderIdParam) throw new Error("orderId가 없습니다.");

    const orderDetails = await getOrderById(orderIdParam);
    if (!orderDetails) throw new Error("주문 정보를 가져올 수 없습니다.");

    console.log("주문 상세 정보:", orderDetails);

    // 주문자 정보 렌더링
    await renderOrdererDetails(orderDetails);

    // 주문 아이템 렌더링
    const renderedItems = await Promise.all(
      orderDetails.order_items.map(async (item) => {
        const product = item.products;
        const imagePath = product?.images?.[0]
          ? await formatImagePath(product.images[0])
          : "/path/to/default-image.jpg";

        return `
          <div class="order-item">
            <img src="${imagePath}" alt="${product.name || "상품명 없음"}" />
            <div class="order-info">
              <p>${product.name || "상품명 없음"}</p>
              <p>수량: ${item.quantity}</p>
              <p>${(item.price * item.quantity).toLocaleString()} 원</p>
            </div>
          </div>
        `;
      })
    );

    orderDetailsContainer.innerHTML = renderedItems.join("");
    totalAmountEl.textContent = `${orderDetails.total_amount.toLocaleString()} 원`;

    // 배송정보
    recipientNameInput.value = orderDetails.recipient_name || "";
    phoneNumberInput.value = orderDetails.phone_number || "";
    shippingAddressInput.value = orderDetails.shipping_address || "";
    messageInput.value = orderDetails.message || "";

    // 결제용 valid_order_id 저장
    paymentButton.dataset.validOrderId = orderDetails.valid_order_id;
  } catch (error) {
    console.error("주문 상세 정보 로드 오류:", error.message);
    alert("주문 정보를 불러오는 중 문제가 발생했습니다.");
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

// ----- [6] 토스페이먼츠 표준 결제창 초기화 -----
const clientKey = "test_ck_LlDJaYngroyWNqlQOP2K3ezGdRpX";
const customerKey = "RiXaHh9k1gEshLSX299N9"; // 유추 불가능한 식별자(회원ID 등)
const tossPayments = TossPayments(clientKey);
const payment = tossPayments.payment({ customerKey });
console.log("TossPayments 객체 타입:", typeof TossPayments); // 'function'이어야 함

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
    const validOrderId = paymentButton.dataset.validOrderId;
    if (!validOrderId) {
      alert("유효한 주문 ID가 없습니다. 주문 정보를 다시 확인하세요.");
      return;
    }

    // 4) 결제창 호출
    await payment
      .requestPayment({
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
      })
      .then(() => console.log("결제 요청 성공"));
  } catch (error) {
    console.error("결제 요청 오류:", error);
    alert("결제 요청 중 문제가 발생했습니다.\n" + error);
  }
});

// ----- [8] 페이지 로드 시 실행 -----
document.addEventListener("DOMContentLoaded", () => {
  renderOrdererDetails();
  renderOrderDetails();
});
