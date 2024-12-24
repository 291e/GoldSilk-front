import { CART_BASE_URL } from "../config/config";
import { authFetch } from "./auth";
import { handleError } from "../utils/errorHandler";

export async function getCartItems() {
  try {
    return await authFetch(CART_BASE_URL);
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function addItemToCart(productId, quantity) {
  try {
    return await authFetch(CART_BASE_URL, {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function updateCartItem(cartId, quantity) {
  try {
    return await authFetch(`${CART_BASE_URL}/${cartId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function deleteCartItem(cartId) {
  try {
    return await authFetch(`${CART_BASE_URL}/${cartId}`, {
      method: "DELETE",
    });
  } catch (error) {
    handleError(error);
    return false;
  }
}

export async function clearCart() {
  try {
    return await authFetch(CART_BASE_URL, { method: "DELETE" });
  } catch (error) {
    handleError(error);
    return false;
  }
}
