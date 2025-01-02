const API_BASE_URL = "https://goldsilkaws.metashopping.kr";

/**
 * 모든 상품 조회
 * @param {Object} [params] - 선택적 필터 매개변수
 * @returns {Promise<Array>}
 */
export async function getAllProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${query}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
}

/**
 * 특정 상품 조회
 * @param {number} productId - 상품 ID
 * @returns {Promise<Object>}
 */
export async function getProductById(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    throw error;
  }
}

/**
 * 상품 생성 (관리자 전용)
 * @param {Object} productData - 상품 데이터
 * @returns {Promise<Object>}
 */
export async function createProduct(productData) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error.message);
    throw error;
  }
}

/**
 * 상품 수정 (관리자 전용)
 * @param {number} productId - 상품 ID
 * @param {Object} updates - 수정 데이터
 * @returns {Promise<Object>}
 */
export async function updateProduct(productId, updates) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw error;
  }
}

/**
 * 상품 삭제 (관리자 전용)
 * @param {number} productId - 상품 ID
 * @returns {Promise<Object>}
 */
export async function deleteProduct(productId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw error;
  }
}

/**
 * 검색된 상품 조회
 * @param {string} query - 검색어
 * @returns {Promise<Array>}
 */
export async function searchProducts(query) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/search?query=${query}`
    );
    if (!response.ok) throw new Error("Failed to search products");
    return await response.json();
  } catch (error) {
    console.error("Error searching products:", error.message);
    throw error;
  }
}

/**
 * 상품 필터링
 * @param {Object} filters - 필터 조건
 * @returns {Promise<Array>}
 */
export async function filterProducts(filters) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(
      `${API_BASE_URL}/products/filter?${queryParams}`
    );
    if (!response.ok) throw new Error("Failed to filter products");
    return await response.json();
  } catch (error) {
    console.error("Error filtering products:", error.message);
    throw error;
  }
}

/**
 * 비슷한 상품 조회
 * @param {number} productId - 상품 ID
 * @returns {Promise<Array>}
 */
export async function getSimilarProducts(productId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/similar`
    );
    if (!response.ok) throw new Error("Failed to fetch similar products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching similar products:", error.message);
    throw error;
  }
}
