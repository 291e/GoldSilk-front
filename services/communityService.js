const API_BASE_URL = "https://goldsilkaws.metashopping.kr";

/**
 * 모든 커뮤니티 게시글 조회
 * @returns {Promise<Array>} - 활성 상태의 게시글 리스트
 */
export async function getCommunityPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/community`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "커뮤니티 게시글 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching community posts:", error.message);
    throw error;
  }
}

/**
 * 댓글 작성
 * @param {string} communityId - 커뮤니티 게시글 ID
 * @param {string} content - 댓글 내용
 * @returns {Promise<Object>} - 작성된 댓글 정보
 */
export async function addComment(communityId, content) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/community/${communityId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "댓글 작성 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding comment:", error.message);
    throw error;
  }
}

/**
 * 게시글 신고
 * @param {string} communityId - 커뮤니티 게시글 ID
 * @returns {Promise<Object>} - 신고된 게시글 정보
 */
export async function reportPost(communityId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/community/${communityId}/report`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "게시글 신고 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error reporting post:", error.message);
    throw error;
  }
}

/**
 * 이벤트 참여
 * @param {string} eventId - 이벤트 ID
 * @returns {Promise<Object>} - 이벤트 참여 결과
 */
export async function participateInEvent(eventId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/community/${eventId}/participate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "이벤트 참여 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error participating in event:", error.message);
    throw error;
  }
}
