const API_BASE_URL = "https://goldsilk.net";

// 공통 헤더 설정 함수
function getAuthHeaders() {
  const token = localStorage.getItem("refresh_token");
  if (!token) throw new Error("JWT 토큰이 없습니다.");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * 이메일 중복 확인
 */
export async function checkEmailDuplicate(email) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "이메일 중복 확인 실패");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Email Duplicate Check Error:", error.message);
    throw error;
  }
}

/**
 * 회원가입
 */
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "회원가입 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during registration:", error.message);
    throw error;
  }
}

/**
 * 로그인
 */
export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "로그인 실패");
    }

    const data = await response.json();

    // 토큰 저장
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data.user;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
}

/**
 * 로그아웃
 */
export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

/**
 * 유저 정보 조회
 */
export async function getUserProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getUserProfile:", error.message);
    throw error;
  }
}

/**
 * 유저 정보 수정
 */
export async function updateUserProfile(userId, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "유저 정보 수정 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    throw error;
  }
}

/**
 * 비밀번호 변경
 */
export async function changePassword(userId, passwords) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${userId}/password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "비밀번호 변경 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error changing password:", error.message);
    throw error;
  }
}

/**
 * 회원 탈퇴
 */
export async function deleteUser(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "회원 탈퇴 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
}

/**
 * 리프레시 토큰으로 액세스 토큰 갱신
 */
export async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("리프레시 토큰이 없습니다.");

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "토큰 갱신 실패");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.token);
    return data.token;
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    throw error;
  }
}
