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
      const options = item.options ? JSON.parse(item.options) : null;
      const dimensions = options?.dimensions || {};
      const selectedOptions = options?.options || {};

      // 추가 가격 계산
      const additionalPrice = Object.values(selectedOptions).reduce(
        (acc, option) => acc + (option.additionalPrice || 0),
        0
      );

      const totalItemPrice =
        (item.products.price + additionalPrice) * item.quantity;
      totalPrice += totalItemPrice;
      const dimensionsHTML = Object.entries(dimensions)
        .map(([key, value]) => `<li>${key}: ${value ? value : "없음"}</li>`)
        .join("");

      const optionsHTML = Object.values(selectedOptions)
        .map(
          (option) =>
            `<li>${
              option.value
            } (${option.additionalPrice.toLocaleString()} 원)</li>`
        )
        .join("");

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

    // 주문 생성 데이터 준비
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const newOrder = {
      user_id: userId, // 로그인된 사용자 ID 사용
      total_amount: totalAmount,
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
