const API_BASE_URL = "https://goldsilk.net/reviews";

// **토큰 가져오기**
function getToken() {
  const token = localStorage.getItem("refresh_token");
  if (!token) {
    throw new Error("사용자 인증 토큰이 없습니다. 로그인하세요.");
  }
  return token;
}

// **리뷰 가져오기**
export async function getReviewsByProduct(productId) {
  try {
    const token = localStorage.getItem("refresh_token");
    if (!token) throw new Error("사용자 인증 토큰이 없습니다. 로그인하세요.");

    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // 인증 토큰 추가
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reviews.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

// **모든 리뷰 가져오기**
export async function getAllReviews() {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all reviews.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    throw error;
  }
}

// **리뷰 작성**
export async function createReview(productId, reviewData) {
  try {
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("rating", reviewData.rating);
    formData.append("title", reviewData.title);
    formData.append("comment", reviewData.comment);

    // 이미지 파일 추가
    if (reviewData.image) {
      formData.append("review_images", reviewData.image);
    }

    const token = getToken();

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create review.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

// **리뷰 수정**
export async function updateReview(reviewId, updatedData) {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update review.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
}

// **리뷰 삭제**
export async function deleteReview(reviewId) {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete review.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}
