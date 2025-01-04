const API_BASE_URL = "https://goldsilkaws.metashopping.kr";

/**
 * 어드민 대시보드 데이터 가져오기
 * @returns {Promise<Object>} - 대시보드 데이터
 */
export async function getAdminDashboard() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "대시보드 데이터를 불러올 수 없습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching admin dashboard:", error.message);
    throw error;
  }
}

/**
 * 모든 사용자 가져오기
 * @returns {Promise<Array>} - 사용자 리스트
 */
export async function getAllUsers() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "사용자 데이터를 불러올 수 없습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    throw error;
  }
}

/**
 * 상품 생성
 * @param {Object} productData - 상품 데이터
 * @param {File} mainImage - 메인 이미지 파일
 * @param {File[]} detailImages - 디테일 이미지 파일 배열
 * @returns {Promise<Object>} - 생성된 상품 정보
 */
export async function createProduct(productData, mainImage, detailImages) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    // FormData 생성
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("description", productData.description || "");
    formData.append("category", productData.category || "");
    formData.append("tags", JSON.stringify(productData.tags || []));

    if (mainImage) formData.append("main_image", mainImage);
    if (detailImages && detailImages.length > 0) {
      detailImages.forEach((image, index) => {
        formData.append(`detail_images[${index}]`, image);
      });
    }

    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "상품 생성에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error.message);
    throw error;
  }
}
/**
 * 상품 수정
 * @param {number} productId - 상품 ID
 * @param {Object} updates - 수정할 데이터
 * @param {File} [mainImage] - 메인 이미지 파일 (선택적)
 * @param {File} [detailImage] - 디테일 이미지 파일 (선택적)
 * @returns {Promise<Object>} - 수정된 상품 정보
 */
export async function updateProduct(
  productId,
  updates,
  mainImage,
  detailImage
) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    // FormData 생성
    const formData = new FormData();

    // 업데이트 필드 추가
    if (updates.name) formData.append("name", updates.name.trim());
    if (updates.price) formData.append("price", updates.price.toString());
    if (updates.category) formData.append("category", updates.category.trim());
    if (updates.tags && updates.tags.length > 0) {
      formData.append("tags", JSON.stringify(updates.tags));
    }

    // 이미지 파일 추가
    if (mainImage) {
      console.log("Adding main image to FormData:", mainImage.name);
      formData.append("main_image", mainImage);
    }
    if (detailImage) {
      console.log("Adding detail image to FormData:", detailImage.name);
      formData.append("detail_image", detailImage);
    }

    // FormData 내용 디버깅
    formData.forEach((value, key) => {
      console.log(`FormData Key: ${key}, Value: ${value}`);
    });

    // API 요청
    const response = await fetch(
      `${API_BASE_URL}/admin/products/${productId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // FormData 전달
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Server responded with error:", error);
      throw new Error(error.message || "상품 수정에 실패했습니다.");
    }

    console.log("Product updated successfully.");
    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw error;
  }
}

export async function uploadProductImages(productId, mainImage, detailImage) {
  try {
    const formData = new FormData();
    if (mainImage) formData.append("main_image", mainImage);
    if (detailImage) formData.append("detail_image", detailImage);

    const response = await fetch(
      `${API_BASE_URL}/admin/products/${productId}/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading images:", error.message);
    throw error;
  }
}

export async function updateProductAttributes(productId, updates) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update product attributes");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating product attributes:", error.message);
    throw error;
  }
}

/**
 * 상품 삭제
 * @param {number} productId - 상품 ID
 * @returns {Promise<Object>} - 삭제된 상품 정보
 */
export async function deleteProduct(productId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/admin/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "상품 삭제에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw error;
  }
}

/**
 * 모든 주문 조회
 * @returns {Promise<Array>} - 주문 리스트
 */
export async function getAllOrders() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 데이터를 불러올 수 없습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    throw error;
  }
}

/**
 * 특정 주문 조회
 * @param {number} orderId - 주문 ID
 * @returns {Promise<Object>} - 주문 상세 정보
 */
export async function getOrderById(orderId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 정보를 불러올 수 없습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order by ID:", error.message);
    throw error;
  }
}

/**
 * 주문 상태 변경
 * @param {number} orderId - 주문 ID
 * @param {string} status - 변경할 상태
 * @returns {Promise<Object>} - 변경된 주문 정보
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/orders/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order_id: orderId, status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 상태 변경에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order status:", error.message);
    throw error;
  }
}
/**
 * 커뮤니티 게시글 작성
 * @param {Object} postData - 게시글 데이터
 * @param {File} [image] - 게시글 이미지 파일 (선택적)
 * @returns {Promise<Object>} - 생성된 게시글 정보
 */
export async function createCommunityPost(postData, image) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    // FormData 생성
    const formData = new FormData();
    formData.append("user_id", postData.user_id);
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("type", postData.type);
    if (postData.status) formData.append("status", postData.status);
    if (image) formData.append("image", image);

    const response = await fetch(`${API_BASE_URL}/admin/community`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "게시글 생성에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating community post:", error.message);
    throw error;
  }
}

/**
 * 커뮤니티 게시글 수정
 * @param {number} postId - 게시글 ID
 * @param {Object} updates - 수정 데이터
 * @param {File} [image] - 새 이미지 파일 (선택적)
 * @returns {Promise<Object>} - 수정된 게시글 정보
 */
export async function updateCommunityPost(postId, updates, image) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    // FormData 생성
    const formData = new FormData();
    if (updates.title) formData.append("title", updates.title);
    if (updates.content) formData.append("content", updates.content);
    if (updates.type) formData.append("type", updates.type);
    if (updates.status) formData.append("status", updates.status);
    if (image) formData.append("image", image);

    const response = await fetch(`${API_BASE_URL}/admin/community/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "게시글 수정에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating community post:", error.message);
    throw error;
  }
}

/**
 * 커뮤니티 게시글 삭제
 * @param {number} postId - 게시글 ID
 * @returns {Promise<Object>} - 삭제된 게시글 정보
 */
export async function deleteCommunityPost(postId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/community/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "게시글 삭제에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting community post:", error.message);
    throw error;
  }
}

/**
 * 리뷰 수정
 * @param {number} reviewId - 리뷰 ID
 * @param {Object} updates - 수정 데이터
 * @returns {Promise<Object>} - 수정된 리뷰 정보
 */
export async function updateReview(reviewId, updates) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "리뷰 수정에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating review:", error.message);
    throw error;
  }
}

/**
 * 리뷰 삭제
 * @param {number} reviewId - 리뷰 ID
 * @returns {Promise<Object>} - 삭제된 리뷰 정보
 */
export async function deleteReview(reviewId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "리뷰 삭제에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting review:", error.message);
    throw error;
  }
}

/**
 * 주문 취소 (어드민)
 * @param {number} orderId - 주문 ID
 * @returns {Promise<Object>} - 취소된 주문 정보
 */
export async function cancelOrder(orderId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/admin/orders/${orderId}/cancel`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 취소에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error cancelling order:", error.message);
    throw error;
  }
}

/**
 * 주문 복원 (어드민)
 * @param {number} orderId - 주문 ID
 * @returns {Promise<Object>} - 복원된 주문 정보
 */
export async function restoreOrder(orderId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/admin/orders/${orderId}/restore`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 복원에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error restoring order:", error.message);
    throw error;
  }
}

/**
 * 특정 게시글의 댓글 조회
 * @param {number} communityId - 커뮤니티 게시글 ID
 * @returns {Promise<Array>} - 댓글 리스트
 */
export async function getCommentsByPost(communityId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/admin/comments/${communityId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "댓글 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching comments by post:", error.message);
    throw error;
  }
}

/**
 * 댓글 삭제
 * @param {number} commentId - 댓글 ID
 * @returns {Promise<Object>} - 삭제된 댓글 정보
 */
export async function deleteComment(commentId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/admin/comments/${commentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "댓글 삭제에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    throw error;
  }
}

/**
 * 댓글 상태 변경
 * @param {number} commentId - 댓글 ID
 * @param {string} status - 변경할 상태 ("active" 또는 "inactive")
 * @returns {Promise<Object>} - 변경된 댓글 정보
 */
export async function updateCommentStatus(commentId, status) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/admin/comments/${commentId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "댓글 상태 변경에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating comment status:", error.message);
    throw error;
  }
}

/**
 * 주문 통계 조회
 * @returns {Promise<Object>} - 주문 통계 데이터
 */
export async function getOrderStats() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/order_stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 통계 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order stats:", error.message);
    throw error;
  }
}

/**
 * 상품 판매 통계 조회
 * @returns {Promise<Array>} - 상품 판매 통계 리스트
 */
export async function getProductSalesStats() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/product_sales_stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "상품 판매 통계 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product sales stats:", error.message);
    throw error;
  }
}

/**
 * 회원 가입 통계 조회
 * @returns {Promise<Object>} - 회원 가입 통계 데이터
 */
export async function getUserSignupStats() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/user_signup_stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "회원 가입 통계 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user signup stats:", error.message);
    throw error;
  }
}

/**
 * 리뷰 통계 조회
 * @returns {Promise<Array>} - 리뷰 통계 리스트
 */
export async function getReviewStats() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/admin/review_stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "리뷰 통계 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching review stats:", error.message);
    throw error;
  }
}
