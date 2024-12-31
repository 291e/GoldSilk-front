const API_BASE_URL = "https://goldsilkaws.metashopping.kr";

/**
 * 이벤트 알림 보내기 (어드민 전용)
 * @param {Object} notificationData - 알림 데이터 (user_id, title, message)
 * @returns {Promise<Object>} - 생성된 알림 정보
 */
export async function sendEventNotification(notificationData) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("관리자 권한이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/notifications/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "이벤트 알림 전송 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending event notification:", error.message);
    throw error;
  }
}

/**
 * 주문 알림 보내기 (어드민 전용)
 * @param {Object} notificationData - 알림 데이터 (user_id, title, message)
 * @returns {Promise<Object>} - 생성된 알림 정보
 */
export async function sendOrderNotification(notificationData) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("관리자 권한이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/notifications/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 알림 전송 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending order notification:", error.message);
    throw error;
  }
}

/**
 * 시스템 알림 생성 (어드민 전용)
 * @param {Object} notificationData - 알림 데이터 (title, message)
 * @returns {Promise<Object>} - 생성된 시스템 알림 정보
 */
export async function createSystemNotification(notificationData) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("관리자 권한이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/notifications/system`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "시스템 알림 생성 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating system notification:", error.message);
    throw error;
  }
}

/**
 * 사용자 알림 조회
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} - 사용자의 알림 리스트
 */
export async function getUserNotifications(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "알림 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user notifications:", error.message);
    throw error;
  }
}

/**
 * 알림 목록 조회 (로그인된 사용자용)
 * @returns {Promise<Array>} - 로그인된 사용자의 알림 리스트
 */
export async function getNotifications() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "알림 목록 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    throw error;
  }
}

/**
 * 알림 읽음 처리
 * @param {string} notificationId - 알림 ID
 * @returns {Promise<Object>} - 읽음 처리된 알림 정보
 */
export async function markNotificationAsRead(notificationId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "알림 읽음 처리 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
    throw error;
  }
}
