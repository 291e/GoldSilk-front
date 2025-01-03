const API_BASE_URL = "https://goldsilkaws.metashopping.kr/cart";

// **장바구니 조회**
export async function getCartItems() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch cart items");
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    throw error;
  }
}

// **장바구니에 상품 추가**
export async function addCartItem(productId, quantity) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    if (!response.ok) throw new Error("Failed to add item to cart");
    return await response.json();
  } catch (error) {
    console.error("Error adding cart item:", error.message);
    throw error;
  }
}

// **장바구니 항목 수정**
export async function updateCartItem(cartId, quantity) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) throw new Error("Failed to update cart item");
    return await response.json();
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    throw error;
  }
}

// **장바구니 항목 삭제**
export async function deleteCartItem(cartId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/${cartId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to delete cart item");
    return await response.json();
  } catch (error) {
    console.error("Error deleting cart item:", error.message);
    throw error;
  }
}

// **장바구니 비우기**
export async function clearCart() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to clear cart");
    return await response.json();
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    throw error;
  }
}
