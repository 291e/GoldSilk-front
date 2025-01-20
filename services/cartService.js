const API_BASE_URL = "https://goldsilk.net/cart";

// **장바구니 조회**
export async function getCartItems() {
  try {
    const token = localStorage.getItem("refresh_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch cart items");
    }

    const cartItems = await response.json();
    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
}

// **장바구니에 상품 추가**
export async function addCartItem(productId, quantity, options = {}) {
  try {
    const token = localStorage.getItem("refresh_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity, options }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add item to cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding cart item:", error);
    throw error;
  }
}

// **장바구니 항목 수정**
export async function updateCartItem(cartId, quantity, options = {}) {
  try {
    const token = localStorage.getItem("refresh_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity, options }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update cart item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}

// **장바구니 항목 삭제**
export async function deleteCartItem(cartId) {
  try {
    const token = localStorage.getItem("refresh_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/${cartId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete cart item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error;
  }
}

// **장바구니 비우기**
export async function clearCart() {
  try {
    const token = localStorage.getItem("refresh_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to clear cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}
