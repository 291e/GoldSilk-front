const AUTH_URL = "https://goldsilkaws.metashopping.kr/auth";

// **회원가입**
export async function registerUser(userData) {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to register user: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error.message);
    return null;
  }
}

// **로그인**
export async function loginUser(credentials) {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Failed to login: ${response.status}`);
    }

    const result = await response.json();
    localStorage.setItem("access_token", result.token); // 액세스 토큰 저장
    localStorage.setItem("refresh_token", result.refresh_token); // 리프레시 토큰 저장
    return result;
  } catch (error) {
    console.error("Error logging in:", error.message);
    return null;
  }
}

// **사용자 정보 가져오기**
export async function fetchUserProfile() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${AUTH_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 403 || response.status === 401) {
      console.warn("Token is invalid or expired.");
      logoutUser(); // 로그아웃 처리
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
}

// **로그아웃**
export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  console.log("User logged out.");
}

// **토큰 갱신**
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    console.warn("No refresh token found. User must log in again.");
    throw new Error("Refresh token not found.");
  }

  try {
    const response = await fetch(`${AUTH_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token.");
    }

    const result = await response.json();
    localStorage.setItem("access_token", result.token); // 새 액세스 토큰 저장
    return result.token;
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
    throw error;
  }
}

// **토큰이 필요한 API 요청 처리**
export async function fetchWithToken(url, options = {}) {
  let token = localStorage.getItem("access_token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // 토큰 만료 시 갱신
    try {
      const newToken = await refreshAccessToken();
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    } catch (error) {
      console.error("Failed to refresh token or retry request:", error.message);
      logoutUser(); // 로그아웃 처리
      window.location.href = "/login"; // 로그인 페이지로 이동
    }
  }

  return response;
}
