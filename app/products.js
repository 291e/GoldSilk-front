import { PRODUCTS_BASE_URL } from "../config/config";
import { apiFetch } from "./fetchUtils";
import { handleError } from "../utils/errorHandler";

export async function getProducts() {
  try {
    return await apiFetch(PRODUCTS_BASE_URL);
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getProductById(productId) {
  try {
    return await apiFetch(`${PRODUCTS_BASE_URL}/${productId}`);
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function createProduct(productData) {
  try {
    return await apiFetch(PRODUCTS_BASE_URL, {
      method: "POST",
      body: JSON.stringify(productData),
    });
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function updateProduct(productId, productData) {
  try {
    return await apiFetch(`${PRODUCTS_BASE_URL}/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function deleteProduct(productId) {
  try {
    await apiFetch(`${PRODUCTS_BASE_URL}/${productId}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    handleError(error);
    return false;
  }
}
