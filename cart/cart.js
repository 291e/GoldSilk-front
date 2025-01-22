import { formatImagePath } from "../components/utils/image.js";
import {
  deleteCartItem,
  updateCartItem,
  clearCart,
  getCartItems,
} from "../services/cartService.js";
import { createOrder } from "../services/orderService.js";
import { getUserProfile } from "../services/userService.js"; // userState 추가

// DOM 요소 가져오기
const cartContainer = document.querySelector(".cart-items");
const totalPriceEl = document.getElementById("total-price");
const finalPriceEl = document.getElementById("final-price");
const clearCartButton = document.getElementById("clear-cart-button");
const paymentButton = document.getElementById("payment-button");

// 장바구니 렌더링 함수
async function renderCart() {
  try {
    const cartItems = await getCartItems();

    // 장바구니 비우기
    cartContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartContainer.innerHTML = "<p>장바구니가 비어 있습니다.</p>";
      totalPriceEl.textContent = "0 원";
      finalPriceEl.textContent = "0 원";

      return;
    }

    let totalPrice = 0;

    // 장바구니 항목 렌더링
    for (const item of cartItems) {
      const imagePath = item.images?.[0] || "default-image.jpg";
      const formattedImagePath = await formatImagePath(imagePath);

      // 옵션 데이터 파싱 및 처리
      let optionsHTML = "<p>옵션 없음</p>";
      let additionalPrice = 0; // 옵션 추가 금액 초기화
      if (item.options) {
        try {
          const optionsData =
            typeof item.options === "string"
              ? JSON.parse(item.options) // 문자열인 경우 파싱
              : item.options; // 이미 객체인 경우 바로 사용

          // `dimensions` 및 `options` 처리
          const dimensions = optionsData.dimensions
            ? Object.entries(optionsData.dimensions)
                .map(
                  ([key, value]) =>
                    `<li><strong>${key}:</strong> ${value || "N/A"}</li>`
                )
                .join("")
            : "";

          const options = optionsData.options
            ? Object.entries(optionsData.options)
                .map(([key, value]) => {
                  additionalPrice += parseInt(value.additionalPrice || 0, 10); // 추가 금액 합산
                  return `<li><strong>${
                    value.value
                  }:</strong> +${value.additionalPrice.toLocaleString()} 원</li>`;
                })
                .join("")
            : "";

          // 최종 옵션 HTML 생성
          optionsHTML = `
           <ul>
             ${dimensions ? `<li><strong>치수:</strong></li>${dimensions}` : ""}
             ${options ? `<li><strong>옵션:</strong></li>${options}` : ""}
           </ul>
         `;
        } catch (error) {
          console.warn("옵션 데이터 파싱 오류:", error);
        }
      }

      // 기본 가격과 옵션 추가 금액 계산
      const basePrice = item.price || 0; // 기본 가격 (없는 경우 0으로 처리)
      const itemTotalPrice = (basePrice + additionalPrice) * item.quantity;
      const cartItemHTML = `
        <div class="cart-item">
          <div>
            <img src="${formattedImagePath}" alt="${
        item.name || "상품 이미지"
      }" />
          </div>
          <div class="product-info">
            <span>${item.name || "상품명 없음"}</span>
          </div>
          <div>
            <span>${item.quantity}</span>
           
          </div>
     
          <div>${(item.price * item.quantity).toLocaleString()} 원</div>
          <div>${(additionalPrice * item.quantity).toLocaleString()} 원</div>
          <div>무료</div>
          <div class="cart-btn">
            <button class="delete-btn" data-id="${item.cart_id}">삭제</button>
          </div>
        </div>
      `;

      cartContainer.insertAdjacentHTML("beforeend", cartItemHTML);
      totalPrice += itemTotalPrice;
    }

    // 총 가격 업데이트
    totalPriceEl.textContent = `${totalPrice.toLocaleString()} 원`;
    finalPriceEl.textContent = `${totalPrice.toLocaleString()} 원`;
  } catch (error) {
    console.error("장바구니 렌더링 오류:", error);
    alert("장바구니를 불러오는 중 문제가 발생했습니다.");
  }
}

// 장바구니 항목 삭제
cartContainer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const cartId = event.target.dataset.id;

    try {
      await deleteCartItem(cartId);
      alert("장바구니에서 항목이 삭제되었습니다.");
      renderCart(); // 장바구니 다시 렌더링
    } catch (error) {
      console.error("항목 삭제 오류:", error);
      alert("장바구니 항목 삭제 중 문제가 발생했습니다.");
    }
  }
});

// 수량 업데이트
// cartContainer.addEventListener("input", async (event) => {
//   if (event.target.type === "number") {
//     const cartId = event.target.dataset.id;
//     const quantity = parseInt(event.target.value, 10);

//     if (quantity < 1) {
//       alert("수량은 1 이상이어야 합니다.");
//       event.target.value = 1;
//       return;
//     }

//     try {
//       await updateCartItem(cartId, quantity);
//       renderCart(); // 장바구니 다시 렌더링
//     } catch (error) {
//       console.error("수량 업데이트 오류:", error);
//       alert("수량 업데이트 중 문제가 발생했습니다.");
//     }
//   }
// });

// 장바구니 비우기
clearCartButton.addEventListener("click", async () => {
  if (confirm("장바구니를 비우시겠습니까?")) {
    try {
      await clearCart();
      alert("장바구니가 비워졌습니다.");
      renderCart(); // 장바구니 다시 렌더링
    } catch (error) {
      console.error("장바구니 비우기 오류:", error);
      alert("장바구니 비우기 중 문제가 발생했습니다.");
    }
  }
});

// 결제하기 버튼 클릭 시
paymentButton.addEventListener("click", async () => {
  try {
    const cartItems = await getCartItems();

    if (cartItems.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      return;
    }

    // 사용자 정보 가져오기
    const user = await getUserProfile();
    if (!user) {
      alert("로그인이 필요합니다.");
      window.location.href = "/user/login.html"; // 로그인 페이지로 리디렉션
      return;
    }

    const userId = user.user_id; // 사용자 ID

    // `validOrderId` 생성 (6~64자, 영문/숫자/-/_ 조합)
    function generateValidOrderId(length = 12) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      let result = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
      }
      return result;
    }

    const validOrderId = generateValidOrderId();

    // 주문 생성 데이터 준비
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const newOrder = {
      user_id: userId, // 로그인된 사용자 ID 사용
      total_amount: totalAmount,
      valid_order_id: validOrderId,
      shipping_address: "", // 배송 주소 초기화
      recipient_name: "", // 수령인 이름 초기화
      phone_number: "", // 전화번호 초기화
      message: "", // 요청 사항 초기화
      cart_items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log("Creating order with data:", newOrder);

    const createdOrder = await createOrder(newOrder);

    if (!createdOrder) {
      throw new Error("주문 생성 실패");
    }

    console.log("Created order ID:", createdOrder.order.order_id);

    window.location.href = `/order/order.html?orderId=${createdOrder.order.order_id}&userId=${userId}`;
  } catch (error) {
    console.error("결제 처리 중 오류:", error);
    alert("결제 처리 중 문제가 발생했습니다.");
  }
});

// 초기 렌더링
renderCart();
