// utils/cartUtils.js

import { getCartItems } from "../services/cartService.js";

// 장바구니 수량 업데이트 함수
export async function updateCartCount() {
  try {
    const cartItems = await getCartItems();
    const cartCount = cartItems.length;

    // cartUpdated 이벤트 발행
    const event = new CustomEvent("cartUpdated", {
      detail: { count: cartCount },
    });
    window.dispatchEvent(event);

    return cartCount;
  } catch (error) {
    console.error("장바구니 업데이트 중 오류:", error);
    throw error;
  }
}
