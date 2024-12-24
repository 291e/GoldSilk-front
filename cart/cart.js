import {
  fetchCart,
  addToCart,
  deleteCartItem,
  updateCartItem,
  clearCart,
} from "../api/api.js";
import { formatImagePath } from "../components/utils/image.js";

// DOM 요소 가져오기
const cartContainer = document.querySelector(".cart-items");
const totalPriceEl = document.getElementById("total-price");
const finalPriceEl = document.getElementById("final-price");
const clearCartButton = document.getElementById("clear-cart-button");

// 장바구니 렌더링 함수
async function renderCart() {
  try {
    const cartItems = await fetchCart();

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

      const cartItemHTML = `
        <div class="cart-item">
          <div>
            <img src="${formattedImagePath}" alt="${
        item.name || "상품 이미지"
      }" />
          </div>
          <div class="product-info">
            <span>${item.name || "상품명 없음"}</span>
            <span>${item.price?.toLocaleString() || "가격 정보 없음"} 원</span>
          </div>
          <div>
            <input type="number" min="1" value="${
              item.quantity || 1
            }" data-id="${item.cart_id}" />
          </div>
          <div>${(item.price * item.quantity).toLocaleString()} 원</div>
          <div>무료</div>
          <div class="cart-btn">
            <button class="order-btn" data-id="${
              item.cart_id
            }">주문하기</button>
            <button class="delete-btn" data-id="${item.cart_id}">삭제</button>
          </div>
        </div>
      `;

      cartContainer.insertAdjacentHTML("beforeend", cartItemHTML);
      totalPrice += item.price * item.quantity;
    }

    // 총 가격 업데이트
    totalPriceEl.textContent = `${totalPrice.toLocaleString()} 원`;
    finalPriceEl.textContent = `${totalPrice.toLocaleString()} 원`;
  } catch (error) {
    console.error("장바구니 렌더링 오류:", error.message);
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
      console.error("항목 삭제 오류:", error.message);
      alert("장바구니 항목 삭제 중 문제가 발생했습니다.");
    }
  }
});

// 수량 업데이트
cartContainer.addEventListener("input", async (event) => {
  if (event.target.type === "number") {
    const cartId = event.target.dataset.id;
    const quantity = parseInt(event.target.value, 10);

    if (quantity < 1) {
      alert("수량은 1 이상이어야 합니다.");
      event.target.value = 1;
      return;
    }

    try {
      await updateCartItem(cartId, quantity);
      renderCart(); // 장바구니 다시 렌더링
    } catch (error) {
      console.error("수량 업데이트 오류:", error.message);
      alert("수량 업데이트 중 문제가 발생했습니다.");
    }
  }
});

// 장바구니 비우기
clearCartButton.addEventListener("click", async () => {
  if (confirm("장바구니를 비우시겠습니까?")) {
    try {
      await clearCart();
      alert("장바구니가 비워졌습니다.");
      renderCart(); // 장바구니 다시 렌더링
    } catch (error) {
      console.error("장바구니 비우기 오류:", error.message);
      alert("장바구니 비우기 중 문제가 발생했습니다.");
    }
  }
});

// 초기 렌더링
renderCart();
