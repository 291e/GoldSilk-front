const API_BASE_URL = "https://goldsilkaws.metashopping.kr";

/**
 * 이메일 중복 확인
 * @param {string} email - 확인할 이메일
 * @returns {Promise<{ isDuplicate: boolean, message: string }>} - 중복 여부와 메시지 반환
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

    return await response.json(); // JSON 형태의 응답 반환
  } catch (error) {
    console.error("Email Duplicate Check Error:", error.message);
    throw error; // 클라이언트에서 추가 처리를 위해 에러 전달
  }
}

/**
 * 회원가입
 * @param {Object} userData - 회원가입 데이터
 * @returns {Promise<Object>} - 회원가입 결과
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

    return await response.json(); // 성공한 경우 JSON 데이터 반환
  } catch (error) {
    console.error("Error during registration:", error.message);
    throw error;
  }
}

// 로그인
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

    // 토큰 저장 (로컬 스토리지 사용)
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data.user; // 로그인된 유저 정보 반환
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error;
  }
}

// 로그아웃
export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// 유저 정보 조회
export async function getUserProfile() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "유저 정보를 불러올 수 없습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw error;
  }
}

// 유저 정보 수정
export async function updateUserProfile(userId, updates) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

// 비밀번호 변경
export async function changePassword(userId, passwords) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/auth/${userId}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwords),
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

// 회원 탈퇴
export async function deleteUser(userId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
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

// 리프레시 토큰으로 액세스 토큰 갱신
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

    return data.token; // 새 액세스 토큰 반환
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    throw error;
  }
}
